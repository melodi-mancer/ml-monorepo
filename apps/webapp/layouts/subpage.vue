<script setup>
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
  <vAppBar app :elevation="0">
    <template #prepend>
      <vBtn icon @click="goBack">
        <vIcon> mdi-arrow-left </vIcon>
      </vBtn>
      <vAppBarTitle v-if="title">{{ title }}</vAppBarTitle>
    </template>
  </vAppBar>
  <vMain>
    <vContainer>
      <slot />
    </vContainer>
  </vMain>
</template>
