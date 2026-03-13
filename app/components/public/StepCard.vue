<template>
  <div class="step-card">
    <div class="step-card__number">{{ number }}</div>
    <div class="step-card__content" :data-no-action="!link ? '' : undefined">
      <h2 class="step-card__title">{{ title }}</h2>
      <p>{{ description }}</p>
    </div>
    <NuxtLink v-if="link" :to="link" class="button | compact">{{ linkText }}</NuxtLink>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  number: string | number
  title: string
  description: string
  link?: string
  linkText?: string
}>()
</script>
