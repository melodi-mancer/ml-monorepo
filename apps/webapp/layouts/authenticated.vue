<script setup>
provide('layout', 'authenticated')
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
