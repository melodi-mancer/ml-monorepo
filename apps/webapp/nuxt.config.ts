import pkg from './package.json'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-12-01',

  future: {
    compatibilityVersion: 4,
  },

  ssr: false,

  // when enabling ssr option you need to disable inlineStyles and maybe devLogs
  // features: {
  //   inlineStyles: false,
  //   devLogs: false,
  // },

  build: {
    transpile: ['vuetify'],
  },

  vite: {
    ssr: {
      noExternal: ['vuetify'],
    },
  },
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    },
  },
  css: ['~/assets/main.scss'],
  components: [
    {
      path: '~/components/1.elements',
      prefix: 'El',
    },
    {
      path: '~/components/2.modules',
      prefix: 'Module',
    },
    {
      path: '~/components/3.features',
      prefix: 'Feature',
    },
  ],
  modules: [
    'vuetify-nuxt-module',
    '@nuxt/fonts',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@nuxt/eslint',
    '@vite-pwa/nuxt',
  ],
  vuetify: {
    moduleOptions: {
      /* module specific options */
    },
    vuetifyOptions: './vuetify.config.ts',
  },
  runtimeConfig: {
    public: {
      spotifyClientId: process.env.SPOTIFY_CLIENT_ID ?? '',
      spotifyRedirectUrl: process.env.SPOTIFY_REDIRECT_URL ?? '',
      cfaApiUrl: process.env.CFA_API_URL ?? '',
      generatePlaylist: process.env.GENERATE_PLAYLIST === 'true',
      adminEmails: process.env.ADMIN_EMAILS?.split(',') ?? [],
      appVersion: pkg.version,
    },
  },
  devtools: { enabled: true },
})
