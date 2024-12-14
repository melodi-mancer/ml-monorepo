<script setup lang="ts">
import { getImage, getSubtitle } from '#build/imports'
const nuxt = useNuxtApp()
const recommendationsStore = useRecommendationsStore()
const appSettingsStore = useAppSettingsStore()
definePageMeta({
  layout: 'authenticated',
})

const isLoading = ref(false)
const items = ref<SearchItem[]>([])

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

const selectItem = (item: SearchItem) => {
  if (appSettingsStore.adminUi) {
    recommendationsStore.getSeedPayload(item)
  } else {
    recommendationsStore.setUserSelectedSeed(item)
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
        item-value="id"
        item-title="name"
        :loading="isLoading"
        :items="items"
        :multiple="appSettingsStore.adminUi"
        :model-value="recommendationsStore.userSelectedSeed"
        @update:search="search"
        @update:model-value="selectItem"
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
    <ElIsAdmin>
      <vCol cols="12">
        <vCombobox
          placeholder="Try out some genres"
          variant="outlined"
          hide-details
          density="default"
          multiple
          chips
          :items="['pop', 'rock', 'hip-hop', 'jazz', 'classical']"
        />
      </vCol>
    </ElIsAdmin>
    <vCol cols="12">
      <vBtn
        text="Confirm"
        block
        :disabled="!recommendationsStore.userSelectedSeed"
        @click="confirmSelection"
      />
    </vCol>
  </vRow>
</template>
