<template>
  <div>
    <div class="flex items-center gap-3 mb-6">
      <UButton to="/admin/pages" icon="i-lucide-arrow-left" variant="ghost" />
      <h1 class="text-2xl font-bold">Edit Page</h1>
    </div>

    <UCard v-if="page">
      <form @submit.prevent="handleSave" class="space-y-6">
        <UFormField label="Title" name="title" required>
          <UInput v-model="form.title" placeholder="Page title" class="w-full" />
        </UFormField>

        <UFormField label="Slug" name="slug" required>
          <UInput v-model="form.slug" placeholder="page-slug" class="w-full" />
        </UFormField>

        <UFormField label="Parent Slug" name="parent_slug">
          <UInput v-model="form.parent_slug" placeholder="about (optional)" class="w-full" />
        </UFormField>

        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Language" name="language">
            <UInput v-model="form.language" placeholder="en" class="w-full" />
          </UFormField>

          <UFormField label="Menu Order" name="menu_order">
            <UInput v-model.number="form.menu_order" type="number" class="w-full" />
          </UFormField>
        </div>

        <UFormField label="Featured Image URL" name="featured_image">
          <UInput v-model="form.featured_image" placeholder="https://..." class="w-full" />
        </UFormField>

        <UFormField label="Content" name="content">
          <RichTextEditor
            v-model="form.content_json"
            @update:html="form.content_html = $event"
          />
        </UFormField>

        <div class="flex justify-end gap-3">
          <UButton to="/admin/pages" variant="outline">Cancel</UButton>
          <UButton type="submit" color="primary" :loading="saving">Save Changes</UButton>
        </div>
      </form>
    </UCard>

    <UCard v-else-if="status === 'error'">
      <div class="text-center py-8">
        <p class="text-(--ui-text-muted)">Page not found.</p>
        <UButton to="/admin/pages" class="mt-4" variant="outline">Back to Pages</UButton>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

const route = useRoute()
const toast = useToast()
const saving = ref(false)

const { data: page, status } = await useFetch<any>(`/api/admin/pages/${route.params.id}`)

const form = reactive({
  title: '',
  slug: '',
  parent_slug: '',
  language: 'en',
  menu_order: 0,
  featured_image: '',
  content_json: null as any,
  content_html: '',
})

watch(page, (p) => {
  if (p) {
    form.title = p.title || ''
    form.slug = p.slug || ''
    form.parent_slug = p.parent_slug || ''
    form.language = p.language || 'en'
    form.menu_order = p.menu_order || 0
    form.featured_image = p.featured_image || ''
    form.content_json = p.content_json || null
    form.content_html = p.content_html || ''
  }
}, { immediate: true })

async function handleSave() {
  if (!form.title || !form.slug) {
    toast.add({ title: 'Title and slug are required', color: 'error' })
    return
  }

  saving.value = true
  try {
    await $fetch(`/api/admin/pages/${route.params.id}`, {
      method: 'PATCH',
      body: {
        title: form.title,
        slug: form.slug,
        parent_slug: form.parent_slug || null,
        language: form.language,
        menu_order: form.menu_order,
        featured_image: form.featured_image || null,
        content_json: form.content_json,
        content_html: form.content_html,
      },
    })
    toast.add({ title: 'Page saved', color: 'success' })
  } catch (error: any) {
    toast.add({
      title: error.data?.statusMessage || 'Failed to save page',
      color: 'error',
    })
  } finally {
    saving.value = false
  }
}
</script>
