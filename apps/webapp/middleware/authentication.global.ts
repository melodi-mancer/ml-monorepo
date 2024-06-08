const publicPages = ['/', '/auth-callback']

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  const userDataStore = useUserDataStore()
  if (!authStore.isAuthenticated && to.path.includes('/app')) {
    return navigateTo('/')
  } else if (to.path.includes('/app/admin')) {
    if (!authStore.isAuthenticated || !userDataStore.isAdmin) {
      return navigateTo('/app')
    }
  } else if (authStore.isAuthenticated && publicPages.includes(to.path)) {
    return navigateTo('/app')
  }
})
