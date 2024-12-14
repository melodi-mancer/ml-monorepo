<script setup lang="ts">
import { track as mockTrack } from '~/mocks'
definePageMeta({
  layout: 'authenticated',
})
</script>

<template>
  <vRow>
    <vCol v-for="i in 10" :key="i + 'playlist'" cols="12">
      <vCard
        :to="`/app/playlist/playlist-${i}`"
        title="playlist"
        subtitle="31 minutes"
        color="primary"
      >
        <template #append>
          <vChip
            :append-avatar="mockTrack.album?.images?.[0]?.url"
            :text="mockTrack.name"
          />
        </template>
      </vCard>
    </vCol>
  </vRow>
</template>
