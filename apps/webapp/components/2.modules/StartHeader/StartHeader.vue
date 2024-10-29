<script setup lang="ts">
import './StartHeader.scss'

const config = useRuntimeConfig()
const authStore = useAuthStore()

const version = config.public.appVersion
</script>

<template>
  <div class="header">
    <div class="title">
      <div class="logo"></div>
      <h1>Melodimancer</h1>
    </div>
    <div class="secondary">
      <small>v{{ version }}</small>
    </div>
  </div>
</template>
