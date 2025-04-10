<script setup lang="ts">
import { getImage, getSubtitle } from '#build/imports'
const recommendationsStore = useRecommendationsStore()

definePageMeta({
  layout: 'subpage',
})
const minutes = ref(25)
const setTitle = inject<(arg: string) => void>('setTitle')
const seedType = ref('track')
const tracks = ref<Array<string>>([...recommendationsStore.tracksIds])
const artists = ref<Array<string>>([...recommendationsStore.artistsIds])
const genres = ref<Array<string>>([...recommendationsStore.genres])
const threshold = ref(0)

onBeforeMount(() => {
 // setTitle?.('Set Mood')
})
</script>

<template>
  <vRow class="pb-14">
    <ElIsAdmin>
      <template #fallback>
        <vCol
          v-if="
            recommendationsStore.userSelectedSeed &&
            !Array.isArray(recommendationsStore.userSelectedSeed)
          "
          cols="12"
        >
          <span class="font-weight-black"
            >Based on {{ recommendationsStore.userSelectedSeed.type }}</span
          >
          <vCard elevation="4" rounded="lg">
            <vCardText class="pa-0">
              <vList class="bg-primary">
                <vListItem
                  :title="recommendationsStore.userSelectedSeed.name"
                  :subtitle="getSubtitle(recommendationsStore.userSelectedSeed)"
                  :prepend-avatar="
                    getImage(recommendationsStore.userSelectedSeed)
                  "
                />
              </vList>
            </vCardText>
          </vCard>
        </vCol>
      </template>
      <vCol cols="12">
        <span class="font-weight-black">Based on {{ seedType }}</span>
        <vExpansionPanels v-model="seedType" variant="accordion" mandatory>
          <vExpansionPanel
            value="track"
            :color="seedType === 'track' ? 'primary' : undefined"
          >
            <vExpansionPanelTitle>
              Tracks
              <template #actions>
                <vRadio :model-value="seedType === 'track'" />
              </template>
            </vExpansionPanelTitle>
            <vExpansionPanelText class="no-iner-padding">
              <vRow no-gutters>
                <vCol cols="12">
                  <vList density="compact" class="pa-0" multiple>
                    <vListItem
                      v-for="track in recommendationsStore.tracksSeeds"
                      :key="track.id"
                      class="pa-0"
                      :title="track.name"
                      :subtitle="`${track.album.name} - ${track.artists
                        .map((artist) => artist.name)
                        .join(', ')}`"
                      @click="
                        tracks.includes(track.id)
                          ? tracks.splice(tracks.indexOf(track.id), 1)
                          : tracks.push(track.id)
                      "
                    >
                      <template #prepend>
                        <vCheckbox
                          :model-value="tracks.includes(track.id)"
                          hide-details
                        />
                      </template>
                    </vListItem>
                  </vList>
                </vCol>
              </vRow>
            </vExpansionPanelText>
          </vExpansionPanel>
          <vExpansionPanel
            value="artist"
            :color="seedType === 'artist' ? 'primary' : undefined"
          >
            <vExpansionPanelTitle>
              Artists
              <template #actions>
                <vRadio :model-value="seedType === 'artist'" />
              </template>
            </vExpansionPanelTitle>
            <vExpansionPanelText class="no-iner-padding">
              <vRow no-gutters>
                <vCol cols="12">
                  <vList density="compact" class="pa-0">
                    <vListItem
                      v-for="artist in recommendationsStore.artistsSeeds"
                      :key="artist.id"
                      :title="artist.name"
                      :subtitle="artist.genres.join(', ')"
                      class="pa-0"
                      @click="
                        artists.includes(artist.id)
                          ? artists.splice(artists.indexOf(artist.id), 1)
                          : artists.push(artist.id)
                      "
                    >
                      <template #prepend>
                        <vCheckbox
                          :model-value="artists.includes(artist.id)"
                          hide-details
                        />
                      </template>
                    </vListItem>
                  </vList>
                </vCol>
              </vRow>
            </vExpansionPanelText>
          </vExpansionPanel>
          <vExpansionPanel
            value="genre"
            :color="seedType === 'genre' ? 'primary' : undefined"
          >
            <vExpansionPanelTitle>
              Genres
              <template #actions>
                <vRadio :model-value="seedType === 'genre'" />
              </template>
            </vExpansionPanelTitle>
            <vExpansionPanelText class="no-iner-padding">
              <vRow no-gutters>
                <vCol cols="12">
                  <vList density="compact" class="pa-0">
                    <vListItem
                      v-for="genre in recommendationsStore.genres"
                      :key="genre"
                      :title="genre"
                      class="pa-0"
                      @click="
                        genres.includes(genre)
                          ? genres.splice(genres.indexOf(genre), 1)
                          : genres.push(genre)
                      "
                    >
                      <template #prepend>
                        <vCheckbox
                          :model-value="genres.includes(genre)"
                          hide-details
                        />
                      </template>
                    </vListItem>
                  </vList>
                </vCol>
              </vRow>
            </vExpansionPanelText>
          </vExpansionPanel>
        </vExpansionPanels>
      </vCol>
    </ElIsAdmin>
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
    <vCol cols="12" class="mb-6">
      <ElIsAdmin>
        <template #fallback>
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
        </template>
        <vSelect
          label="Choose factor"
          variant="outlined"
          density="default"
          mandatory
          :items="['RC1', 'RC2', 'RC3']"
        />
        <vSelect
          label="Choose filter"
          variant="outlined"
          density="default"
          mandatory
          :items="['default', 'onlyNew', 'trackAnalisys']"
        />
        <vSlider v-model="threshold" label="Threshold" min="0" max="1">
          <template #append>
            {{ threshold.toFixed(2) }}
          </template>
        </vSlider>
      </ElIsAdmin>
    </vCol>
    <vSheet position="fixed" location="bottom" width="100%" class="pa-4">
      <vBtn block to="/app/review">Mancer me</vBtn>
    </vSheet>
  </vRow>
</template>
