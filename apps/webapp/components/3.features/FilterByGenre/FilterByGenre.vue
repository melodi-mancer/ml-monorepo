<script setup lang="ts">
const userDataStore = useUserDataStore()

const genre = ref<string>('')
const options = computed(() => userDataStore.getArtistsGenres())

async function handleGenerateAnalysisClick() {
  await userDataStore.getStatisticalAnalysis('byGenre', genre.value)
}
async function handleGenerateAnalysisForTopGenresClick() {
  await userDataStore.getStatisticalAnalysis('byGenre', options.value)
}
</script>

<template>
  <div>
    <select v-model="genre">
      <option v-for="option in options" :key="option" :value="option">
        {{ option }}
      </option>
    </select>
    <ElButton
      title="Generate analysis by genre"
      @click="handleGenerateAnalysisClick"
    />
    <ElButton
      title="Generate analysis by top genres"
      @click="handleGenerateAnalysisForTopGenresClick"
    />
  </div>
</template>
