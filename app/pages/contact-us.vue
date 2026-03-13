<template>
  <div class="container page-content">
    <h1 class="page-title">{{ $t('contact.title') }}</h1>

    <form class="stack stack--md max-width-lg center" @submit.prevent="onSubmit">
      <!-- Honeypot -->
      <input type="email" name="email" style="display: none;" v-model="honeypot" tabindex="-1" autocomplete="off">

      <div>
        <label for="contact-name">{{ $t('contact.name') }}</label>
        <input
          id="contact-name"
          v-model="form.name"
          type="text"
          :placeholder="$t('contact.name_placeholder')"
          required
        >
      </div>

      <div>
        <label for="contact-email">{{ $t('contact.email') }}</label>
        <input
          id="contact-email"
          v-model="form.email"
          type="email"
          :placeholder="$t('contact.email_placeholder')"
          required
        >
      </div>

      <div>
        <label for="contact-message">{{ $t('contact.message') }}</label>
        <textarea
          id="contact-message"
          v-model="form.message"
          :placeholder="$t('contact.message_placeholder')"
          rows="5"
          required
        ></textarea>
      </div>

      <CloudflareTurnstile ref="turnstileRef" @verified="onTurnstileVerified" />

      <div v-if="statusMessage" class="contact-message" :class="statusType">
        {{ statusMessage }}
      </div>

      <button type="submit" class="button" :disabled="submitting || !turnstileToken">
        {{ submitting ? $t('common.submitting') : $t('common.submit') }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

definePageMeta({ layout: 'default' })
useHead({ title: t('nav.contact_us') })

const form = reactive({
  name: '',
  email: '',
  message: '',
})

const honeypot = ref('')
const turnstileToken = ref('')
const submitting = ref(false)
const statusMessage = ref('')
const statusType = ref<'success' | 'error'>('')
const turnstileRef = ref<{ reset: () => void } | null>(null)

function onTurnstileVerified(token: string) {
  turnstileToken.value = token
}

async function onSubmit() {
  if (honeypot.value) return

  submitting.value = true
  statusMessage.value = ''

  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: {
        name: form.name,
        email: form.email,
        message: form.message,
        cf_turnstile: turnstileToken.value,
      },
    })
    statusMessage.value = t('contact.success')
    statusType.value = 'success'
    form.name = ''
    form.email = ''
    form.message = ''
    turnstileToken.value = ''
    turnstileRef.value?.reset()
  } catch {
    statusMessage.value = t('contact.error')
    statusType.value = 'error'
    turnstileToken.value = ''
    turnstileRef.value?.reset()
  } finally {
    submitting.value = false
  }
}
</script>
