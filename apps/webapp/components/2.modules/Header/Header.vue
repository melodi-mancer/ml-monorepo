<script setup lang="ts">
import './Header.scss'

const config = useRuntimeConfig()
const authStore = useAuthStore()

const version = config.public.appVersion
async function handleLogoutClick() {
  try {
    await authStore.logOut()
  } catch (err) {
    console.log(err)
  }
}
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
    <div class="logout">
      <ElButton title="Log out" @click="handleLogoutClick" />
    </div>
  </div>
</template>
