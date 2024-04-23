import type { Artist, AudioFeatures, Track } from '@spotify/web-api-ts-sdk'
import type { TrackAnalysisRow } from '~/utils/CfaClient'
import type { SpotifyTimeRanges } from '~/utils/SpotifyClient'

export interface UserDataState {
  userId: string
  timeRange: SpotifyTimeRanges
  topTracks: Array<Track>
  topArtists: Array<Artist>
  tracksAudioFeatures: Array<AudioFeatures>
  statisticalAnalysis: Array<TrackAnalysisRow>
}

type TrackFilters = {
  default: () => Array<Track>
  byGenre: (genre?: Array<string> | string) => Array<Track>
}

export const useUserDataStore = defineStore('userData', {
  state: (): UserDataState => {
    return {
      userId: '',
      timeRange: 'short_term',
      topTracks: [],
      topArtists: [],
      tracksAudioFeatures: [],
      statisticalAnalysis: [],
    }
  },
  getters: {
    isPopulated: (state) =>
      state.topTracks.length > 0 &&
      state.topArtists.length > 0 &&
      state.tracksAudioFeatures.length > 0 &&
      state.statisticalAnalysis.length > 0,
    availableFactors: (state) => {
      const factors = []
      for (const analisys of state.statisticalAnalysis) {
        factors.push(...Object.keys(analisys).filter((k) => k !== '_row'))
      }
      return [...new Set(factors)]
    },
    filteredTracks: (state): TrackFilters => {
      return {
        default: () => state.topTracks,
        byGenre: (genre) =>
          state.topTracks.filter((t) => {
            if (!genre) return true
            const artist = state.topArtists.find(
              (a) => a.id === t.artists[0].id
            )
            if (Array.isArray(genre))
              return artist?.genres.some((g) => genre.includes(g))
            return artist?.genres.some((g) => g === genre)
          }),
      }
    },
  },
  actions: {
    async getUserData(timeRange?: SpotifyTimeRanges, pages?: number) {
      const nuxt = useNuxtApp()
      if (timeRange) {
        this.timeRange = timeRange
      }
      if (!this.userId) {
        this.userId = (await nuxt.$spotify.getProfile()).id
      }
      this.topTracks = await nuxt.$spotify.getAllUserTopTracks(
        this.timeRange,
        pages
      )
      this.tracksAudioFeatures = await nuxt.$spotify.getTracksAudioFeatures(
        this.getTracksIds()
      )
      this.topArtists = await nuxt.$spotify.getTracksArtists(this.topTracks)
      this.statisticalAnalysis = await nuxt.$cfa.getTracksAnalysis(
        this.tracksAudioFeatures
      )
    },
    async getStatisticalAnalysis(
      filter: keyof TrackFilters,
      genre?: Array<string> | string
    ) {
      const nuxt = useNuxtApp()
      const ids = this.getTracksIds({ filter, genre })
      const audioFeatures = this.tracksAudioFeatures.filter((t) =>
        ids.includes(t.id)
      )
      if (audioFeatures.length <= MINIMAL_TRACKS_LENGTH_FOR_ANALYSIS) {
        console.error('Not enough tracks to analyze')
        return
      }
      this.statisticalAnalysis = await nuxt.$cfa.getTracksAnalysis(
        audioFeatures
      )
    },
    getTracksIds(
      options:
        | {
            filter?: keyof TrackFilters
            offset?: number
            limit?: number
            genre?: Array<string> | string
          }
        | undefined = {}
    ) {
      const { filter = 'default', offset = 0, limit, genre } = options
      return sliceArray(this.filteredTracks[filter](genre), {
        offset,
        limit,
      }).map((t) => t.id)
    },
    getArtistsGenres(offset: number = 0, limit?: number) {
      const nuxt = useNuxtApp()
      const artists = sliceArray(this.topArtists, { offset, limit })
      return nuxt.$spotify.sortTopGenreFromArtists(artists, GENRES_DEPTH)
    },
    clearUserData() {
      this.userId = ''
      this.topTracks = []
      this.topArtists = []
      this.tracksAudioFeatures = []
      this.statisticalAnalysis = []
    },
  },
  persist: {
    storage: persistedState.localStorage,
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserDataStore, import.meta.hot))
}
