<template>
  <select :value="modelValue" :required="required" @change="onChange">
    <option value="" disabled>{{ $t('adoption_form.select_country') }}</option>
    <option v-for="country in countries" :key="country" :value="country">
      {{ country }}
    </option>
  </select>
</template>

<script setup lang="ts">
import { countries } from '~/utils/countries'

withDefaults(defineProps<{
  modelValue?: string
  required?: boolean
}>(), {
  modelValue: '',
  required: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function onChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value
  emit('update:modelValue', value)
}
</script>
