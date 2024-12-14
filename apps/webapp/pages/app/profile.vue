<script setup lang="ts">
definePageMeta({
  layout: 'authenticated',
})
const userData = useUserDataStore()
</script>

<template>
  <vRow>
    <vCol cols="12">
      <vRow justify="center">
        <vAvatar size="120" :image="userData.userImage" />
      </vRow>
    </vCol>
    <vCol cols="12">
      <h2 class="text-center mb-4">{{ userData.userName }}</h2>
    </vCol>
    <vDivider />
    <vCol cols="12">
      <vList class="pa-0">
        <vListItem title="Top tracks" append-icon="mdi-chevron-right" />
      </vList>
    </vCol>
    <vDivider />
    <vCol cols="12">
      <vList class="pa-0">
        <vListItem title="Top artists" append-icon="mdi-chevron-right" />
      </vList>
    </vCol>
    <vDivider />
    <vCol cols="12">
      <vList class="pa-0">
        <vListItem title="My mancer" append-icon="mdi-chevron-right" />
      </vList>
    </vCol>
  </vRow>
</template>
