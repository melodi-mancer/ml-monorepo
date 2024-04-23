<script setup lang="ts" generic="T extends Record<string, unknown>">
const { headers, data } = defineProps<{
  name: string
  data: T[]
  headers?: string[]
}>()

const getHeaders = computed(() => headers ?? Object.keys(data[0]))
</script>

<template>
  <table>
    <thead>
      <tr>
        <th v-for="header in getHeaders" :key="header">{{ header }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, i) in data" :key="`${name}-row-${i}`">
        <td
          v-for="(cellKey, index) in getHeaders"
          :key="`${name}-cell-${index}`"
        >
          {{ item[cellKey] }}
        </td>
      </tr>
    </tbody>
  </table>
</template>
