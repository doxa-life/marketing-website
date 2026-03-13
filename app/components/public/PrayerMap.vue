<template>
  <ClientOnly>
    <div class="prayer-map-container">
      <div id="prayer-map" ref="mapContainer">
        <!-- Legend -->
        <div class="prayer-map-legend">
          <div class="prayer-map-legend__item">
            <span class="prayer-map-legend__dot" :style="{ background: COLOR_NO_PRAYER }"></span>
            <span>{{ $t('map.no_coverage') }}</span>
          </div>
          <div class="prayer-map-legend__item">
            <span class="prayer-map-legend__dot" :style="{ background: COLOR_HAS_PRAYER }"></span>
            <span>{{ $t('map.has_coverage') }}</span>
          </div>
        </div>

        <!-- Search -->
        <div ref="searchWrapRef" class="prayer-map-search">
          <input
            ref="searchInputRef"
            class="prayer-map-search__input"
            type="text"
            :placeholder="$t('map.search_placeholder')"
            autocomplete="off"
            @input="onSearchInput"
            @keydown.escape="onSearchEscape"
          >
          <div
            class="prayer-map-search__results"
            :style="{ display: searchResultsVisible ? 'block' : 'none' }"
          >
            <button
              v-for="(item, idx) in searchItems"
              :key="idx"
              class="prayer-map-search__item"
              @click="onSearchItemClick(item)"
            >
              <span class="prayer-map-search__item-name">{{ item.name }}</span>
              <span v-if="item.sub" class="prayer-map-search__item-sub">{{ item.sub }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Modal overlay -->
      <div
        class="prayer-map-overlay"
        :class="{ 'is-visible': modalVisible }"
        @click.self="closeModal"
      >
        <div class="prayer-map-modal" role="dialog">
          <button
            class="prayer-map-modal__close"
            :aria-label="$t('map.close')"
            @click="closeModal"
          >
            &times;
          </button>
          <img
            class="prayer-map-modal__image"
            :src="modalData.pictureUrl"
            :alt="modalData.name"
          >
          <div class="prayer-map-modal__body">
            <h3 class="prayer-map-modal__name">{{ modalData.name }}</h3>
            <div class="prayer-map-modal__details">
              <span><strong>{{ $t('map.language') }}:</strong> {{ modalData.language || $t('map.unknown') }}</span>
              <span><strong>{{ $t('map.country') }}:</strong> {{ modalData.country || $t('map.unknown') }}</span>
              <span><strong>{{ $t('map.population') }}:</strong> {{ formatNumber(modalData.population) }}</span>
              <span><strong>{{ $t('map.prayer_coverage') }}:</strong> {{ modalData.peopleCommitted || 0 }}/144</span>
            </div>
            <div class="prayer-map-modal__actions">
              <a
                class="prayer-map-modal__btn-pray"
                :href="prayUrl + modalData.slug + '?source=doxalife'"
                target="_blank"
              >
                {{ $t('map.pray_for_them') }}
              </a>
              <NuxtLink
                class="prayer-map-modal__btn-info"
                :to="localePath('/research/' + modalData.slug)"
                @click="closeModal"
              >
                {{ $t('map.info') }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #fallback>
      <div class="prayer-map-container">
        <div
          id="prayer-map"
          style="display: flex; align-items: center; justify-content: center;"
        >
          <span>{{ $t('common.loading') }}</span>
        </div>
      </div>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import 'mapbox-gl/dist/mapbox-gl.css'
import '~/assets/styles/prayer-map.css'
import mapboxgl from 'mapbox-gl'

interface SearchItem {
  type: 'people' | 'location'
  name: string
  sub?: string
  index?: number
  lng?: number
  lat?: number
}

interface GeoFeature {
  type: 'Feature'
  geometry: {
    type: 'Point'
    coordinates: [number, number]
  }
  properties: {
    slug: string
    name: string
    people_committed: number
    population: number
    language: string | null
    country: string | null
    picture_url: string | null
    hasPrayer: number
  }
}

const COLOR_NO_PRAYER = '#e57373'
const COLOR_HAS_PRAYER = '#4caf50'
const FALLBACK_IMAGE = 'https://pray.doxa.life/images/default-people-group.jpg'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const config = useRuntimeConfig()
const mapboxToken = config.public.mapboxToken as string

const prayUrl = computed(() => {
  const base = 'https://pray.doxa.life'
  return locale.value !== 'en' ? `${base}/${locale.value}/` : `${base}/`
})

const mapContainer = ref<HTMLElement | null>(null)
const searchWrapRef = ref<HTMLElement | null>(null)
const searchInputRef = ref<HTMLInputElement | null>(null)

let map: mapboxgl.Map | null = null
let allFeatures: GeoFeature[] = []
let highlightedSlug: string | null = null
let debounceTimer: ReturnType<typeof setTimeout> | undefined
let geocodeController: AbortController | null = null

const searchItems = ref<SearchItem[]>([])
const searchResultsVisible = ref(false)
const modalVisible = ref(false)
const modalData = ref({
  name: '',
  slug: '',
  language: null as string | null,
  country: null as string | null,
  population: null as number | null,
  peopleCommitted: 0,
  pictureUrl: FALLBACK_IMAGE,
})

function formatNumber(n: number | null | undefined): string {
  if (n == null) return t('map.unknown')
  return Number(n).toLocaleString()
}

function closeSearch() {
  searchItems.value = []
  searchResultsVisible.value = false
}

function closeModal() {
  modalVisible.value = false
}

function openModal(props: GeoFeature['properties']) {
  modalData.value = {
    name: props.name,
    slug: props.slug,
    language: props.language,
    country: props.country,
    population: props.population,
    peopleCommitted: props.people_committed || 0,
    pictureUrl: props.picture_url || FALLBACK_IMAGE,
  }
  modalVisible.value = true
}

function highlightFeature(feature: GeoFeature) {
  if (!map) return
  highlightedSlug = feature.properties.slug
  map.setPaintProperty('people-groups-dots', 'circle-color', [
    'case',
    ['==', ['get', 'slug'], highlightedSlug],
    '#ff9800',
    ['==', ['get', 'hasPrayer'], 1],
    COLOR_HAS_PRAYER,
    COLOR_NO_PRAYER,
  ])
  map.setPaintProperty('people-groups-dots', 'circle-radius', [
    'case',
    ['==', ['get', 'slug'], highlightedSlug],
    12,
    ['interpolate', ['linear'], ['zoom'], 1, 3, 5, 5, 10, 8],
  ])
}

function clearHighlight() {
  if (!highlightedSlug || !map) return
  highlightedSlug = null
  map.setPaintProperty('people-groups-dots', 'circle-color', [
    'case',
    ['==', ['get', 'hasPrayer'], 1],
    COLOR_HAS_PRAYER,
    COLOR_NO_PRAYER,
  ])
  map.setPaintProperty('people-groups-dots', 'circle-radius', [
    'interpolate', ['linear'], ['zoom'],
    1, 3, 5, 5, 10, 8,
  ])
}

function onSearchInput(event: Event) {
  const query = (event.target as HTMLInputElement).value.trim()
  if (debounceTimer) clearTimeout(debounceTimer)
  if (geocodeController) {
    geocodeController.abort()
    geocodeController = null
  }

  if (query.length < 2) {
    closeSearch()
    return
  }

  debounceTimer = setTimeout(() => {
    const lower = query.toLowerCase()
    const peopleResults: SearchItem[] = []

    for (let i = 0; i < allFeatures.length && peopleResults.length < 5; i++) {
      const name = allFeatures[i].properties.name
      if (name && name.toLowerCase().includes(lower)) {
        peopleResults.push({
          type: 'people',
          name: allFeatures[i].properties.name,
          sub: allFeatures[i].properties.country || '',
          index: i,
        })
      }
    }

    if (peopleResults.length >= 2) {
      searchItems.value = peopleResults
      searchResultsVisible.value = true
      return
    }

    geocodeController = new AbortController()
    const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxToken}&limit=3`

    fetch(geocodeUrl, { signal: geocodeController.signal })
      .then(res => res.json())
      .then((data) => {
        const locationResults: SearchItem[] = (data.features || []).map((f: any) => ({
          type: 'location' as const,
          name: f.place_name,
          lng: f.center[0],
          lat: f.center[1],
        }))
        searchItems.value = [...peopleResults, ...locationResults]
        searchResultsVisible.value = searchItems.value.length > 0
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          searchItems.value = peopleResults
          searchResultsVisible.value = peopleResults.length > 0
        }
      })
  }, 300)
}

function onSearchItemClick(item: SearchItem) {
  if (!map) return

  if (item.type === 'people' && item.index != null) {
    const feature = allFeatures[item.index]
    if (feature) {
      map.flyTo({ center: feature.geometry.coordinates, zoom: 8 })
      highlightFeature(feature)
    }
  } else if (item.lng != null && item.lat != null) {
    map.flyTo({ center: [item.lng, item.lat], zoom: 5 })
  }

  if (searchInputRef.value) searchInputRef.value.value = ''
  closeSearch()
}

function onSearchEscape() {
  if (searchInputRef.value) {
    searchInputRef.value.value = ''
    searchInputRef.value.blur()
  }
  closeSearch()
}

function onDocumentClick(e: MouseEvent) {
  if (searchWrapRef.value && !searchWrapRef.value.contains(e.target as Node)) {
    closeSearch()
  }
}

function onDocumentKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') closeModal()
}

function addSourceAndLayer(geojson: GeoJSON.FeatureCollection) {
  if (!map || map.getSource('people-groups')) return

  map.addSource('people-groups', {
    type: 'geojson',
    data: geojson,
  })

  map.addLayer({
    id: 'people-groups-dots',
    type: 'circle',
    source: 'people-groups',
    paint: {
      'circle-radius': [
        'interpolate', ['linear'], ['zoom'],
        1, 3,
        5, 5,
        10, 8,
      ],
      'circle-color': [
        'case',
        ['==', ['get', 'hasPrayer'], 1],
        COLOR_HAS_PRAYER,
        COLOR_NO_PRAYER,
      ],
      'circle-opacity': 0.85,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#ffffff',
      'circle-stroke-opacity': 0.5,
    },
  })

  map.on('click', 'people-groups-dots', (e) => {
    if (e.features && e.features.length > 0) {
      openModal(e.features[0].properties as unknown as GeoFeature['properties'])
    }
  })

  map.on('mouseenter', 'people-groups-dots', () => {
    if (map) map.getCanvas().style.cursor = 'pointer'
  })

  map.on('mouseleave', 'people-groups-dots', () => {
    if (map) map.getCanvas().style.cursor = ''
  })
}

onMounted(() => {
  if (!mapContainer.value || !mapboxToken) return

  mapboxgl.accessToken = mapboxToken

  map = new mapboxgl.Map({
    container: mapContainer.value,
    style: 'mapbox://styles/mapbox/light-v11',
    projection: 'mercator',
    center: [20, 10],
    zoom: 1.5,
    minZoom: 1,
    maxZoom: 12,
  })

  map.addControl(new mapboxgl.NavigationControl(), 'top-right')
  map.scrollZoom.disable()

  mapContainer.value.addEventListener('click', () => {
    map?.scrollZoom.enable()
  })

  mapContainer.value.addEventListener('mouseleave', () => {
    map?.scrollZoom.disable()
  })

  map.on('click', (e) => {
    if (highlightedSlug && map) {
      const features = map.queryRenderedFeatures(e.point, { layers: ['people-groups-dots'] })
      if (!features.length || (features[0].properties as any).slug !== highlightedSlug) {
        clearHighlight()
      }
    }
  })

  map.on('load', async () => {
    try {
      const apiUrl = `https://pray.doxa.life/api/people-groups/list?fields=slug,name,imb_lat,imb_lng,people_committed,population,picture_url,country,imb_reg_of_language&lang=${locale.value}`
      const data = await $fetch<{ posts: any[] }>(apiUrl)
      const posts = data.posts || []

      const features: GeoFeature[] = []
      for (const p of posts) {
        const lat = parseFloat(p.imb_lat)
        const lng = parseFloat(p.imb_lng)
        if (isNaN(lat) || isNaN(lng)) continue

        features.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [lng, lat],
          },
          properties: {
            slug: p.slug,
            name: p.name,
            people_committed: p.people_committed,
            population: p.population,
            language: p.imb_reg_of_language ? p.imb_reg_of_language.label : null,
            country: p.country ? p.country.label : null,
            picture_url: p.picture_url,
            hasPrayer: p.people_committed > 0 ? 1 : 0,
          },
        })
      }

      allFeatures = features

      addSourceAndLayer({
        type: 'FeatureCollection',
        features,
      })
    } catch (err) {
      console.error('Prayer map: failed to load people groups', err)
    }
  })

  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onDocumentKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onDocumentKeydown)
  if (geocodeController) geocodeController.abort()
  if (debounceTimer) clearTimeout(debounceTimer)
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<style scoped>
.prayer-map-container {
  width: 100%;
}
</style>
