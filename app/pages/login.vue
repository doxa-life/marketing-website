<template>
  <div class="login-page">
    <div class="login-container">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-(--ui-text) mb-2">DOXA Admin</h1>
        <p class="text-(--ui-text-muted)">Sign in to manage the website</p>
      </div>

      <UCard :ui="{ body: 'p-6 sm:p-8' }">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <UAlert
            v-if="error"
            color="error"
            variant="soft"
            :title="error"
            @close="error = ''"
          />

          <UFormField label="Email" name="email" required>
            <UInput
              v-model="email"
              type="email"
              placeholder="you@example.com"
              size="lg"
              :disabled="loading"
              autocomplete="email"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Password" name="password" required>
            <UInput
              v-model="password"
              type="password"
              placeholder="Enter your password"
              size="lg"
              :disabled="loading"
              autocomplete="current-password"
              class="w-full"
            />
          </UFormField>

          <UButton
            type="submit"
            color="primary"
            size="lg"
            block
            :loading="loading"
            :disabled="loading || !email || !password"
          >
            Sign In
          </UButton>
        </form>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const { login, isLoggedIn } = useAuth()
const route = useRoute()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

// Ensure redirect defaults to /admin for this marketing site
onMounted(() => {
  if (isLoggedIn.value) {
    const redirect = route.query.redirect as string
    navigateTo(redirect || '/admin')
  }

  // If no redirect param, add one so the base layer login() redirects to /admin
  if (!route.query.redirect) {
    navigateTo({ path: '/login', query: { redirect: '/admin' } }, { replace: true })
  }
})

async function handleLogin() {
  error.value = ''
  loading.value = true

  try {
    const result = await login(email.value, password.value)

    if (!result.success) {
      error.value = result.message || 'Login failed. Please check your credentials.'
    }
    // On success, the base layer's login() handles navigation via route.query.redirect
  } catch (err: any) {
    error.value = err.data?.message || 'An error occurred during login. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-container {
  width: 100%;
  max-width: 28rem;
  padding: 1rem;
}
</style>
