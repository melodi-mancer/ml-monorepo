<script setup lang="ts">
import { getImage, getSubtitle } from '#build/imports'
definePageMeta({
  layout: 'subpage',
})
const minutes = ref(25)
const setTitle = inject<(arg: string) => void>('setTitle')

onBeforeMount(() => {
  setTitle?.('Set Mood')
})

const recommendationsStore = useRecommendationsStore()
</script>

<template>
  <vRow>
    <vCol v-if="recommendationsStore.userSelectedSeed" cols="12">
      <span class="font-weight-black"
        >Based on {{ recommendationsStore.userSelectedSeed.itemType }}</span
      >
      <vCard elevation="4" rounded="lg">
        <vCardText class="pa-0">
          <vList class="bg-primary">
            <vListItem
              :title="recommendationsStore.userSelectedSeed.name"
              :subtitle="getSubtitle(recommendationsStore.userSelectedSeed)"
              :prepend-avatar="getImage(recommendationsStore.userSelectedSeed)"
            />
          </vList>
        </vCardText>
      </vCard>
    </vCol>
    <vCol cols="12">
      <h2>For the duration</h2>
      <h3>
        <strong class="text-h1">{{ minutes }}</strong> minutes
      </h3>
      <vSlider
        v-model="minutes"
        min="10"
        max="60"
        class="align-center"
        step="1"
        hide-details
      />
    </vCol>
    <vCol cols="12">
      <vList color="primary" rounded="lg" class="py-0" variant="text">
        <vListItem value="explore" height="100px">
          <template #title>
            <span class="font-weight-black">Explore new horizons</span>
          </template>
          <template #subtitle>
            <p class="mt-1">Get a list with things you never heard of</p>
          </template>
          <template #prepend="{ isSelected }">
            <vRadio :model-value="isSelected" />
          </template>
        </vListItem>
      </vList>
    </vCol>
    <vSheet position="fixed" location="bottom" width="100%" class="pa-4">
      <vBtn block to="/app/review">Mancer me</vBtn>
    </vSheet>
  </vRow>
</template>
