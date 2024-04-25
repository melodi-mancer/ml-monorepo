import type { Track, Playlist, AudioFeatures } from '@spotify/web-api-ts-sdk'
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

const trackAnalysis: PlaylistFilterFunction = async ({
  recommendationsStore,
  userDataStore,
  cfa
}) => {
  const factor = recommendationsStore.factor
  const profile = userDataStore.statisticalAnalysis.filter(
    (r) => r[factor as TrackAnalysisColumns]
  ).reduce((acc, cur) => {
    return {
      ...acc,
      [cur._row]: cur[factor as TrackAnalysisColumns],
    }
  }, {} as Record<AudioFeaturesProps, number>)
  const tracks: Array<TrackAnalysisTrack> = recommendationsStore.recommendations.map((track) => {
    const audio_features = recommendationsStore.recommendationsAudioFeatures.find((af) => af.id === track.id) ?? {} as AudioFeatures
    return {
      trackId: track.id,
      ...{
        danceability: audio_features?.danceability ?? 0,
        energy: audio_features?.energy ?? 0,
        loudness: audio_features?.loudness ?? 0,
        speechiness: audio_features?.speechiness ?? 0,
        acousticness: audio_features?.acousticness ?? 0,
        instrumentalness: audio_features?.instrumentalness ?? 0,
        liveness: audio_features?.liveness ?? 0,
        valence: audio_features?.valence ?? 0,
        tempo: audio_features?.tempo ?? 0,
      }
    }
  })
  const trackIds = await cfa.getSortedTracksAnalysis({ profile, tracks })
  return trackIds.map((id) => recommendationsStore.recommendations.find((t) => t.id === id) as Track) 
}

const PlaylistFilters: PlaylistFiltersObject = {
  default: async ({ recommendationsStore }) =>
    recommendationsStore.recommendations,
  onlyNew,
  trackAnalysis,
}

export const PlaylistFiltersKeys = Object.keys(PlaylistFilters)
