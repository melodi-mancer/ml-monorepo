<script setup lang="ts">
definePageMeta({
  layout: 'authenticated',
})  
</script>

<template>
  <vRow>
    <vCol cols="12">
      <h1 class="text-center mb-4">Privacy</h1>
    </vCol>
    <vCol cols="12">
      <vList class="pa-0">
        <vListItem title="No tracking cookies here" subtitle="Not even the digital kind. We don’t track a crumb." prepend-icon="mdi-cookie" />
      </vList>
    </vCol>
    <vCol cols="12">
      <vList class="pa-0">
        <vListItem title="Privacy first" subtitle="Your activity stays private. We don’t collect or store personal data." prepend-icon="mdi-incognito" />
      </vList>
    </vCol>
    <vCol cols="12">
      <vList class="pa-0">
        <vListItem title="Browse in peace" subtitle="No ads, no profiling, no third parties watching you." prepend-icon="mdi-hand-peace" />
      </vList>
    </vCol>
  </vRow>
</template>
