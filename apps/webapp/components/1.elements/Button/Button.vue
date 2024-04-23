<script setup lang="ts">
import './Button.scss'

defineProps<{
  title?: string
}>()
</script>

<template>
  <button class="spotify-button">
    <slot v-if="$slots['default']" />
    <template v-else>{{ title }}</template>
  </button>
</template>
