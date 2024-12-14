import { defineVuetifyConfiguration } from 'vuetify-nuxt-module/custom-configuration'

export default defineVuetifyConfiguration({
  /* vuetify options */
  defaults: {
    VBtn: {
      color: 'primary',
      rounded: true,
      size: 'large',
      variant: 'flat',
    },
  },
})
