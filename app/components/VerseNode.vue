<script setup lang="ts">
import { NodeViewWrapper, NodeViewContent, type NodeViewProps } from '@tiptap/vue-3'

const props = defineProps<NodeViewProps>()

const reference = ref(props.node.attrs.reference || '')

const isEditable = computed(() => props.editor.isEditable)

function saveReference() {
  props.updateAttributes({ reference: reference.value || null })
}
</script>

<template>
  <NodeViewWrapper class="verse-node" data-type="verse">
    <div
      v-if="isEditable"
      class="verse-reference-bar"
      contenteditable="false"
    >
      <UInput
        v-model="reference"
        placeholder="e.g. Revelation 7:9"
        size="xs"
        class="verse-reference-input"
        @blur="saveReference"
        @keydown.enter.prevent="saveReference"
      />
    </div>
    <NodeViewContent class="verse-content" />
    <div v-if="reference" class="verse-citation" contenteditable="false">
      &ndash; {{ reference }}
    </div>
  </NodeViewWrapper>
</template>

<style scoped>
.verse-node {
  background-color: var(--ui-color-primary-500, #4a7c59);
  border-radius: 0.5rem;
  padding: 1.25rem 1.5rem;
  margin: 1rem 0;
}

.verse-reference-bar {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.verse-reference-input {
  flex: 1;
  max-width: 240px;
}

.verse-citation {
  text-align: right;
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.85rem;
  font-style: italic;
  margin-top: 0.75rem;
}

:deep(.verse-content p) {
  text-align: center;
  color: white;
  font-size: 1.1rem;
  line-height: 1.5;
  margin: 0.375rem 0;
}

:deep(.verse-content p:first-child) {
  margin-top: 0;
}

:deep(.verse-content p:last-child) {
  margin-bottom: 0;
}
</style>
