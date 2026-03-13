<template>
  <div class="rich-text-editor">
    <div v-if="editor" class="toolbar">
      <UButton
        color="neutral"
        variant="ghost"
        size="xs"
        icon="i-lucide-heading-2"
        :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
      />
      <UButton
        color="neutral"
        variant="ghost"
        size="xs"
        icon="i-lucide-heading-3"
        :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
      />

      <div class="toolbar-divider" />

      <UButton
        color="neutral"
        variant="ghost"
        size="xs"
        icon="i-lucide-bold"
        :class="{ 'is-active': editor.isActive('bold') }"
        @click="editor.chain().focus().toggleBold().run()"
      />
      <UButton
        color="neutral"
        variant="ghost"
        size="xs"
        icon="i-lucide-italic"
        :class="{ 'is-active': editor.isActive('italic') }"
        @click="editor.chain().focus().toggleItalic().run()"
      />

      <div class="toolbar-divider" />

      <UButton
        color="neutral"
        variant="ghost"
        size="xs"
        icon="i-lucide-list"
        :class="{ 'is-active': editor.isActive('bulletList') }"
        @click="editor.chain().focus().toggleBulletList().run()"
      />
      <UButton
        color="neutral"
        variant="ghost"
        size="xs"
        icon="i-lucide-list-ordered"
        :class="{ 'is-active': editor.isActive('orderedList') }"
        @click="editor.chain().focus().toggleOrderedList().run()"
      />

      <div class="toolbar-divider" />

      <UButton
        color="neutral"
        variant="ghost"
        size="xs"
        icon="i-lucide-link"
        :class="{ 'is-active': editor.isActive('link') }"
        @click="setLink"
      />
      <UButton
        color="neutral"
        variant="ghost"
        size="xs"
        icon="i-lucide-image"
        @click="addImage"
      />

      <div class="toolbar-divider" />

      <UButton
        color="neutral"
        variant="ghost"
        size="xs"
        icon="i-lucide-book-open"
        :class="{ 'is-active': editor.isActive('verse') }"
        @click="editor.chain().focus().toggleVerse().run()"
      />
    </div>

    <EditorContent :editor="editor" class="editor-content" />
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { Verse } from '~/extensions/verse'

const props = defineProps<{
  modelValue?: any
}>()

const emit = defineEmits<{
  'update:modelValue': [value: any]
  'update:html': [value: string]
}>()

const editor = useEditor({
  content: props.modelValue || '',
  extensions: [
    StarterKit.configure({
      heading: {
        levels: [2, 3],
      },
    }),
    Link.configure({
      openOnClick: false,
    }),
    Image,
    Verse,
  ],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getJSON())
    emit('update:html', editor.getHTML())
  },
})

watch(() => props.modelValue, (value) => {
  if (!editor.value) return
  const currentJson = JSON.stringify(editor.value.getJSON())
  const newJson = JSON.stringify(value)
  if (currentJson !== newJson && value) {
    editor.value.commands.setContent(value, false)
  }
})

function setLink() {
  if (!editor.value) return

  if (editor.value.isActive('link')) {
    editor.value.chain().focus().unsetLink().run()
    return
  }

  const url = window.prompt('Enter URL:')
  if (url) {
    editor.value.chain().focus().setLink({ href: url }).run()
  }
}

function addImage() {
  if (!editor.value) return

  const url = window.prompt('Enter image URL:')
  if (url) {
    editor.value.chain().focus().setImage({ src: url }).run()
  }
}

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style scoped>
.rich-text-editor {
  border: 1px solid var(--ui-border);
  border-radius: 0.375rem;
  overflow: hidden;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  border-bottom: 1px solid var(--ui-border);
  background-color: var(--ui-bg);
  color: var(--ui-text);
  flex-wrap: wrap;
}

.toolbar-divider {
  width: 1px;
  height: 1.5rem;
  background-color: var(--ui-border);
  margin: 0 0.25rem;
}

.toolbar :deep(.is-active) {
  background-color: var(--ui-bg-elevated);
}

.editor-content {
  min-height: 300px;
  padding: 1rem;
}

.editor-content :deep(.tiptap) {
  outline: none;
  min-height: 280px;
}

.editor-content :deep(.tiptap h2) {
  font-size: 1.5rem;
  font-weight: 700;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.editor-content :deep(.tiptap h3) {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 1.25rem;
  margin-bottom: 0.5rem;
}

.editor-content :deep(.tiptap p) {
  margin-bottom: 0.75rem;
}

.editor-content :deep(.tiptap ul),
.editor-content :deep(.tiptap ol) {
  padding-left: 1.5rem;
  margin-bottom: 0.75rem;
}

.editor-content :deep(.tiptap a) {
  color: var(--ui-primary);
  text-decoration: underline;
}

.editor-content :deep(.tiptap img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.375rem;
  margin: 0.75rem 0;
}
</style>
