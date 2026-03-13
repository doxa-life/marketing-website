<template>
  <div class="container page-content">
    <div v-if="error" class="stack stack--lg">
      <h1>{{ $t('uupg.people_group_not_found') }}</h1>
      <p>{{ $t('uupg.people_group_not_found_description') }}</p>
      <NuxtLink :to="localePath('/research')" class="button compact">
        {{ $t('uupg.back') }}
      </NuxtLink>
    </div>

    <div v-else-if="uupg" class="stack stack--2xl">
      <!-- Header: Image + Name -->
      <div class="switcher | align-center gap-md" data-width="xl">
        <div class="uupg-detail__image-wrapper">
          <img :src="uupg.picture_url" :alt="uupg.display_name" class="uupg-detail__image">
          <div
            class="uupg-detail__stamp"
            :class="uupg.is_engaged ? 'uupg-detail__stamp--engaged' : 'uupg-detail__stamp--not-engaged'"
          >
            {{ uupg.is_engaged ? $t('uupg.engaged') : $t('uupg.not_engaged') }}
          </div>
        </div>
        <div class="stack stack--md">
          <h1>{{ uupg.display_name }}</h1>
          <p class="font-size-lg">{{ uupg.country?.label }}</p>
          <p v-if="uupg.location_description">{{ uupg.location_description }}</p>
        </div>
      </div>

      <!-- Engagement Status Checklist -->
      <div class="card">
        <div class="stack stack--md">
          <h2 class="h3">{{ $t('uupg.engagement_status') }}</h2>
          <ul class="stack stack--sm uupg-detail__checklist">
            <li>
              <img
                :src="uupg.prayer_status ? '/icons/Check-GreenCircle.png' : '/icons/RedX-Circle.png'"
                :alt="uupg.prayer_status ? $t('uupg.done') : $t('uupg.not_done')"
              >
              <span>{{ $t('uupg.prayer_status') }}</span>
            </li>
            <li>
              <img
                :src="uupg.adopted_by_churches > 0 ? '/icons/Check-GreenCircle.png' : '/icons/RedX-Circle.png'"
                :alt="uupg.adopted_by_churches > 0 ? $t('uupg.done') : $t('uupg.not_done')"
              >
              <span>{{ $t('uupg.adoption_status') }}</span>
            </li>
            <li>
              <img
                :src="uupg.cross_cultural_workers ? '/icons/Check-GreenCircle.png' : '/icons/RedX-Circle.png'"
                :alt="uupg.cross_cultural_workers ? $t('uupg.done') : $t('uupg.not_done')"
              >
              <span>{{ $t('uupg.cross_cultural_workers') }}</span>
            </li>
            <li>
              <img
                :src="uupg.local_language_work ? '/icons/Check-GreenCircle.png' : '/icons/RedX-Circle.png'"
                :alt="uupg.local_language_work ? $t('uupg.done') : $t('uupg.not_done')"
              >
              <span>{{ $t('uupg.local_language_culture') }}</span>
            </li>
            <li>
              <img
                :src="uupg.disciple_multiplication ? '/icons/Check-GreenCircle.png' : '/icons/RedX-Circle.png'"
                :alt="uupg.disciple_multiplication ? $t('uupg.done') : $t('uupg.not_done')"
              >
              <span>{{ $t('uupg.disciple_church_multiplication') }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Prayer Status + Adoption Status Cards -->
      <div class="switcher | gap-md" data-width="xl">
        <div class="card">
          <div class="stack stack--md">
            <h2 class="h3">{{ $t('uupg.prayer_status') }}</h2>
            <p class="font-size-xl font-button">
              {{ uupg.people_committed ?? 0 }} / 144
            </p>
            <p class="font-size-sm">{{ $t('uupg.people_committed_praying') }}</p>
            <ProgressBar :percentage="prayerPercentage" size="md" />
            <a
              :href="prayUrl"
              class="button compact"
            >
              {{ $t('uupg.sign_up_to_pray') }}
            </a>
          </div>
        </div>
        <div class="card">
          <div class="stack stack--md">
            <h2 class="h3">{{ $t('uupg.adoption_status') }}</h2>
            <p class="font-size-xl font-button">
              {{ uupg.adopted_by_churches ?? 0 }}
            </p>
            <p class="font-size-sm">{{ $t('uupg.churches_adopted') }}</p>
            <a
              :href="adoptUrl"
              class="button compact"
            >
              {{ $t('uupg.adopt_people_group') }}
            </a>
          </div>
        </div>
      </div>

      <!-- Map -->
      <div v-if="uupg.latitude && uupg.longitude" class="uupg-detail__map">
        <iframe
          :src="`https://www.openstreetmap.org/export/embed.html?bbox=${uupg.longitude - 2},${uupg.latitude - 2},${uupg.longitude + 2},${uupg.latitude + 2}&layer=mapnik&marker=${uupg.latitude},${uupg.longitude}`"
          width="100%"
          height="400"
          frameborder="0"
          style="border: 0; border-radius: var(--radius-md);"
          allowfullscreen
          loading="lazy"
        ></iframe>
      </div>

      <!-- Overview Card -->
      <div class="card">
        <div class="stack stack--md">
          <h2 class="h3">{{ $t('uupg.overview') }}</h2>
          <dl class="uupg-detail__dl">
            <div>
              <dt>{{ $t('uupg.country') }}</dt>
              <dd>{{ uupg.country?.label }}</dd>
            </div>
            <div v-if="uupg.alternate_names">
              <dt>{{ $t('uupg.alternate_names') }}</dt>
              <dd>{{ uupg.alternate_names }}</dd>
            </div>
            <div>
              <dt>{{ $t('uupg.population') }}</dt>
              <dd>{{ formatNumber(uupg.population) }}</dd>
            </div>
            <div>
              <dt>{{ $t('uupg.primary_language') }}</dt>
              <dd>{{ uupg.primary_language }}</dd>
            </div>
            <div>
              <dt>{{ $t('uupg.primary_religion') }}</dt>
              <dd>{{ uupg.religion?.label }}</dd>
            </div>
          </dl>
        </div>
      </div>

      <!-- Progress Card -->
      <div class="card">
        <div class="stack stack--md">
          <h2 class="h3">{{ $t('uupg.progress') }}</h2>
          <ul class="stack stack--sm uupg-detail__checklist">
            <li>
              <img
                :src="uupg.bible_translation ? '/icons/Check-GreenCircle.png' : '/icons/RedX-Circle.png'"
                :alt="uupg.bible_translation ? $t('uupg.done') : $t('uupg.not_done')"
              >
              <span>{{ $t('uupg.bible_translation') }}</span>
            </li>
            <li>
              <img
                :src="uupg.bible_stories ? '/icons/Check-GreenCircle.png' : '/icons/RedX-Circle.png'"
                :alt="uupg.bible_stories ? $t('uupg.done') : $t('uupg.not_done')"
              >
              <span>{{ $t('uupg.bible_stories') }}</span>
            </li>
            <li>
              <img
                :src="uupg.jesus_film ? '/icons/Check-GreenCircle.png' : '/icons/RedX-Circle.png'"
                :alt="uupg.jesus_film ? $t('uupg.done') : $t('uupg.not_done')"
              >
              <span>{{ $t('uupg.jesus_film') }}</span>
            </li>
            <li>
              <img
                :src="uupg.radio_broadcasts ? '/icons/Check-GreenCircle.png' : '/icons/RedX-Circle.png'"
                :alt="uupg.radio_broadcasts ? $t('uupg.done') : $t('uupg.not_done')"
              >
              <span>{{ $t('uupg.radio_broadcasts') }}</span>
            </li>
            <li>
              <img
                :src="uupg.gospel_recordings ? '/icons/Check-GreenCircle.png' : '/icons/RedX-Circle.png'"
                :alt="uupg.gospel_recordings ? $t('uupg.done') : $t('uupg.not_done')"
              >
              <span>{{ $t('uupg.gospel_recordings') }}</span>
            </li>
            <li>
              <img
                :src="uupg.audio_scripture ? '/icons/Check-GreenCircle.png' : '/icons/RedX-Circle.png'"
                :alt="uupg.audio_scripture ? $t('uupg.done') : $t('uupg.not_done')"
              >
              <span>{{ $t('uupg.audio_scripture') }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const slug = route.params.slug as string

definePageMeta({ layout: 'default' })

const { data: uupg, error } = await useFetch<any>(`/api/people-groups/${slug}`)

useHead({
  title: uupg.value?.display_name || t('uupg.people_group_not_found'),
})

const prayerPercentage = computed(() =>
  Math.min(((uupg.value?.people_committed ?? 0) / 144) * 100, 100)
)

const prayUrl = computed(() => {
  const base = 'https://pray.doxa.life'
  return locale.value !== 'en'
    ? `${base}/${locale.value}/${slug}?source=doxalife`
    : `${base}/${slug}?source=doxalife`
})

const adoptUrl = computed(() => {
  const base = 'https://pray.doxa.life'
  return locale.value !== 'en'
    ? `${base}/${locale.value}/adopt/${slug}?source=doxalife`
    : `${base}/adopt/${slug}?source=doxalife`
})

function formatNumber(num: number | undefined): string {
  if (!num) return '—'
  return num.toLocaleString()
}
</script>
