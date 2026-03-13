<template>
  <div class="front-page">
    <!-- Hero Section -->
    <section class="stack stack--md container">
      <div>
        <h2 class="color-brand">{{ $t('home.gift_to_jesus') }}:</h2>
        <h1 class="color-brand-light highlight" data-highlight-index="1" data-highlight-last data-highlight-color="primary">
          {{ $t('home.engage_every_people') }}
        </h1>
      </div>
      <div class="video-modal-button" @click="openVideoModal">
        <svg class="icon">
          <use href="/icons/play-button.svg#play-button"></use>
        </svg>
        <img class="rounded-xlg" src="/images/home-01-hero.jpg" :alt="$t('home.engage_every_people')">
      </div>
      <p class="text-center color-primary uppercase font-button font-weight-medium">
        {{ $t('home.video_cta') }}
      </p>
    </section>

    <!-- Unengaged People Groups Section -->
    <section class="stack stack--md | surface-brand-light">
      <div class="container stack stack--4xl">
        <div class="stack stack--2xl">
          <h2 class="highlight" data-highlight-index="1">
            {{ $t('home.unengaged_count', { count: '2,085' }) }}
          </h2>
          <p class="subtext">{{ $t('home.unengaged_description') }}</p>
        </div>
        <PeopleGroupReel />
        <div class="stack stack--2xl">
          <h2 class="highlight" data-highlight-last>{{ $t('home.simple_path') }}</h2>
          <div class="switcher | gap-md">
            <StepCard number="1" :title="$t('nav.pray')" :description="$t('home.pray_description')" :link="localePath('/pray')" :link-text="$t('home.join')" />
            <StepCard number="2" :title="$t('nav.adopt')" :description="$t('home.adopt_description')" :link="localePath('/adopt')" :link-text="$t('home.commit')" />
            <StepCard number="3" :title="$t('home.engage')" :description="$t('home.engage_description')" />
          </div>
        </div>
      </div>
    </section>

    <!-- Background Image Banner -->
    <section class="bg-image" :style="{ backgroundImage: `url('/images/home-02-WhoAreTheUnreached-new.jpg')` }">
      <h2 class="text-center banner-title invisible-placeholder">{{ $t('home.who_unengaged') }}</h2>
    </section>

    <!-- Concentric Circles / Progress Section -->
    <section class="overflow-hidden progress-section">
      <div class="container stack stack--xl">
        <h2 class="color-white text-center progress-section__title">{{ $t('home.who_unengaged') }}</h2>
        <div class="switcher | concentric-circles | gap-md" data-width="lg">
          <div class="switcher-item">
            <div class="info-card color-brand-dark justify-center">
              <div class="stack stack--lg | info-card__content">
                <h3 class="color-brand-lighter">{{ $t('home.unreached') }}</h3>
                <span>{{ $t('home.billion', { count: '3.9' }) }}</span>
                <span class="color-brand-lighter">{{ $t('home.people_groups', { count: '6,602' }) }}</span>
              </div>
            </div>
          </div>
          <div class="switcher-item">
            <div class="info-card color-secondary-very-light justify-center">
              <div class="stack stack--lg | info-card__content">
                <h3>{{ $t('home.under_engaged') }}</h3>
                <span class="color-secondary-light">{{ $t('home.billion', { count: '3.3' }) }}</span>
                <span>{{ $t('home.people_groups', { count: '5,119' }) }}</span>
              </div>
            </div>
          </div>
          <div class="switcher-item">
            <div class="info-card color-secondary-very-light justify-center">
              <div class="stack stack--lg | info-card__content">
                <h3>{{ $t('home.frontier') }}</h3>
                <span class="color-secondary-light">{{ $t('home.billion', { count: '2' }) }}</span>
                <span>{{ $t('home.people_groups', { count: '4,788' }) }}</span>
              </div>
            </div>
          </div>
          <div class="switcher-item">
            <div class="info-card surface-brand-dark justify-center">
              <div class="stack stack--lg | info-card__content">
                <h3>{{ $t('home.unengaged') }}</h3>
                <span>{{ $t('home.million', { count: '202' }) }}</span>
                <span>{{ $t('home.people_groups', { count: '2,085' }) }}</span>
              </div>
            </div>
          </div>
        </div>
        <NuxtLink :to="localePath('/about/definitions')" class="with-icon | light-link mx-auto">
          {{ $t('home.learn_more') }}
          <svg class="icon | rotate-90">
            <use href="/icons/arrow-chevron.svg#chevron-up"></use>
          </svg>
        </NuxtLink>
      </div>
    </section>

    <!-- Vision 2033 Section -->
    <section class="surface-white">
      <div class="container stack stack--xl">
        <h2>{{ $t('home.vision_2033') }}</h2>
        <div class="switcher" data-width="xl">
          <div class="switcher-item center grow-none">
            <img class="center" src="/images/home-03-Vision-2033.jpg" :alt="$t('home.vision_2033')" style="width: clamp(150px, 25vw, 350px);">
          </div>
          <div class="switcher-item align-center justify-center">
            <div class="stack stack--xl">
              <h3 class="subtext">{{ $t('home.vision_intro') }}</h3>
              <ul class="stack stack--md" data-list-color="primary">
                <li>{{ $t('home.vision_1') }}</li>
                <li>{{ $t('home.vision_2') }}</li>
                <li>{{ $t('home.vision_3') }}</li>
                <li>{{ $t('home.vision_4') }}</li>
                <li>{{ $t('home.vision_5') }}</li>
              </ul>
              <NuxtLink :to="localePath('/about/vision')" class="with-icon | color-primary-darker ms-auto">
                {{ $t('home.more') }}
                <svg class="icon | rotate-90">
                  <use href="/icons/arrow-chevron.svg#chevron-up"></use>
                </svg>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Engagement Starts with Prayer Section -->
    <section class="surface-brand-light">
      <div class="container stack stack--3xl">
        <h2 class="highlight" data-highlight-last>{{ $t('home.engagement_prayer') }}</h2>
        <div class="switcher | align-center">
          <div class="switcher-item center grow-none">
            <img src="/images/home-04-EngagementStartsWithPrayer.jpg" :alt="$t('home.engagement_prayer')">
          </div>
          <div>
            <div class="stack stack--3xl | align-center">
              <p class="text-center max-width-md font-size-lg">{{ $t('home.engagement_prayer_description') }}</p>
              <NuxtLink :to="localePath('/pray')" class="button | compact">{{ $t('nav.pray') }}</NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- What does DOXA mean? Section -->
    <section>
      <div class="switcher container | gap-md" data-width="xl">
        <div class="switcher-item card | padding-clamp-2xl bg-image align-center" :style="{ backgroundImage: `url('/images/home-doxa-background.jpg')` }">
          <div class="stack stack--md | text-center text-secondary">
            <h2>{{ $t('home.doxa_meaning') }}</h2>
            <p class="subtext">{{ $t('home.doxa_glory') }}</p>
            <p>{{ $t('home.doxa_description') }}</p>
          </div>
        </div>
        <div class="switcher-item center grow-none">
          <img class="rounded-xlg" src="/images/home-05-WhatDoesDoxaMean.jpg" :alt="$t('home.engagement_prayer')">
        </div>
      </div>
    </section>

    <!-- Video Modal -->
    <VideoModal ref="videoModal" video-id="1143355099" video-hash="39f8c1f131" />
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

const videoModal = useTemplateRef<{ open: () => void; close: () => void }>('videoModal')

function openVideoModal() {
  videoModal.value?.open()
}

useHead({
  title: t('home.engage_every_people')
})

onMounted(() => {
  useHighlightText()
})
</script>
