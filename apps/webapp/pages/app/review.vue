<script setup lang="ts">
import { track as mockTrack } from '~/mocks'
definePageMeta({
  layout: 'subpage',
})
const setTitle = inject<(arg: string) => void>('setTitle')

const tracks = Array.from({ length: 10 }, (_, i) => ({
  ...mockTrack,
  name: `${mockTrack.name} ${i + 1}`,
}))

onBeforeMount(() => {
  setTitle?.('Review')
})

const moodName = ref('')
</script>

<template>
  <vRow style="padding-bottom: 140px">
    <vList>
      <template v-for="track in tracks" :key="track.id">
        <vListItem
          :title="track.name"
          :subtitle="track.artists.map((artist) => artist.name).join(', ')"
          height="70px"
        >
          <template #prepend>
            <vAvatar tile size="x-large">
              <vImg :src="track.album?.images?.[0]?.url">
                <vRow
                  justify="center"
                  align="center"
                  no-gutters
                  class="fill-height"
                >
                  <vIcon
                    size="x-large"
                    class="ma-auto"
                    color="rgba(255,255,255,.8)"
                  >
                    mdi-play-circle-outline
                  </vIcon>
                </vRow>
              </vImg>
            </vAvatar>
          </template>
        </vListItem>
        <vDivider />
      </template>
    </vList>
  </vRow>
  <vSheet position="fixed" location="bottom" width="100%" class="pa-4">
    <vRow>
      <vCol cols="12">
        <vTextField
          v-model="moodName"
          placeholder="Name this playlist"
          variant="plain"
        />
      </vCol>
    </vRow>
    <vBtn block :to="`/app/playlist/${moodName}`" :disabled="!moodName">
      Save
    </vBtn>
  </vSheet>
</template>
