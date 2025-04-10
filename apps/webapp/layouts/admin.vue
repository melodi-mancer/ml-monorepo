<script setup>
import ModuleHeader from '~/components/2.modules/Header/Header.vue'
provide('layout', 'admin')
</script>

<template>
  <vApp>
    <!-- Use the same ModuleHeader component with appropriate props for admin layout -->
    <ModuleHeader />
    
    <!-- Main content area with admin-specific structure -->
    <vMain>
      <div class="page-container">
        <div class="main">
          <slot />
        </div>
        <div class="bottom">
          <ModuleFooter />
        </div>
      </div>
    </vMain>
  </vApp>
</template>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.main {
  flex: 1;
  padding: 16px;
}

.bottom {
  padding: 16px;
}
</style>
