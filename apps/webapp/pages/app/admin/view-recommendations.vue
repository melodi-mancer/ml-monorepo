<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['user-data-populated'],
})

const recommendationsStore = useRecommendationsStore()
</script>

<template>
  <div>
    <NuxtLink to="/app/admin/get-recommendations">Back to app</NuxtLink>
    <div>
      <h2>Payload:</h2>
      <VueJsonPretty
        v-if="recommendationsStore.payload"
        :data="recommendationsStore.payload"
      />
    </div>
    <div v-if="recommendationsStore.recommendations.length">
      <FeatureCreatePlaylist />
    </div>
    <div>
      <h2>
        Recommended Tracks: {{ recommendationsStore.recommendations.length }}
      </h2>
      <ul style="max-width: 600px">
        <li
          v-for="track in recommendationsStore.recommendations"
          :key="track.id"
          style="margin-bottom: 20px; list-style: none"
        >
          <ModuleTrackTile :track="track" />
        </li>
      </ul>
    </div>
  </div>
</template>
