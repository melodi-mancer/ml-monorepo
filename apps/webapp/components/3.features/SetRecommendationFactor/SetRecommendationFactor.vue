<script setup lang="ts">
const userDataStore = useUserDataStore()
const recommendationsStore = useRecommendationsStore()

const useFactor = ref(recommendationsStore.useFactor)
const selectedFactor = ref<TrackAnalysisColumns | undefined>(
  recommendationsStore.factor
)
const threshold = ref<number | undefined>(recommendationsStore.threshold)

watchEffect(() => {
  recommendationsStore.updateFactors({
    useFactor: useFactor.value,
    factor: selectedFactor.value,
    threshold: threshold.value,
  })
})
</script>

<template>
  <div>
    <h2>Set Recommendation Factor</h2>
    <div>
      <label for="useFactor">Use factor:</label>
      <input type="checkbox" id="useFactor" v-model="useFactor" />
    </div>
    <div v-if="useFactor">
      <label for="factor">Select a factor:</label>
      <select id="factor" v-model="selectedFactor">
        <option
          v-for="factor in userDataStore.availableFactors"
          :key="factor"
          :value="factor"
        >
          {{ factor }}
        </option>
      </select>
    </div>
    <div v-if="useFactor">
      <label for="factor">Select a threshold:</label>
      <input type="number" min="0" max="1" step="0.1" v-model="threshold" />
    </div>
  </div>
</template>
