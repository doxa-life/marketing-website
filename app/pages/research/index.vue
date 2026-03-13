<template>
  <div class="container page-content uupgs-page stack stack--3xl">
    <h1 class="text-center highlight" data-highlight-last>{{ $t('research.find_uupg') }}</h1>
    <UupgsList />
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

definePageMeta({ layout: 'default' })
useHead({ title: t('research.find_uupg') })

onMounted(() => {
  useHighlightText()
})
</script>
