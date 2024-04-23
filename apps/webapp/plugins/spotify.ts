import { useSpotifyClient } from '~/composables/useSpotifyClient'

export default defineNuxtPlugin(() => {
  const client = useSpotifyClient()
  const spotifyClient = new SpotifyClient(client)
  return {
    provide: {
      spotify: spotifyClient,
    },
  }
})
