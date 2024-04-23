<script setup lang="ts">
const authStore = useAuthStore()
async function handleLoginClick() {
  try {
    await authStore.authenticate()
  } catch (err) {
    console.log(err)
  }
}
</script>

<template>
  <div class="page-container">
    <div class="main">
      <ElButton title="Log in" @click.native="handleLoginClick" />
    </div>
  </div>
</template>
