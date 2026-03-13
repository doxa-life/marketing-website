<template>
  <div class="container page-content">
    <div class="stack stack--lg">
      <h1 class="page-title">{{ $t('error.not_found') }}</h1>
      <p>{{ $t('error.not_found_description') }}</p>
      <div class="error-404-content">
        <div class="stack stack--md">
          <h3>{{ $t('error.popular_pages') }}</h3>
          <ul>
            <li><NuxtLink :to="localePath('/')">{{ $t('nav.home') }}</NuxtLink></li>
            <li><NuxtLink :to="localePath('/pray')">{{ $t('nav.pray') }}</NuxtLink></li>
            <li><NuxtLink :to="localePath('/adopt')">{{ $t('nav.adopt') }}</NuxtLink></li>
            <li><NuxtLink :to="localePath('/research')">{{ $t('nav.research') }}</NuxtLink></li>
            <li><NuxtLink :to="localePath('/about')">{{ $t('nav.about') }}</NuxtLink></li>
            <li><NuxtLink :to="localePath('/contact-us')">{{ $t('nav.contact') }}</NuxtLink></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

definePageMeta({
  layout: 'default'
})

useHead({
  title: t('error.not_found')
})
</script>
