import type { AudioFeatures } from '@spotify/web-api-ts-sdk'

export type AudioFeaturesProps =
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

export type TrackAnalysisTrack = {
  trackId: string
  danceability: number
  energy: number
  loudness: number
  speechiness: number
  acousticness: number
  instrumentalness: number
  liveness: number
  valence: number
  tempo: number
}

export type TrackAnalysisColumns =
  | 'new_RC1'
  | 'new_RC2'
  | 'new_RC3'
  | 'new_RC4'
  | 'new_PC1'

export type TrackAnalysisRow = {
  _row: AudioFeaturesProps
} & Record<TrackAnalysisColumns, number>

export const trackAnalysisOptions: Array<TrackAnalysisColumns> = [
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

  getSortedTracksAnalysis({
    profile,
    tracks,
  }: {
    profile: Record<AudioFeaturesProps, number>
    tracks: Array<TrackAnalysisTrack>
  }) {
    const request = {
      data: {
        profile,
        tracks,
      },
    }
    return fetch(`${this.baseUrl}/z_scored_lists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })
      .then<Array<{ trackId: string; rownumbers: number }>>((res) => res.json())
      .then((res) => res.map((item) => item.trackId))
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
