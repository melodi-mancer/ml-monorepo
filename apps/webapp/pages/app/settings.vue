<script setup lang="ts">
definePageMeta({
  layout: 'authenticated',
})
const appSettings = useAppSettingsStore()
const theme = useTheme()
</script>

<template>
  <vRow>
    <vCol cols="12">
      <vCard
        prepend-icon="mdi-theme-light-dark"
        density="compact"
        title="Dark mode"
        variant="tonal"
        color="primary"
      >
        <template #append>
          <vSwitch
            :model-value="appSettings.dark"
            color="primary"
            hide-details
            @click="appSettings.toggleTheme(theme)"
          />
        </template>
      </vCard>
    </vCol>
  </vRow>
</template>
