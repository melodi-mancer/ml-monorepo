export default defineNuxtRouteMiddleware((to, from) => {
  const userDataStore = useUserDataStore()
  if (!userDataStore.isPopulated) {
    return navigateTo('/app')
  }
})
