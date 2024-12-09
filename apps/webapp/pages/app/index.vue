<script setup lang="ts">

definePageMeta({
  layout: 'authenticated',
})
const props = defineProps<{
  title: string
  seedType: SeedTypes
}>()

const userDataStore = useUserDataStore()
const recommendationsStore = useRecommendationsStore()


const layout = inject('layout') as AvailableLayouts | undefined

async function handleRecommendationClick() {
  await recommendationsStore.getRecommendations({ seedType: 'track' })
  navigateTo(buildAppUrl('/app/view-recommendations', layout))
}

const timeRange = 'short_term'
async function test() {
  try {
    await userDataStore.getUserData(timeRange)
  } catch (err) {
    console.log(err)
  }

  let test2 = userDataStore.topTracks[0].id
  console.log(test2)

  recommendationsStore.tracksIds = []
  recommendationsStore.updateSeed('track', test2)
  recommendationsStore.updateFactors({
    useFactor: 'True',
    factor: 'new_RC1',
    threshold:"",
  })

  

  handleRecommendationClick()
}
</script>
<template>

<div class="main">
  <div class="authentic">
    <h1>Click here to instantly get recommendations</h1>
    <p>
      Recommendations will be presented as a playlist that can then be tailored.
    </p>
    <ElButton
      :title="`Get recommendations`"
      @click="test"
    />
  </div>
</div>

</template>
