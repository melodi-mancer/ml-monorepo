<script setup lang="ts">
definePageMeta({
  layout: 'start',
})
onBeforeMount(async () => {
  const authStore = useAuthStore()
  await authStore.authenticate()
})
</script>

<template>
  <vRow align="center" justify="center" class="fill-height">
    <vCol cols="6" lg="4">
      <vImg src="/icon/newicon.svg" eager />
    </vCol>
  </vRow>
</template>
