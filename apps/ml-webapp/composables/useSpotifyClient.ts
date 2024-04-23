import {
  AuthorizationCodeWithPKCEStrategy,
  Scopes,
  SpotifyApi,
} from '@spotify/web-api-ts-sdk'

export const useSpotifyClient = () => {
  const config = useRuntimeConfig()
  const auth = new AuthorizationCodeWithPKCEStrategy(
    config.public.spotifyClientId,
    config.public.spotifyRedirectUrl,
    Scopes.all
  )
  const client = new SpotifyApi(auth)
  return client
}
