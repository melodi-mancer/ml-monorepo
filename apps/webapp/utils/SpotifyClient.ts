import type {
  SpotifyApi,
  Artist,
  RecommendationsRequest,
  Track,
} from '@spotify/web-api-ts-sdk'

export type { Track, Artist, RecommendationsRequest }

export type SpotifyTimeRanges =
  | 'short_term'
  | 'medium_term'
  | 'long_term'
  | undefined

type SearchTrack = {
  itemType: 'track'
} & Track

type SearchArtist = {
  itemType: 'artist'
} & Artist

export type SearchItem = SearchTrack | SearchArtist

export class SpotifyClient {
  public client: SpotifyApi

  constructor(client: SpotifyApi) {
    this.client = client
  }

  getProfile() {
    return this.client.currentUser.profile()
  }

  authenticate() {
    return this.client.authenticate()
  }

  logOut() {
    return this.client.logOut()
  }

  async getAllUserTopTracks(timeRange: SpotifyTimeRanges, pages: number = 2) {
    const promises = []
    for (let i = 0; pages > i; i++) {
      const offset = i * 50
      const limit = 50
      promises.push(
        this.client.currentUser.topItems('tracks', timeRange, limit, offset)
      )
    }

    const tracksResult = await Promise.all(promises)
    const tracks = tracksResult.reduce((a, b) => {
      return [...a, ...b.items]
    }, [] as Array<Track>)

    return tracks
  }

  async getTracksArtists(tracks: Array<Track>) {
    //Then get artistID's for those tracks
    const trackArtistIds = [
      ...new Set(
        tracks
          .map((t) => t.artists.map((artist) => artist.id))
          .reduce((a, b) => [...a, ...b], [] as Array<string>)
      ),
    ]
    const promises = []
    for (let i = 0; trackArtistIds.length / 50 > i; i++) {
      promises.push(
        this.client.artists.get(trackArtistIds.slice(i * 50 + 1, i * 50 + 50))
      )
    }
    const artistsResult = await Promise.all(promises)
    //Get artist information for those tracks
    const artistsList = artistsResult.reduce((a, b) => {
      return [...a, ...b]
    }, [] as Array<Artist>)

    return artistsList
  }

  getTracksAudioFeatures(trackIds: Array<string>) {
    return this.client.tracks.audioFeatures(trackIds)
  }

  getRecommendations(payload: RecommendationsRequest) {
    return this.client.recommendations.get(payload)
  }

  async createPlaylist({
    profileId,
    trackUris,
    name,
    generatePlaylist,
  }: {
    profileId: string
    trackUris?: Array<string>
    name?: string
    generatePlaylist?: boolean
  }) {
    console.log('generatePlaylist: ', generatePlaylist)
    let playlistName = name
    if (!playlistName) {
      const currentDate = new Date()
      playlistName = currentDate.toISOString()
    }
    if (!generatePlaylist) {
      return {
        id: new Date().toISOString(),
        name: playlistName,
      }
    }
    const playlist = await this.client.playlists.createPlaylist(profileId, {
      name: `Melodimancer: ${playlistName}`,
      public: false,
    })

    if (trackUris && trackUris.length) {
      await this.addTracksToPlaylist(playlist.id, trackUris)
    }
    return playlist
  }

  addTracksToPlaylist(playlistId: string, tracksUris: Array<string>) {
    return this.client.playlists.addItemsToPlaylist(playlistId, tracksUris)
  }

  async searchTracksAndArtists(search: string): Promise<SearchItem[]> {
    const [tracksResult, artistsResult] = await Promise.all([
      this.client.search(`track:${search}`, ['track'], undefined, 5),
      this.client.search(`artist:${search}`, ['artist'], undefined, 5),
    ])
    const tracks = tracksResult.tracks.items.map((track) => ({
      itemType: 'track',
      ...track,
    })) as SearchTrack[]
    const artists = artistsResult.artists.items.map((artist) => ({
      itemType: 'artist',
      ...artist,
    })) as SearchArtist[]
    return [...artists, ...tracks].filter((obj, index, arr) => {
      return (
        arr.findIndex((o) => {
          return o.id === obj.id
        }) === index
      )
    })
  }

  // Helpers
  sortTopGenreFromArtists(artists: Array<Artist>, depth: number = 1) {
    const genres: Record<string, number> = {}
    artists.forEach((artist) => {
      const artistGenres = artist.genres.filter((_, i) => i < depth)
      artistGenres.forEach((genre) => {
        if (genres[genre]) {
          genres[genre] = genres[genre] + 1
        } else {
          genres[genre] = 1
        }
      })
    })
    return Object.entries(genres)
      .sort((a, b) => (a[1] > b[1] ? -1 : 1))
      .filter((g) => g[1] > MINIMAL_TRACKS_LENGTH_FOR_ANALYSIS)
      .map((g) => g[0])
  }
}
