<template>
  <div class="container page-content">
    <div v-if="error" class="stack stack--lg">
      <h1>{{ $t('uupg.people_group_not_found') }}</h1>
      <p>{{ $t('uupg.people_group_not_found_description') }}</p>
      <NuxtLink :to="localePath('/adopt')" class="button compact">
        {{ $t('uupg.back') }}
      </NuxtLink>
    </div>

    <div v-else-if="uupg" class="stack stack--2xl">
      <!-- UUPG Info Card -->
      <div class="card">
        <div class="switcher | align-center gap-md" data-width="xl">
          <img :src="uupg.picture_url" :alt="uupg.display_name" class="uupg-detail__image">
          <div class="stack stack--sm">
            <h1>{{ uupg.display_name }}</h1>
            <p class="font-size-lg">{{ uupg.country?.label }}</p>
          </div>
        </div>
      </div>

      <!-- Commitment Section -->
      <div class="stack stack--lg">
        <h2>{{ $t('adoption_form.commitment_heading') }}</h2>
        <p>{{ $t('adoption_form.commitment_intro') }}</p>
        <div class="stack stack--md">
          <div class="stack stack--xs">
            <h3>{{ $t('nav.pray') }}</h3>
            <p>{{ $t('adoption_form.pray_description') }}</p>
          </div>
          <div class="stack stack--xs">
            <h3>{{ $t('adoption_form.give') }}</h3>
            <p>{{ $t('adoption_form.give_description') }}</p>
            <p class="font-size-sm">{{ $t('adoption_form.give_recommendation') }}</p>
          </div>
          <div class="stack stack--xs">
            <h3>{{ $t('adoption_form.send') }}</h3>
            <p>{{ $t('adoption_form.send_description') }}</p>
          </div>
        </div>
      </div>

      <!-- Adoption Form -->
      <form v-if="!formStatus" class="stack stack--xl" @submit.prevent="onSubmit">
        <!-- Champion Details -->
        <fieldset class="stack stack--lg">
          <legend class="h3">{{ $t('adoption_form.champion_details') }}</legend>
          <p class="font-size-sm">{{ $t('adoption_form.champion_description') }}</p>

          <div class="switcher | gap-md" data-width="xl">
            <div class="stack stack--xs">
              <label for="first-name">{{ $t('adoption_form.first_name') }}</label>
              <input
                id="first-name"
                v-model="form.first_name"
                type="text"
                required
              >
            </div>
            <div class="stack stack--xs">
              <label for="last-name">{{ $t('adoption_form.last_name') }}</label>
              <input
                id="last-name"
                v-model="form.last_name"
                type="text"
                required
              >
            </div>
          </div>

          <div class="stack stack--xs">
            <label for="email">{{ $t('adoption_form.email') }}</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              :placeholder="$t('adoption_form.email_placeholder')"
              required
            >
          </div>

          <div class="stack stack--xs">
            <label for="phone">{{ $t('adoption_form.phone') }}</label>
            <PhoneInput v-model="form.phone" />
          </div>

          <div class="stack stack--xs">
            <label for="role">{{ $t('adoption_form.role') }}</label>
            <input
              id="role"
              v-model="form.role"
              type="text"
              :placeholder="$t('adoption_form.role_placeholder')"
            >
          </div>
        </fieldset>

        <!-- Church Details -->
        <fieldset class="stack stack--lg">
          <legend class="h3">{{ $t('adoption_form.partnering_church') }}</legend>

          <div class="stack stack--xs">
            <label for="church-name">{{ $t('adoption_form.church_name') }}</label>
            <input
              id="church-name"
              v-model="form.church_name"
              type="text"
              :placeholder="$t('adoption_form.church_name_placeholder')"
            >
          </div>

          <div class="inline-flex align-center gap-sm">
            <input
              id="public-display"
              v-model="form.confirm_public_display"
              type="checkbox"
            >
            <label for="public-display">{{ $t('adoption_form.public_consent') }}</label>
          </div>

          <div class="stack stack--xs">
            <label for="country">{{ $t('adoption_form.church_location') }}</label>
            <CountrySelect v-model="form.country" />
          </div>
        </fieldset>

        <!-- Confirmations -->
        <div class="stack stack--md">
          <div class="inline-flex align-center gap-sm">
            <input
              id="confirm-adoption"
              v-model="form.confirm_adoption"
              type="checkbox"
              required
            >
            <label for="confirm-adoption">{{ $t('adoption_form.adoption_commitment') }}</label>
          </div>

          <div class="inline-flex align-center gap-sm">
            <input
              id="permission-contact"
              v-model="form.permission_to_contact"
              type="checkbox"
            >
            <label for="permission-contact">{{ $t('adoption_form.connect_permission') }}</label>
          </div>
        </div>

        <CloudflareTurnstile @verified="onTurnstileVerified" />

        <p v-if="errorMessage" class="color-error">{{ errorMessage }}</p>

        <button type="submit" class="button" :disabled="submitting || !turnstileToken">
          {{ submitting ? $t('common.submitting') : $t('common.submit') }}
        </button>
      </form>

      <!-- Success / Verification Messages -->
      <div v-else-if="formStatus === 'needs_verification'" class="stack stack--md">
        <p>{{ $t('adoption_form.needs_verification') }}</p>
      </div>

      <div v-else-if="formStatus === 'success'" class="stack stack--md">
        <p>{{ $t('adoption_form.success') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const slug = route.params.slug as string

definePageMeta({ layout: 'default' })

const { data: uupg, error } = await useFetch<any>(`/api/people-groups/${slug}`)

useHead({
  title: uupg.value?.display_name
    ? `${t('adoption_form.title')} - ${uupg.value.display_name}`
    : t('adoption_form.title'),
})

const form = reactive({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  role: '',
  church_name: '',
  country: '',
  confirm_public_display: false,
  confirm_adoption: false,
  permission_to_contact: false,
})

const turnstileToken = ref('')
const submitting = ref(false)
const formStatus = ref<'success' | 'needs_verification' | null>(null)
const errorMessage = ref('')

function onTurnstileVerified(token: string) {
  turnstileToken.value = token
}

async function onSubmit() {
  if (!form.confirm_adoption) {
    errorMessage.value = t('adoption_form.confirm_commitment')
    return
  }

  submitting.value = true
  errorMessage.value = ''

  try {
    const response = await $fetch<{ status: string }>('/api/adopt', {
      method: 'POST',
      body: {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone: form.phone,
        role: form.role,
        church_name: form.church_name,
        country: form.country,
        confirm_public_display: form.confirm_public_display,
        confirm_adoption: form.confirm_adoption,
        permission_to_contact: form.permission_to_contact,
        people_group: slug,
        language: locale.value,
        cf_turnstile: turnstileToken.value,
      },
    })

    if (response.status === 'needs_verification') {
      formStatus.value = 'needs_verification'
    } else {
      formStatus.value = 'success'
    }
  } catch {
    errorMessage.value = t('adoption_form.error')
  } finally {
    submitting.value = false
  }
}
</script>
