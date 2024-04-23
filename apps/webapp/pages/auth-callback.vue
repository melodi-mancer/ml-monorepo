<script setup lang="ts">
onBeforeMount(async () => {
  const authStore = useAuthStore()
  await authStore.authenticate()
})
</script>

<template>
  <div>Authenticating...</div>
</template>
