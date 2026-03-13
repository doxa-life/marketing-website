<template>
  <div ref="containerRef"></div>
</template>

<script setup lang="ts">
declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string
      remove: (widgetId: string) => void
      reset: (widgetId: string) => void
    }
    onTurnstileLoad?: () => void
  }
}

const emit = defineEmits<{
  verified: [token: string]
}>()

const config = useRuntimeConfig()
const containerRef = ref<HTMLElement | null>(null)
const widgetId = ref<string | null>(null)

function renderWidget() {
  if (!containerRef.value || !window.turnstile) return
  widgetId.value = window.turnstile.render(containerRef.value, {
    sitekey: config.public.cfTurnstileSiteKey,
    theme: 'light',
    callback: (token: string) => {
      emit('verified', token)
    },
  })
}

onMounted(() => {
  if (window.turnstile) {
    renderWidget()
    return
  }

  window.onTurnstileLoad = () => {
    renderWidget()
  }

  const script = document.createElement('script')
  script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad'
  script.async = true
  document.head.appendChild(script)
})

function reset() {
  if (widgetId.value && window.turnstile) {
    window.turnstile.reset(widgetId.value)
  }
}

defineExpose({ reset })

onBeforeUnmount(() => {
  if (widgetId.value && window.turnstile) {
    window.turnstile.remove(widgetId.value)
  }
})
</script>
