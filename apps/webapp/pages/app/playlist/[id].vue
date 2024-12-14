<script setup lang="ts">
import { track as mockTrack } from '~/mocks'
definePageMeta({
  layout: 'authenticated',
})

const tracks = Array.from({ length: 10 }, (_, i) => ({
  ...mockTrack,
  name: `${mockTrack.name} ${i + 1}`,
}))
</script>

<template>
  <vRow>
    <vCol cols="12">
      <h2>
        {{ $route.params.id }}
      </h2>
    </vCol>
    <vCol cols="12">
      <p>duration: <strong>31 minutes</strong></p>
      <p>based on track: <strong>Boy Besta</strong></p>
    </vCol>
    <vDivider />
    <vCol v-for="track in tracks" :key="track.id" cols="12">
      <vCard
        :title="track.name"
        :subtitle="track.artists.map((artist) => artist.name).join(', ')"
        color="primary"
      >
        <template #prepend>
          <vAvatar tile :image="track.album?.images?.[0]?.url" />
        </template>
        <template #append>
          <vIcon>mdi-play-circle-outline</vIcon>
        </template>
        <vCardActions class="bg-white">
          <vRating />
        </vCardActions>
      </vCard>
    </vCol>
  </vRow>
</template>
