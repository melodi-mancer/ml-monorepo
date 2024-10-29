<script setup lang="ts">
const authStore = useAuthStore()
async function handleLoginClick() {
  try {
    await authStore.authenticate()
  } catch (err) {
    console.log(err)
  }
}

definePageMeta({
  layout: 'start',
})
</script>

<template>
  <div class="page-container">
    <div class="mainStart">
      <ElButton title="Log in" @click.native="handleLoginClick" />
    </div>
  </div>
</template>
