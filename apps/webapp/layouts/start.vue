<script setup>
provide('layout', 'start')
</script>

<template>
  <div class="page-container">
    <div class="top">
      <ModuleStartHeader />
    </div>
    <div class="main">
      <slot />
    </div>
    <div class="bottom">
      <ModuleFooter />
    </div>
  </div>
</template>