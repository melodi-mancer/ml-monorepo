import type { TrackAnalysisColumns } from '~/utils/CfaClient'
import { useUserDataStore } from './userData'
import type {
  AudioFeatures,
  RecommendationsRequest,
  RecommendationsRequestRequiredArguments,
  Track,
} from '@spotify/web-api-ts-sdk'

export interface RecommendationsState {
  seeds: Array<SeedItem>
  useFactor: boolean
  threshold?: number
  factor?: TrackAnalysisColumns
  payload?: RecommendationsRequest
  recommendations: Array<Track>
  recommendationsAudioFeatures: Array<AudioFeatures>
}

export type SeedTypes = 'track' | 'artist'

const initialState: RecommendationsState = {
  // Admin functionality
  seeds: [],
  useFactor: false,
  threshold: undefined,
  factor: undefined,
  payload: undefined,
  recommendations: [],
  recommendationsAudioFeatures: [],
}

export const useRecommendationsStore = defineStore('recommendations', {
  state: (): RecommendationsState => ({
    ...initialState,
  }),
  getters: {
    availableSeedTypes(state): Array<SeedTypes> {
      return [...new Set(state.seeds.map((seed) => seed.seedType))]
    },
    isSeedEmpty(state): boolean {
      return state.seeds.length === 0
    },
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
    getSeedPayload() {
      return (seedType: SeedTypes): RecommendationsRequestRequiredArguments => {
        switch (seedType) {
          case 'track':
            return { seed_tracks: this.tracksIds }
          case 'artist':
            return { seed_artists: this.artistsIds }
          default:
            return {}
        }
      }
    },
    userSelectedSeed(state): Array<SeedItem> | SeedItem | null {
      const appSettings = useAppSettingsStore()
      return appSettings.adminUi ? state.seeds : state.seeds[0] || null
    },
    tracksSeeds(state) {
      return state.seeds.filter((seed) => seed.seedType === 'track')
    },
    artistsSeeds(state) {
      return state.seeds.filter((seed) => seed.seedType === 'artist')
    },
    tracksIds(state) {
      return state.seeds
        .filter((seed) => seed.seedType === 'track')
        .map((t) => t.id)
    },
    artistsIds(state) {
      return state.seeds
        .filter((seed) => seed.seedType === 'artist')
        .map((t) => t.id)
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
    updateSeed(items: SeedItem | Array<SeedItem> | null) {
      let newSeeds: Array<SeedItem>
      if (Array.isArray(items)) {
        newSeeds = items
      } else if (!items) {
        newSeeds = []
      } else {
        newSeeds = [items]
      }
      const tackSeeds = newSeeds.filter((seed) => seed.seedType === 'track')
      const artistSeeds = newSeeds.filter((seed) => seed.seedType === 'artist')
      if (tackSeeds.length > 5 || artistSeeds.length > 5) {
        throw new Error('You can only have 5 seeds of each type')
      }
      this.seeds = newSeeds
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
      this.seeds = initialState.seeds
      this.recommendations = initialState.recommendations
      this.recommendationsAudioFeatures =
        initialState.recommendationsAudioFeatures
      this.payload = initialState.payload
      this.useFactor = initialState.useFactor
      this.threshold = initialState.threshold
      this.factor = initialState.factor
    },
  },
  persist: {
    storage: persistedState.localStorage,
  },
})
