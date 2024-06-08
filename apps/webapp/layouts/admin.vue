<script setup>
provide('layout', 'admin')
</script>

<template>
  <div class="page-container">
    <div class="top">
      <ModuleHeader />
    </div>
    <div class="main">
      <slot />
    </div>
    <div class="bottom">
      <ModuleFooter />
    </div>
  </div>
</template>
