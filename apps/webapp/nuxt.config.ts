import pkg from './package.json'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    },
  },
  css: ['~/assets/main.scss', 'vue-json-pretty/lib/styles.css'],
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
  modules: ['@pinia/nuxt', '@pinia-plugin-persistedstate/nuxt', '@nuxt/eslint'],
  runtimeConfig: {
    public: {
      spotifyClientId: process.env.SPOTIFY_CLIENT_ID ?? '',
      spotifyRedirectUrl: process.env.SPOTIFY_REDIRECT_URL ?? '',
      cfaApiUrl: process.env.CFA_API_URL ?? '',
      generatePlaylist: process.env.GENERATE_PLAYLIST === 'true',
      appVersion: pkg.version,
    },
  },
  devtools: { enabled: true },
})
