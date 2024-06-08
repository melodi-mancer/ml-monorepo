<script setup lang="ts">
definePageMeta({
  layout: 'authenticated',
  middleware: ['user-data-populated'],
})

const userDataStore = useUserDataStore()
</script>

<template>
  <div>
    <NuxtLink to="/app">Back to app</NuxtLink>
    <div v-if="userDataStore.isPopulated" class="stats-container">
      <ModuleStatisticalAnalysisTable
        name="user-data"
        :data="userDataStore.statisticalAnalysis"
        class="stats-table"
      />
    </div>
    <FeatureSetRecommendationFactor />
    <div style="display: flex; width: 100%; justify-content: space-between">
      <FeatureGetRecommendationsBySeed
        seedType="track"
        title="Seed by tracks"
      />
      <FeatureGetRecommendationsBySeed
        seedType="artist"
        title="Seed by artists"
      />
      <FeatureGetRecommendationsBySeed
        seedType="genre"
        title="Seed by genres"
      />
    </div>
  </div>
</template>
