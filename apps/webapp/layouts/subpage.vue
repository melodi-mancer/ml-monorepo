<script setup>
import ModuleHeader from '~/components/2.modules/Header/Header.vue'
provide('layout', 'subpage')

const title = ref('')

const setTitle = (newTitle) => {
  title.value = newTitle
}

provide('title', title)
provide('setTitle', setTitle)

const goBack = () => {
  window.history.back()
}
</script>

<template>
  <vApp>
    <!-- Use ModuleHeader with back button and dynamic title -->
    <ModuleHeader
      :showBackButton="true"
      :pageTitle="title"
      @go-back="goBack"
    />
    
    <vMain>
      <vContainer>
        <slot />
      </vContainer>
    </vMain>
  </vApp>
</template>
