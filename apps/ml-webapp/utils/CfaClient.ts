import type { AudioFeatures } from '@spotify/web-api-ts-sdk'

type AudioFeaturesProps =
  | 'danceability'
  | 'energy'
  | 'loudness'
  | 'speechiness'
  | 'acousticness'
  | 'instrumentalness'
  | 'liveness'
  | 'valence'
  | 'tempo'

type TrackAnalysisAudioFeatures = Pick<AudioFeatures, AudioFeaturesProps>

export type TrackAnalysisColumns =
  | 'RC1'
  | 'RC2'
  | 'RC3'
  | 'RC4'
  | 'PC1'
  | 'new_RC1'
  | 'new_RC2'
  | 'new_RC3'
  | 'new_RC4'
  | 'new_PC1'

export type TrackAnalysisRow = {
  _row: AudioFeaturesProps
} & Record<TrackAnalysisColumns, number>

export const trackAnalysisOptions: Array<TrackAnalysisColumns> = [
  'RC1',
  'RC2',
  'RC3',
  'RC4',
  'PC1',
  'new_RC1',
  'new_RC2',
  'new_RC3',
  'new_RC4',
  'new_PC1',
]

export class CfaClient {
  public baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  getTracksAnalysis(audioFeatures: Array<AudioFeatures>) {
    const request = {
      audio_features: this.mapAudioFeaturesToTrackAnalysis(audioFeatures),
    }
    return fetch(`${this.baseUrl}/cfa`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })
      .then<{ profile_cfa: Array<TrackAnalysisRow> }>((res) => res.json())
      .then<Array<TrackAnalysisRow>>((res) => res.profile_cfa)
  }

  mapAudioFeaturesToTrackAnalysis(
    audioFeatures: Array<AudioFeatures>
  ): Array<TrackAnalysisAudioFeatures> {
    return audioFeatures.map((track) => {
      return {
        danceability: track.danceability,
        energy: track.energy,
        loudness: track.loudness,
        speechiness: track.speechiness,
        acousticness: track.acousticness,
        instrumentalness: track.instrumentalness,
        liveness: track.liveness,
        valence: track.valence,
        tempo: track.tempo,
      }
    })
  }
}
