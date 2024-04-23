<script setup lang="ts">
definePageMeta({
  layout: 'authenticated',
  middleware: ['user-data-populated'],
})

const playlistsStore = usePlaylistStore()
const route = useRoute()
const playlistId = route.params.id

const playlist = computed(() =>
  playlistsStore.playlists.find((p) => p.id === playlistId)
)
</script>

<template>
  <div>
    <NuxtLink to="/app/view-recommendations">Back to recommendations</NuxtLink>
    <div v-if="playlist">
      <h1>Playlist: {{ playlist.name }}</h1>
      <h2>
        Total duration:
        {{
          millisecondsToMinutesAndSeconds(
            playlist.tracks.reduce((a, b) => a + b.duration_ms, 0)
          )
        }}
      </h2>
      <div>
        <h3>Tracks:</h3>
        <ul style="max-width: 600px">
          <li
            v-for="track in playlist.tracks"
            :key="track.id"
            style="margin-bottom: 20px; list-style: none"
          >
            <ModuleTrackTile :track="track" />
          </li>
        </ul>
      </div>
    </div>
    <div v-else>
      <h2>Playlist not found</h2>
    </div>
  </div>
</template>
