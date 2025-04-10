<script setup>
import ModuleHeader from '~/components/2.modules/Header/Header.vue'
provide('layout', 'start')
</script>

<template>
  <vApp>    
    <!-- Main content area -->
    <vMain>
      <vContainer height="100%">
        <slot />
      </vContainer>
    </vMain>
  </vApp>
</template>
