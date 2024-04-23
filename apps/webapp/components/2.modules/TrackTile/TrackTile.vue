<script setup lang="ts">
import './TrackTile.scss'
defineProps<{
  track: Track
}>()
</script>

<template>
  <div class="track-tile">
    <div class="track-info">
      <div
        class="track-album-image"
        :style="[{ backgroundImage: `url('${track.album.images[0].url}')` }]"
      />
      <div class="track-details">
        <div class="track-name">Name: {{ track.name }}</div>
        <div class="track-artist">
          Artists: {{ track.artists.map((a) => a.name).join(', ') }}
        </div>
        <div class="track-album">Album: {{ track.album.name }}</div>
        <div class="track-duration">
          Duration: {{ millisecondsToMinutesAndSeconds(track.duration_ms) }}
        </div>
        <div class="track-links">
          <a :href="track.external_urls.spotify" target="_blank"
            >Open in Spotify</a
          >
        </div>
      </div>
    </div>
    <div v-if="track.preview_url" class="track-player">
      <audio :src="track.preview_url" controls></audio>
    </div>
  </div>
</template>
