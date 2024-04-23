const publicPages = ['/', '/auth-callback']

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  if (!authStore.isAuthenticated && to.path.includes('/app')) {
    return navigateTo('/')
  } else if (authStore.isAuthenticated && publicPages.includes(to.path)) {
    return navigateTo('/app')
  }
})
