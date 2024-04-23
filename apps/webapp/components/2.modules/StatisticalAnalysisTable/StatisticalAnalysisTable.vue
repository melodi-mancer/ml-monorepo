<script setup lang="ts">
import type { TrackAnalysisRow, TrackAnalysisColumns } from '~/utils/CfaClient'

defineProps<{
  name: string
  data: Array<TrackAnalysisRow>
}>()
const headers: Array<TrackAnalysisColumns | '_row'> = [
  ...trackAnalysisOptions,
  '_row',
]
</script>

<template>
  <ElTable :name="name" :headers="headers" :data="data" />
</template>
