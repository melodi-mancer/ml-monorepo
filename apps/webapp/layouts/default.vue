<script setup>
import ModuleHeader from '~/components/2.modules/Header/Header.vue'
provide('layout', 'default')
</script>

<template>
  <vApp>
    <!-- Include the Header component -->
    <ModuleHeader />
    
    <!-- Main content area -->
    <vMain>
      <vContainer>
        <slot />
      </vContainer>
    </vMain>
  </vApp>
</template>
