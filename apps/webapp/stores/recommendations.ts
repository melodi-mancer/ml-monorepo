import type { TrackAnalysisColumns } from '~/utils/CfaClient'
import { useUserDataStore } from './userData'
import type {
  AudioFeatures,
  RecommendationsRequest,
  RecommendationsRequestRequiredArguments,
  Track,
} from '@spotify/web-api-ts-sdk'

export interface RecommendationsState {
  userSelectedSeed: SearchItem | null
  adminSelectedSeeds: Array<SearchItem>
  useFactor: boolean
  threshold?: number
  factor?: TrackAnalysisColumns
  tracksIds: Array<string>
  artistsIds: Array<string>
  genres: Array<string>
  payload?: RecommendationsRequest
  recommendations: Array<Track>
  recommendationsAudioFeatures: Array<AudioFeatures>
}

type AdminSeedTypes = 'track' | 'artist' | 'genre'

export type SeedTypes = 'userSelection' & AdminSeedTypes

const seedMapping: Record<
  AdminSeedTypes,
  keyof Pick<RecommendationsState, 'tracksIds' | 'artistsIds' | 'genres'>
> = {
  track: 'tracksIds',
  artist: 'artistsIds',
  genre: 'genres',
}

const initialState: RecommendationsState = {
  userSelectedSeed: null,
  // Admin functionality
  adminSelectedSeeds: [],
  useFactor: false,
  threshold: undefined,
  factor: undefined,
  tracksIds: [],
  artistsIds: [],
  genres: [],
  payload: undefined,
  recommendations: [],
  recommendationsAudioFeatures: [],
}

export const useRecommendationsStore = defineStore('recommendations', {
  state: (): RecommendationsState => ({
    ...initialState,
  }),
  getters: {
    getRecommendationsWithAudioFeatures(state) {
      return state.recommendations.map((track) => {
        const audioFeatures = state.recommendationsAudioFeatures.find(
          (af) => af.id === track.id
        )
        return { ...track, audioFeatures }
      })
    },
    getFactorsPayload(state) {
      if (!state.useFactor || !state.factor) return {}
      const useUserDataStoreStore = useUserDataStore()
      const factors = useUserDataStoreStore.statisticalAnalysis.filter(
        (r) => r[state.factor as TrackAnalysisColumns]
      )
      return factors.reduce((acc, cur) => {
        if (state.threshold) {
          const percentage =
            cur[state.factor as TrackAnalysisColumns] * state.threshold
          return {
            ...acc,
            [`max_${cur._row}`]:
              cur[state.factor as TrackAnalysisColumns] + percentage,
            [`min_${cur._row}`]:
              cur[state.factor as TrackAnalysisColumns] - percentage,
          }
        }
        return {
          ...acc,
          [`target_${cur._row}`]: cur[state.factor as TrackAnalysisColumns],
        }
      }, {} as RecommendationsRequest)
    },
    getSeedPayload(state) {
      return (seedType: SeedTypes): RecommendationsRequestRequiredArguments => {
        switch (seedType) {
          case 'track':
            return { seed_tracks: state[seedMapping[seedType]] }
          case 'artist':
            return { seed_artists: state[seedMapping[seedType]] }
          case 'genre':
            return { seed_genres: state[seedMapping[seedType]] }
          case 'userSelection': {
            const key =
              state.userSelectedSeed?.itemType === 'track'
                ? 'seed_tracks'
                : 'seed_artists'
            return { [key]: [state.userSelectedSeed?.id] }
          }
          default:
            return {}
        }
      }
    },
  },
  actions: {
    async getRecommendations(options: { seedType: SeedTypes }) {
      const nuxt = useNuxtApp()
      const payload = {
        ...this.getSeedPayload(options.seedType),
        ...this.getFactorsPayload,
        limit: 100,
      }
      try {
        const response = await nuxt.$spotify.getRecommendations(payload)
        this.recommendations = response.tracks
        this.recommendationsAudioFeatures =
          await nuxt.$spotify.getTracksAudioFeatures(
            response.tracks.map((t) => t.id)
          )
        this.payload = payload
      } catch (err) {
        console.error(err)
      }
    },
    setUserSelectedSeed(seed: SearchItem | null) {
      this.userSelectedSeed = seed
    },
    // Admin functionality
    updateSeed(seedType: AdminSeedTypes, items: Array<string> | string) {
      if (Array.isArray(items)) {
        this[seedMapping[seedType]] = items
      } else {
        this[seedMapping[seedType]] = addOrRemoveFromArray(
          items,
          this[seedMapping[seedType]]
        )
      }
    },
    updateFactors({
      useFactor,
      threshold,
      factor,
    }: Pick<RecommendationsState, 'factor' | 'threshold' | 'useFactor'>) {
      this.useFactor = useFactor
      this.threshold = threshold
      this.factor = factor
    },
    resetRecommendationOptions() {
      this.userSelectedSeed = initialState.userSelectedSeed
      this.recommendations = initialState.recommendations
      this.recommendationsAudioFeatures =
        initialState.recommendationsAudioFeatures
      this.payload = initialState.payload
      this.useFactor = initialState.useFactor
      this.threshold = initialState.threshold
      this.factor = initialState.factor
      this.tracksIds = initialState.tracksIds
      this.artistsIds = initialState.artistsIds
      this.genres = initialState.genres
    },
  },
  persist: {
    storage: persistedState.localStorage,
  },
})
