<script setup lang="ts">

import { getImage, getSubtitle } from '#build/imports'
const nuxt = useNuxtApp()
const recommendationsStore = useRecommendationsStore()
const appSettingsStore = useAppSettingsStore()

definePageMeta({
  layout: 'authenticated',
})

const isLoading = ref(false)
const items = ref<SeedItem[]>([])
const error = ref<string | null>(null)

const search = (search: string) => {
  if (!search) {
    items.value = []
    return
  }
  isLoading.value = true
  nuxt.$spotify
    .searchTracksAndArtists(search)
    .then((res) => {
      items.value = res
    })
    .finally(() => {
      isLoading.value = false
    })
}

const selectItem = (item: SeedItem | Array<SeedItem> | null) => {
  error.value = null
  try {
    recommendationsStore.updateSeed(item)
  } catch (e) {
    const err = e as Error
    error.value = err.message
  }
}

const confirmSelection = () => {
  navigateTo(buildAppUrl('/app/set-mood'))
}
</script>
<template>
  <vRow justify="center" align="center">
    <vCol cols="12" class="mb-12">
      <h2 class="text-center">What are you in the mood for today?</h2>
    </vCol>
    <vCol cols="12">
      <vAutocomplete
        placeholder="Search for a music or artist to start"
        variant="outlined"
        density="default"
        clear-on-select
        hide-no-data
        hide-details
        clearable
        return-object
        prepend-inner-icon="mdi-magnify"
        single-line
        chips
        :closable-chips="appSettingsStore.adminUi"
        item-value="id"
        item-title="name"
        :loading="isLoading"
        :items="items"
        :multiple="appSettingsStore.adminUi"
        :model-value="recommendationsStore.userSelectedSeed"
        :error="error === null ? undefined : true"
        :error-messages="error"
        @update:search="search"
        @update:model-value="(item) => selectItem(item)"
      >
        <template #chip="{ props, item }">
          <vChip
            v-bind="props"
            :prepend-avatar="getImage(item.raw)"
            :text="item.raw.name"
            :color="item.raw.type === 'track' ? undefined : 'primary'"
          />
        </template>

        <template #item="{ props, item }">
          <vListItem
            v-bind="props"
            :prepend-avatar="getImage(item.raw)"
            :subtitle="getSubtitle(item.raw)"
            :title="item.raw.name"
          />
        </template>
      </vAutocomplete>
    </vCol>
    <vCol cols="12">
      <vBtn
        text="Confirm"
        block
        :disabled="recommendationsStore.isSeedEmpty"
        @click="confirmSelection"
      />
    </vCol>
  </vRow>
</template>
