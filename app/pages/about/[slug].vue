<template>
  <div class="container page-content">
    <div class="with-sidebar">
      <AboutSidebar :current-slug="slug" />
      <article v-if="data?.page" class="page-body" v-html="data.page.content_html" />
      <article v-else-if="error" class="page-body">
        <h2>Page not found</h2>
        <p>The page you're looking for doesn't exist.</p>
      </article>
      <article v-else class="page-body">
        <p>{{ $t('loading') || 'Loading...' }}</p>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
const { locale } = useI18n()
const route = useRoute()
const slug = route.params.slug as string

definePageMeta({ layout: 'default' })

const { data, error } = await useFetch(`/api/pages/${slug}`, {
  query: { language: locale.value }
})

useHead({ title: data.value?.page?.title || slug })
</script>

<style scoped>
:deep(.document-item) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  padding: var(--spacing-sm) 0;
  border-bottom: 1px solid var(--color-brand-secondary-light);
}

:deep(.document-item a:first-child) {
  flex: 1;
}

:deep(.scripture-block) {
  padding: var(--spacing-lg) var(--spacing-xl);
  border-radius: var(--border-radius-md);
}

:deep([data-type="verse"]) {
  background-color: var(--color-surface-brand);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-lg) var(--spacing-xl);
  margin: var(--spacing-md) 0;
}

:deep([data-type="verse"] p) {
  text-align: center;
  color: var(--color-text-on-brand);
  font-size: var(--font-size-lg);
  line-height: var(--line-height-snug);
  margin: var(--spacing-2xs) 0;
}

:deep([data-type="verse"]::after) {
  content: attr(data-reference);
  display: block;
  text-align: right;
  color: var(--color-text-on-brand);
  opacity: 0.85;
  font-size: var(--font-size-sm);
  font-style: italic;
  margin-top: var(--spacing-sm);
}

:deep(.text-right) {
  text-align: right;
}

:deep(.text-center) {
  text-align: center;
}
</style>
