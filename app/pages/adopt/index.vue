<template>
  <div class="adopt-page">
    <!-- Section 1: Header + Goal Card -->
    <section>
      <div class="container stack stack--2xl">
        <div class="stack stack-md">
          <h1 class="h2 highlight" data-highlight-index="1">{{ $t('adopt.title') }}</h1>
          <p class="subtext">{{ $t('adopt.subtitle') }}</p>
        </div>
        <div class="three-part-switcher">
          <div class="card-two-tone | text-center grow-1">
            <div class="stack stack--lg">
              <h2 class="h3">{{ $t('adopt.goal') }}</h2>
              <p class="subtext font-size-md">{{ $t('adopt.goal_description') }}</p>
            </div>
            <div>
              <h2 class="h3">{{ $t('adopt.current_status') }}</h2>
              <span class="font-size-4xl font-weight-bold font-button">
                <span>{{ stats.total_adopted }}</span> / 2085
              </span>
              <div class="stack stack--3xs">
                <p class="subtext font-size-md">{{ $t('adopt.groups_adopted') }}</p>
                <ProgressBar :percentage="adoptedPercentage" size="md" />
              </div>
            </div>
          </div>
          <div class="grow-2 bg-image rounded-md" style="background-image: url('/images/adopt-01-africa-4women.jpg');"></div>
        </div>
      </div>
    </section>

    <!-- Section 2: How Adoption Works -->
    <section class="surface-brand-light">
      <div class="container stack stack--3xl">
        <h2>{{ $t('adopt.how_works') }}</h2>
        <div class="switcher | gap-md">
          <StepCard number="1" :title="$t('adopt.choose')" :description="$t('adopt.choose_description')" />
          <StepCard number="2" :title="$t('adopt.mobilize')" :description="$t('adopt.mobilize_description')" />
          <StepCard number="3" :title="$t('adopt.partner')" :description="$t('adopt.partner_description')" />
        </div>
        <a href="#choose-people-group" class="button | compact mx-auto">{{ $t('adopt.get_started') }}</a>
      </div>
    </section>

    <!-- Section 3: Adoption Guide & Resources -->
    <section>
      <div class="container">
        <div class="switcher | align-center" data-width="xl">
          <div class="stack | grow-2 align-center">
            <div class="stack stack--2xl">
              <h2 class="highlight" data-highlight-index="1">{{ $t('adopt.guide_resources') }}</h2>
              <ul class="stack stack--sm" data-list-color="primary">
                <li>{{ $t('adopt.guide_step_by_step') }}</li>
                <li>{{ $t('adopt.guide_tools') }}</li>
                <li>{{ $t('adopt.guide_printable') }}</li>
                <li>{{ $t('adopt.guide_tips') }}</li>
              </ul>
            </div>
          </div>
          <div>
            <img class="center" src="/images/adopt-02-ipad-mockup.png" :alt="$t('adopt.guide_resources')">
          </div>
        </div>
      </div>
    </section>

    <!-- Section 4: Why adoption matters -->
    <section class="surface-white">
      <div class="container">
        <div class="stack stack--lg">
          <h2>{{ $t('adopt.why_matters') }}</h2>
          <div class="switcher | gap-md" data-width="xl">
            <div class="switcher-item center grow-none">
              <img src="/images/Adopt-03-DurbetInMongolia.jpg" :alt="$t('adopt.why_matters')">
            </div>
            <div class="stack stack--lg | text-card | surface-brand-lightest justify-center">
              <h4 class="font-heading font-size-2xl">{{ $t('adopt.no_gospel_access') }}</h4>
              <p>{{ $t('adopt.no_gospel_access_description') }}</p>
            </div>
          </div>
          <div class="switcher | gap-md" data-width="xl">
            <div class="switcher-item center grow-none">
              <img src="/images/Adopt-04-Maha-Brahmin-in-India.jpg" :alt="$t('adopt.why_matters')">
            </div>
            <div class="stack stack--lg | text-card | surface-brand-lightest justify-center">
              <h4 class="font-heading font-size-2xl">{{ $t('adopt.prayer_opens_door') }}</h4>
              <p>{{ $t('adopt.prayer_opens_door_description') }}</p>
            </div>
          </div>
          <div class="switcher | gap-md" data-width="xl">
            <div class="switcher-item center grow-none">
              <img src="/images/Adopt-05-KamaraInGhana.jpg" :alt="$t('adopt.why_matters')">
            </div>
            <div class="stack stack--lg | text-card | surface-brand-lightest justify-center">
              <h4 class="font-heading font-size-2xl">{{ $t('adopt.churches_partners') }}</h4>
              <p>{{ $t('adopt.churches_partners_description') }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 5: Choose a people group -->
    <section class="surface-brand-dark">
      <div class="container stack stack--3xl">
        <div class="stack stack--md">
          <h2 id="choose-people-group">{{ $t('adopt.choose_people_group') }}</h2>
          <p class="subtext">{{ $t('adopt.choose_people_group_description') }}</p>
        </div>
        <UupgsList
          mode="adopt"
          :per-page="6"
          :more-per-page="12"
          dont-show-list-on-load
          use-select-card
          use-highlighted
        />
      </div>
    </section>

    <!-- Section 6: Quote + Bottom Banner -->
    <section>
      <div class="container stack stack--5xl">
        <figure class="text-center font-size-5xl font-heading">
          <blockquote>{{ $t('adopt.stranger_quote') }}</blockquote>
          <figcaption>- {{ $t('adopt.jesus') }}</figcaption>
        </figure>
        <div><img src="/images/adopt-bottom-banner.jpg" :alt="$t('adopt.jesus')"></div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

definePageMeta({ layout: 'default' })
useHead({ title: t('nav.adopt') })

const { stats, fetchStats } = useStatistics()

const adoptedPercentage = computed(() =>
  Math.min((stats.value.total_adopted / 2085) * 100, 100)
)

onMounted(() => {
  fetchStats()
  useHighlightText()
})
</script>
