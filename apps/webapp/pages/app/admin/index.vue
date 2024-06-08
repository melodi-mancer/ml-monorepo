<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})
const userDataStore = useUserDataStore()
const userDataAction = computed(() =>
  userDataStore.isPopulated ? 'Update' : 'Get'
)
const timeRangeOptions: Array<SpotifyTimeRanges> = [
  'short_term',
  'medium_term',
  'long_term',
]
const timeRange = ref<SpotifyTimeRanges>(userDataStore.timeRange)
async function handleGetUserDataClick() {
  try {
    await userDataStore.getUserData(timeRange.value)
  } catch (err) {
    console.log(err)
  }
}
</script>

<template>
  <div class="user-data-container">
    <select v-model="timeRange">
      <option
        v-for="option in timeRangeOptions"
        :key="option"
        :value="option"
        :selected="option === timeRange"
      >
        {{ option }}
      </option>
    </select>
    <ElButton
      :title="`${userDataAction} user data`"
      @click="handleGetUserDataClick"
    />
    <div>
      <NuxtLink
        v-if="userDataStore.isPopulated"
        to="/app/admin/get-recommendations"
        >Get Recommendations</NuxtLink
      >
    </div>
  </div>
  <div v-if="userDataStore.isPopulated" class="stats-container">
    <ModuleStatisticalAnalysisTable
      name="user-data"
      :data="userDataStore.statisticalAnalysis"
      class="stats-table"
    />
  </div>
  <div>
    <FeatureFilterByGenre />
  </div>
</template>
