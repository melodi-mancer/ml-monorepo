import type { Track, Playlist } from '@spotify/web-api-ts-sdk'
import { useUserDataStore } from './userData'
import type { CfaClient } from '#imports'

type MlPlaylist = {
  id: string
  name: string
  tracks: Array<Track>
  spotifyPlaylist: Playlist | { id: string; name: string }
}

export type AlgorithmsAvailable = keyof typeof PlaylistFilters

type PlaylistFilterFunction = (args: {
  userDataStore: UserDataState
  recommendationsStore: RecommendationsState
  cfa: CfaClient
}) => Promise<Array<Track>>

type PlaylistFiltersObject = Record<string, PlaylistFilterFunction>

type CreatePlaylistArgs = {
  name?: string
  runTime: number
  algorithm: AlgorithmsAvailable
}

interface PlaylistState {
  playlists: Array<MlPlaylist>
}

export const usePlaylistStore = defineStore('playlist', {
  state: (): PlaylistState => {
    return {
      playlists: [],
    }
  },
  actions: {
    async createPlaylist({ runTime, algorithm, name }: CreatePlaylistArgs) {
      const nuxt = useNuxtApp()
      const config = useRuntimeConfig()
      const userDataStore = useUserDataStore()
      try {
        const filteredTracks = await this.filterTrackList(algorithm)
        const selectedTracks = this.selectTracksByRuntime(
          filteredTracks,
          runTime * 60000
        )
        const playlist = await nuxt.$spotify.createPlaylist({
          profileId: userDataStore.userId,
          trackUris: selectedTracks.map((t) => t.id),
          generatePlaylist: config.public.generatePlaylist,
        })
        this.playlists.push({
          id: playlist.id,
          name: playlist.name,
          tracks: selectedTracks,
          spotifyPlaylist: playlist,
        })
        return playlist.id
      } catch (err) {
        console.error(err)
      }
    },
    async filterTrackList(algorithm: AlgorithmsAvailable) {
      const userDataStore = useUserDataStore()
      const recommendationsStore = useRecommendationsStore()
      const nuxt = useNuxtApp()
      return PlaylistFilters[algorithm]({
        userDataStore,
        recommendationsStore,
        cfa: nuxt.$cfa,
      })
    },
    selectTracksByRuntime(tracks: Array<Track>, runTime: number) {
      if (runTime === 0) return tracks
      let totalTime = 0
      const selectedTracks = []
      for (const track of tracks) {
        totalTime += track.duration_ms
        selectedTracks.push(track)
        if (totalTime >= runTime) {
          break
        }
      }
      return selectedTracks
    },
  },
  persist: {
    storage: persistedState.localStorage,
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePlaylistStore, import.meta.hot))
}

const onlyNew: PlaylistFilterFunction = async ({
  recommendationsStore,
  userDataStore,
}) => {
  return recommendationsStore.recommendations.filter(
    (track) => !userDataStore.topTracks.some((t) => t.id === track.id)
  )
}

const PlaylistFilters: PlaylistFiltersObject = {
  default: async ({ recommendationsStore }) =>
    recommendationsStore.recommendations,
  onlyNew,
}

export const PlaylistFiltersKeys = Object.keys(PlaylistFilters)
