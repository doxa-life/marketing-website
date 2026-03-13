<template>
  <div class="pray-page">
    <!-- Section 1: Header + Goal Card -->
    <section>
      <div class="container stack stack--2xl">
        <div class="stack stack-md">
          <h1 class="h2 highlight" data-highlight-index="1">{{ $t('pray.title') }}</h1>
          <p class="subtext">{{ $t('pray.subtitle') }}</p>
        </div>
        <div class="three-part-switcher">
          <div class="card-two-tone | text-center grow-1">
            <div class="stack stack--lg">
              <h2 class="h3">{{ $t('pray.goal') }}</h2>
              <p class="subtext font-size-md">{{ $t('pray.24hr_coverage') }}</p>
              <p class="subtext font-size-md">{{ $t('pray.mobilize_goal') }}</p>
            </div>
            <div>
              <h2 class="h3">{{ $t('pray.current_status') }}</h2>
              <span class="font-size-4xl font-weight-bold font-button">
                <span>{{ stats.total_with_full_prayer }}</span> / 2085
              </span>
              <div class="stack stack--3xs">
                <p class="subtext font-size-md">{{ $t('pray.coverage_status') }}</p>
                <ProgressBar :percentage="prayerPercentage" size="md" />
              </div>
            </div>
          </div>
          <div class="grow-2 bg-image rounded-md" style="background-image: url('/images/pray-01-hero.jpg');"></div>
        </div>
      </div>
    </section>

    <!-- Section 2: Where do I start? -->
    <section class="surface-brand-light">
      <div class="container stack stack--3xl">
        <h2>{{ $t('pray.where_start') }}</h2>
        <div class="switcher | gap-md">
          <StepCard number="1" :title="$t('pray.choose')" :description="$t('pray.choose_description')" />
          <StepCard number="2" :title="$t('pray.sign_up')" :description="$t('pray.sign_up_description')" />
          <StepCard number="3" :title="$t('nav.pray')" :description="$t('pray.pray_description')" />
        </div>
        <a href="#choose-people-group" class="button | compact mx-auto">{{ $t('pray.get_started') }}</a>
      </div>
    </section>

    <!-- Section 3: Your daily prayer guide -->
    <section>
      <div class="container">
        <div class="switcher | align-center" data-width="xl">
          <div class="stack | grow-2 align-center">
            <div class="stack stack--2xl">
              <h2 class="highlight" data-highlight-index="2">{{ $t('pray.daily_guide') }}</h2>
              <ul class="stack stack--sm" data-list-color="primary">
                <li>{{ $t('pray.scripture_centered') }}</li>
                <li>{{ $t('pray.spirit_led') }}</li>
                <li>{{ $t('pray.real_needs') }}</li>
                <li>{{ $t('pray.photos_stories') }}</li>
                <li>{{ $t('pray.key_insights') }}</li>
              </ul>
            </div>
          </div>
          <div>
            <img class="center" src="/images/pray-02-PrayerFUEL-Phone-graphic-2.png" :alt="$t('pray.daily_guide')">
          </div>
        </div>
      </div>
    </section>

    <!-- Section 4: Why prayer matters -->
    <section class="surface-white">
      <div class="container">
        <div class="stack stack--lg">
          <h2>{{ $t('pray.why_matters') }}</h2>
          <div class="switcher | gap-md" data-width="xl">
            <div class="switcher-item center grow-none">
              <img src="/images/Pray-04-Doxa.jpg" :alt="$t('pray.why_matters')">
            </div>
            <div class="stack stack--lg | text-card | surface-brand-lightest justify-center">
              <h4 class="font-heading font-size-2xl">{{ $t('pray.no_one_praying') }}</h4>
              <p>{{ $t('pray.no_one_praying_description') }}</p>
            </div>
          </div>
          <div class="switcher | gap-md" data-width="xl">
            <div class="switcher-item center grow-none">
              <img src="/images/Pray-05-Doxa.jpg" :alt="$t('pray.why_matters')">
            </div>
            <div class="stack stack--lg | text-card | surface-brand-lightest justify-center">
              <h4 class="font-heading font-size-2xl">{{ $t('pray.prepares_way') }}</h4>
              <p>{{ $t('pray.prepares_way_description') }}</p>
            </div>
          </div>
          <div class="switcher | gap-md" data-width="xl">
            <div class="switcher-item center grow-none">
              <img src="/images/Pray-06-Doxa.jpg" :alt="$t('pray.why_matters')">
            </div>
            <div class="stack stack--lg | text-card | surface-brand-lightest justify-center">
              <h4 class="font-heading font-size-2xl">{{ $t('pray.unites_church') }}</h4>
              <p>{{ $t('pray.unites_church_description') }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 5: Choose a people group -->
    <section class="surface-brand-dark">
      <div class="container stack stack--3xl">
        <div class="stack stack--md">
          <h2 id="choose-people-group">{{ $t('pray.choose_people_group') }}</h2>
          <p class="subtext">{{ $t('pray.choose_people_group_description') }}</p>
        </div>
        <UupgsList
          mode="pray"
          :per-page="6"
          :more-per-page="12"
          dont-show-list-on-load
          use-select-card
          use-highlighted
        />
      </div>
    </section>

    <!-- Section 6: Prayer Progress (Map) -->
    <section>
      <div class="container stack stack--lg">
        <h2>{{ $t('pray.prayer_progress') }}</h2>
        <PrayerMap />
      </div>
    </section>

    <!-- Section 7: Quote + Bottom Banner -->
    <section>
      <div class="container stack stack--5xl">
        <figure class="text-center font-size-5xl font-heading">
          <blockquote>{{ $t('pray.harvest_quote') }}</blockquote>
          <figcaption>- {{ $t('pray.jesus') }}</figcaption>
        </figure>
        <div><img src="/images/pray-03-bottom-unsplash.jpg" :alt="$t('pray.jesus')"></div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

definePageMeta({ layout: 'default' })
useHead({ title: t('nav.pray') })

const { stats, fetchStats } = useStatistics()

const prayerPercentage = computed(() =>
  Math.min((stats.value.total_with_full_prayer / 2085) * 100, 100)
)

onMounted(() => {
  fetchStats()
  useHighlightText()
})
</script>
