<template>
  <div
    class="stack stack--md bg-image"
    :style="{
      backgroundImage: `url(/images/worldmap.svg)`,
      backgroundSize: '60%',
      backgroundPosition: 'top',
      minHeight: '400px',
    }"
  >
    <!-- Search -->
    <div id="filters" class="filters">
      <div class="search-box | center | max-width-md">
        <span class="sr-only">{{ $t('common.search_placeholder') }}</span>
        <svg class="search-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <use href="/icons/search.svg#search" />
        </svg>
        <input
          type="search"
          :placeholder="initialSearchTerm || $t('common.search_placeholder')"
          :value="searchTerm"
          @input="onSearchInput"
        >
      </div>
    </div>

    <!-- Results -->
    <div class="stack stack--xs">
      <div class="repel">
        <div class="font-size-sm">
          <template v-if="!hideListOnLoad && !loading">
            {{ $t('common.total') }}: {{ total }}
          </template>
          <span v-else class="invisible-placeholder">Placeholder</span>
        </div>
        <NuxtLink
          v-if="!hideSeeAllLink && !hideListOnLoad && hasMore"
          class="light-link"
          :to="localePath('/research/search/' + searchTerm)"
        >
          {{ $t('common.see_all') }}
        </NuxtLink>
      </div>

      <div
        id="results"
        class="grid | uupgs-list"
        :class="{ 'gap-md': useSelectCard }"
        :data-width-lg="!useSelectCard || undefined"
        :data-width-md="useSelectCard || undefined"
      >
        <!-- Select Card mode (pray/adopt) -->
        <template v-if="useSelectCard">
          <div
            v-for="uupg in displayedUupgs"
            :key="uupg.id"
            class="stack stack--sm | card | highlighted-uupg__card"
          >
            <div class="repel align-start">
              <img :src="uupg.picture_url" :alt="uupg.display_name">
              <p class="color-brand-lighter uppercase text-end">{{ uupg.wagf_region?.label }}</p>
            </div>
            <p>{{ uupg.display_name }}</p>
            <div class="repel">
              <p class="font-size-sm color-brand-lighter">{{ $t('common.intercessors') }}:</p>
              <p class="font-size-xl font-button">{{ uupg.people_committed ?? 0 }}/144</p>
            </div>
            <div class="switcher | text-center" data-width="md">
              <a
                class="highlighted-uupg__prayer-coverage-button button compact"
                :href="selectUrl + uupg.slug + '?source=doxalife'"
              >
                {{ selectLabel }}
              </a>
              <NuxtLink
                class="highlighted-uupg__more-button button compact outline"
                :to="localePath('/research/' + uupg.slug)"
              >
                {{ $t('common.full_profile') }}
              </NuxtLink>
            </div>
          </div>
        </template>

        <!-- Info Card mode (research) -->
        <template v-else>
          <div
            v-for="uupg in displayedUupgs"
            :key="uupg.id"
            class="card | uupg__card"
          >
            <img class="uupg__image" :src="uupg.picture_url" :alt="uupg.name">
            <div class="uupg__header">
              <h3 class="uupg__name">{{ uupg.name }}</h3>
              <p class="uupg__country">{{ uupg.country?.label }} ({{ uupg.rop1?.label }})</p>
            </div>
            <div class="uupg_adopted">
              <div>
                <img
                  :src="uupg.adopted_by_churches && uupg.adopted_by_churches > 0
                    ? '/icons/Check-GreenCircle.png'
                    : '/icons/RedX-Circle.png'"
                  :alt="uupg.adopted_by_churches && uupg.adopted_by_churches > 0
                    ? $t('research.adopted')
                    : $t('research.not_adopted')"
                >
                <span>{{
                  uupg.adopted_by_churches && uupg.adopted_by_churches > 0
                    ? $t('research.adopted')
                    : $t('research.not_adopted')
                }}</span>
              </div>
            </div>
            <p v-if="uupg.location_description" class="uupg__content">
              {{ uupg.location_description }}
            </p>
            <NuxtLink
              class="uupg__more-button button compact"
              :to="localePath('/research/' + uupg.slug)"
            >
              {{ $t('common.full_profile') }}
            </NuxtLink>
          </div>
        </template>

        <div v-if="!hideListOnLoad && loading" class="loading">
          {{ $t('common.loading') }}
        </div>
      </div>

      <!-- Load More -->
      <button
        v-if="hasMore"
        class="center | button compact stack-spacing-2xl"
        @click="loadMore"
      >
        {{ $t('common.load_more') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface KeyLabel {
  value: string
  label: string
}

interface Uupg {
  id: string
  slug: string
  name: string
  display_name: string
  wagf_region: KeyLabel
  wagf_block: KeyLabel
  country: KeyLabel
  rop1: KeyLabel
  religion: KeyLabel
  location_description: string | null
  population: number
  has_photo: boolean
  picture_url: string
  adopted_by_churches?: number
  people_praying?: number
  people_committed?: number
}

const props = withDefaults(defineProps<{
  mode?: 'pray' | 'adopt' | 'research'
  perPage?: number
  morePerPage?: number
  dontShowListOnLoad?: boolean
  useSelectCard?: boolean
  useHighlighted?: boolean
  randomizeList?: boolean
  hideSeeAllLink?: boolean
  initialSearchTerm?: string
}>(), {
  mode: 'research',
  perPage: 24,
  morePerPage: 0,
  dontShowListOnLoad: false,
  useSelectCard: false,
  useHighlighted: false,
  randomizeList: false,
  hideSeeAllLink: false,
  initialSearchTerm: '',
})

const { t, locale } = useI18n()
const localePath = useLocalePath()

const allUupgs = ref<Uupg[]>([])
const highlightedUupgs = ref<Uupg[]>([])
const filteredUupgs = ref<Uupg[]>([])
const total = ref(0)
const page = ref(1)
const searchTerm = ref(props.initialSearchTerm)
const loading = ref(true)
const hideListOnLoad = ref(props.dontShowListOnLoad)

const selectUrl = computed(() => {
  const base = 'https://pray.doxa.life'
  if (props.mode === 'adopt') {
    return locale.value !== 'en' ? `${base}/${locale.value}/adopt/` : `${base}/adopt/`
  }
  return locale.value !== 'en' ? `${base}/${locale.value}/` : `${base}/`
})

const selectLabel = computed(() => {
  return props.mode === 'adopt' ? t('nav.adopt') : t('common.select')
})

const hasMore = computed(() => {
  if (loading.value || filteredUupgs.value.length === 0) return false
  if (props.morePerPage > 0) {
    return total.value > props.perPage + (page.value - 1) * props.morePerPage
  }
  return total.value > page.value * props.perPage
})

const displayedUupgs = computed(() => {
  if (props.morePerPage > 0) {
    return filteredUupgs.value.slice(0, props.perPage + (page.value - 1) * props.morePerPage)
  }
  return filteredUupgs.value.slice(0, page.value * props.perPage)
})

function loadMore() {
  page.value++
}

let debounceTimer: ReturnType<typeof setTimeout> | undefined

function onSearchInput(event: Event) {
  const value = (event.target as HTMLInputElement).value
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    searchTerm.value = value
    search()
  }, 500)
}

