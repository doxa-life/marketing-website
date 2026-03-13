<template>
  <input
    ref="inputRef"
    type="tel"
    :placeholder="placeholder"
    :required="required"
  >
</template>

<script setup lang="ts">
import 'intl-tel-input/build/css/intlTelInput.css'

const props = withDefaults(defineProps<{
  modelValue?: string
  required?: boolean
  placeholder?: string
  initialCountry?: string
}>(), {
  modelValue: '',
  required: false,
  placeholder: '',
  initialCountry: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputRef = ref<HTMLInputElement | null>(null)
let itiInstance: any = null

onMounted(async () => {
  if (!inputRef.value) return

  const intlTelInput = (await import('intl-tel-input')).default

  let country = props.initialCountry

  if (!country) {
    try {
      const geo = await $fetch<{ country_code: string }>('https://geo.prayer.global/json')
      country = geo.country_code?.toLowerCase() || 'us'
    } catch {
      country = 'us'
    }
  }

  itiInstance = intlTelInput(inputRef.value, {
    initialCountry: country,
    utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input/build/js/utils.js',
    separateDialCode: true,
  })

  if (props.modelValue) {
    itiInstance.setNumber(props.modelValue)
  }

  inputRef.value.addEventListener('countrychange', () => {
    emit('update:modelValue', itiInstance.getNumber())
  })

  inputRef.value.addEventListener('input', () => {
    emit('update:modelValue', itiInstance.getNumber())
  })
})

onBeforeUnmount(() => {
  if (itiInstance) {
    itiInstance.destroy()
  }
})
</script>
