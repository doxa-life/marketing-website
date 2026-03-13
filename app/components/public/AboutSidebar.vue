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
        <li>
          <NuxtLink
            :to="localePath('/about/vision')"
            :class="{ 'current-link': currentSlug === 'vision' }"
          >
            Vision
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            :to="localePath('/about/documents')"
            :class="{ 'current-link': currentSlug === 'documents' }"
          >
            Documents
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            :to="localePath('/about/definitions')"
            :class="{ 'current-link': currentSlug === 'definitions' }"
          >
            Definitions
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            :to="localePath('/about/statement-of-faith')"
            :class="{ 'current-link': currentSlug === 'statement-of-faith' }"
          >
            Statement of Faith
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup lang="ts">
const localePath = useLocalePath()

defineProps<{
  currentSlug: string
}>()
</script>
