<template>
  <aside class="sidebar">
    <nav class="stack" aria-label="About pages navigation">
      <ul class="stack" role="list">
        <li>
          <NuxtLink
            :to="localePath('/about')"
            class="font-size-lg"
            :class="{ 'current-link': currentSlug === 'about' }"
          >
            {{ $t('nav.about') }}
          </NuxtLink>
        </li>
        <li v-for="child in children" :key="child.slug">
          <NuxtLink
            :to="localePath(`/about/${child.slug}`)"
            :class="{ 'current-link': currentSlug === child.slug }"
          >
            {{ child.title }}
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup lang="ts">
const localePath = useLocalePath()
const { locale } = useI18n()

defineProps<{
  currentSlug: string
}>()

const { data } = await useFetch('/api/pages/about', {
  query: { language: locale.value }
})

const children = computed(() => data.value?.siblings || [])
</script>
