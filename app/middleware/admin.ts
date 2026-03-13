export default defineNuxtRouteMiddleware(async (to, _from) => {
  const { user, checkAuth } = useAuth()

  if (!user.value) {
    const authUser = await checkAuth()

    if (!authUser) {
      return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
    }
  }
})
