<script setup lang="ts">
const props = defineProps<{
  title: string
  seedType: SeedTypes
}>()
const layout = inject('layout') as AvailableLayouts | undefined
const userDataStore = useUserDataStore()
const recommendationsStore = useRecommendationsStore()

const list = ref<Array<Record<string, unknown>>>([])
const selected = ref<Array<string>>([])
switch (props.seedType) {
  case 'track':
    list.value = userDataStore.topTracks
    selected.value = recommendationsStore.tracksIds
    break
  case 'artist':
    list.value = userDataStore.topArtists
    selected.value = recommendationsStore.artistsIds
    break
  case 'genre':
    list.value = userDataStore
      .getArtistsGenres()
      .map((genre) => ({ name: genre, id: genre }))
    selected.value = recommendationsStore.genres
    break
}
watch(selected, (newValue) => {
  recommendationsStore.updateSeed(props.seedType, newValue)
})

async function handleRecommendationClick() {
  await recommendationsStore.getRecommendations({ seedType: props.seedType })
  navigateTo(buildAppUrl('/app/view-recommendations', layout))
}
</script>

<template>
  <div>
    <h2>{{ title }}</h2>
    <ElMultiSelect
      v-model="selected"
      :name="title"
      :data="list"
      searchKey="name"
      valueKey="id"
      :max="5"
    />
    <ElButton
      :title="`Get recommendations by ${seedType}`"
      @click="handleRecommendationClick"
    />
  </div>
</template>
