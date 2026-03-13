<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Pages</h1>
      <UButton to="/admin/pages/new" icon="i-lucide-plus" color="primary">
        New Page
      </UButton>
    </div>

    <UCard>
      <UTable :data="pages || []" :columns="columns" :loading="status === 'pending'">
        <template #slug-cell="{ row }">
          <code class="text-sm">{{ row.original.slug }}</code>
        </template>
        <template #updated_at-cell="{ row }">
          {{ formatDate(row.original.updated_at) }}
        </template>
        <template #actions-cell="{ row }">
          <div class="flex gap-2">
            <UButton
              :to="`/admin/pages/${row.original.id}`"
              icon="i-lucide-pencil"
              variant="ghost"
              size="sm"
            />
            <UButton
              icon="i-lucide-trash-2"
              variant="ghost"
              color="error"
              size="sm"
              @click="confirmDelete(row.original)"
            />
          </div>
        </template>
      </UTable>
    </UCard>

    <UModal v-model:open="deleteModalOpen">
      <template #content>
        <div class="p-6">
          <h3 class="text-lg font-semibold mb-2">Delete Page</h3>
          <p class="text-(--ui-text-muted) mb-4">
            Are you sure you want to delete "{{ pageToDelete?.title }}"? This action cannot be undone.
          </p>
          <div class="flex justify-end gap-3">
            <UButton variant="outline" @click="deleteModalOpen = false">Cancel</UButton>
            <UButton color="error" :loading="deleting" @click="handleDelete">Delete</UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

const toast = useToast()

const { data: pages, status, refresh } = useLazyFetch('/api/admin/pages')

const columns = [
  { accessorKey: 'title', header: 'Title' },
  { accessorKey: 'slug', header: 'Slug' },
  { accessorKey: 'language', header: 'Language' },
  { accessorKey: 'updated_at', header: 'Updated' },
  { accessorKey: 'actions', header: '' },
]

function formatDate(date: string) {
  if (!date) return ''
  return new Date(date).toLocaleDateString()
}

const deleteModalOpen = ref(false)
const pageToDelete = ref<any>(null)
const deleting = ref(false)

function confirmDelete(page: any) {
  pageToDelete.value = page
  deleteModalOpen.value = true
}

async function handleDelete() {
  if (!pageToDelete.value) return
  deleting.value = true

  try {
    await $fetch(`/api/admin/pages/${pageToDelete.value.id}`, { method: 'DELETE' })
    toast.add({ title: 'Page deleted', color: 'success' })
    deleteModalOpen.value = false
    pageToDelete.value = null
    await refresh()
  } catch (error: any) {
    toast.add({ title: 'Failed to delete page', color: 'error' })
  } finally {
    deleting.value = false
  }
}
</script>
