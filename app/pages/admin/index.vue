<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Dashboard</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <UCard>
        <div class="flex items-center gap-3">
          <UIcon name="i-lucide-file-text" class="text-2xl text-(--ui-text-muted)" />
          <div>
            <p class="text-sm text-(--ui-text-muted)">Pages</p>
            <p class="text-2xl font-bold">{{ pageCount }}</p>
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center gap-3">
          <UIcon name="i-lucide-globe" class="text-2xl text-(--ui-text-muted)" />
          <div>
            <p class="text-sm text-(--ui-text-muted)">Languages</p>
            <p class="text-2xl font-bold">{{ languageCount }}</p>
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center gap-3">
          <UIcon name="i-lucide-clock" class="text-2xl text-(--ui-text-muted)" />
          <div>
            <p class="text-sm text-(--ui-text-muted)">Last Updated</p>
            <p class="text-sm font-medium">{{ lastUpdated }}</p>
          </div>
        </div>
      </UCard>
    </div>

    <div class="mt-8">
      <h2 class="text-lg font-semibold mb-4">Quick Actions</h2>
      <div class="flex gap-3">
        <UButton to="/admin/pages" icon="i-lucide-file-text" variant="outline">
          Manage Pages
        </UButton>
        <UButton to="/admin/pages/new" icon="i-lucide-plus" color="primary">
          New Page
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

const { data: pages } = await useFetch('/api/admin/pages')

const pageCount = computed(() => pages.value?.length || 0)

const languageCount = computed(() => {
  if (!pages.value) return 0
  const langs = new Set((pages.value as any[]).map(p => p.language))
  return langs.size
})

const lastUpdated = computed(() => {
  if (!pages.value || !(pages.value as any[]).length) return 'Never'
  const sorted = [...(pages.value as any[])].sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  )
  return new Date(sorted[0].updated_at).toLocaleDateString()
})
</script>