function search() {
  loading.value = true
  page.value = 1
  total.value = 0
  filteredUupgs.value = []
  filterUupgs()
}

function filterUupgs() {
  hideListOnLoad.value = false
  const term = searchTerm.value.toLowerCase()
  filteredUupgs.value = allUupgs.value.filter(uupg => {
    if (!term) return true
    return (
      uupg.name.toLowerCase().includes(term) ||
      (uupg.country?.label || '').toLowerCase().includes(term) ||
      (uupg.rop1?.label || '').toLowerCase().includes(term) ||
      (uupg.religion?.label || '').toLowerCase().includes(term) ||
      (uupg.wagf_region?.label || '').toLowerCase().includes(term) ||
      (uupg.wagf_block?.label || '').toLowerCase().includes(term)
    )
  })
  total.value = filteredUupgs.value.length
  loading.value = false
}

async function fetchUupgs() {
  const url = `https://pray.doxa.life/api/people-groups/list?lang=${locale.value}`
  loading.value = true
  try {
    const data = await $fetch<{ posts: Uupg[]; total: number }>(url)
    total.value = data.total
    allUupgs.value = data.posts
    if (props.randomizeList) {
      allUupgs.value = [...allUupgs.value].sort(() => Math.random() - 0.5)
    }
    if (props.useHighlighted) {
      filteredUupgs.value = [
        ...filteredUupgs.value,
        ...data.posts,
      ]
    }
    if (!props.dontShowListOnLoad && !props.useHighlighted) {
      filterUupgs()
    }
  } catch (error) {
    console.error('Error fetching people groups:', error)
  } finally {
    loading.value = false
  }
}

async function fetchHighlighted() {
  const url = `https://pray.doxa.life/api/people-groups/highlighted?lang=${locale.value}`
  try {
    const data = await $fetch<{ posts: Uupg[]; total: number }>(url)
    highlightedUupgs.value = data.posts
    total.value = data.total
    filteredUupgs.value = data.posts
  } catch (error) {
    console.error('Error fetching highlighted people groups:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (props.initialSearchTerm) {
    searchTerm.value = props.initialSearchTerm
  }

  if (props.useHighlighted) {
    await fetchHighlighted()
    await fetchUupgs()
  } else {
    await fetchUupgs()
  }
})
</script>
