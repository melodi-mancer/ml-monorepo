import type { ThemeInstance } from 'vuetify'

interface AppSettingsState {
  dark: boolean
  adminUi: boolean
}

export const useAppSettingsStore = defineStore('appSettings', {
  state: (): AppSettingsState => {
    return {
      dark: false,
      adminUi: false,
    }
  },
  actions: {
    setTheme(dark: boolean, theme: ThemeInstance) {
      this.dark = dark
      theme.global.name.value = dark ? 'dark' : 'light'
    },
    toggleTheme(theme: ThemeInstance) {
      this.dark = !this.dark
      theme.global.name.value = this.dark ? 'dark' : 'light'
    },
    setAdminUi(adminUi: boolean) {
      this.adminUi = adminUi
    },
    toggleAdminUi() {
      this.adminUi = !this.adminUi
    },
  },
  persist: true,
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAppSettingsStore, import.meta.hot))
}
