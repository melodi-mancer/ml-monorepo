<script setup lang="ts">
const userDataStore = useUserDataStore()
const appSettings = useAppSettingsStore()
const props = defineProps<{
  adminType?: 'ui' | 'permission'
}>()

const isAdmin = computed(() => {
  if (props.adminType === 'ui') {
    return appSettings.adminUi
  }

  if (props.adminType === 'permission') {
    return userDataStore.isAdmin
  }

  return appSettings.adminUi && userDataStore.isAdmin
})
</script>

<template>
  <slot v-if="isAdmin" />
  <slot v-else name="fallback" />
</template>
