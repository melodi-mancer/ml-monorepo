import { useUserDataStore } from './userData'
interface AuthState {
  accessToken: string | null
  isAuthenticated: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => {
    return {
      accessToken: null,
      isAuthenticated: false,
    }
  },
  actions: {
    async authenticate() {
      const nuxt = useNuxtApp()
      const router = useRouter()
      try {
        const response = await nuxt.$spotify.authenticate()
        this.accessToken = response.accessToken.access_token
        this.isAuthenticated = response.authenticated
        if (this.isAuthenticated) {
          router.push('/app')
        }
      } catch (err) {
        console.error(err)
      }
    },
    setAccessToken(token: string) {
      this.accessToken = token
      this.isAuthenticated = true
    },
    async logOut() {
      const nuxt = useNuxtApp()
      const router = useRouter()
      const useUserDataStoreStore = useUserDataStore()
      try {
        await nuxt.$spotify.logOut()
        useUserDataStoreStore.clearUserData()
        this.accessToken = null
        this.isAuthenticated = false
        router.push('/')
      } catch (err) {
        console.error(err)
      }
    },
  },
  persist: true,
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
