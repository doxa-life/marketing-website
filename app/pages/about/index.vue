<template>
  <div class="container page-content">
    <div class="with-sidebar">
      <AboutSidebar current-slug="about" />
      <article v-if="data?.page" class="page-body" v-html="data.page.content_html" />
      <article v-else class="page-body">
        <p>{{ $t('loading') || 'Loading...' }}</p>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
const { locale } = useI18n()
const { t } = useI18n()

definePageMeta({ layout: 'default' })
useHead({ title: t('nav.about') })

const { data } = await useFetch(`/api/pages/about`, {
  query: { language: locale.value }
})
</script>
