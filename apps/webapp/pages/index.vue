<script setup lang="ts">
import { VBtn } from 'vuetify/components/VBtn'

const authStore = useAuthStore()
const config = useRuntimeConfig()
const version = config.public.appVersion
async function handleLoginClick() {
  try {
    await authStore.authenticate()
  } catch (err) {
    console.log(err)
  }
}

definePageMeta({
  layout: 'start',
})
</script>

<template>
  <vRow align="end" justify="center" class="fill-height">
    <vCol cols="12">
      <vRow align="center" justify="center" no-gutters>
        <vCol cols="4" lg="2">
          <vImg src="/icon/newicon.svg" eager />
        </vCol>
        <vCol cols="12">
          <h1 class="text-center my-0">Melodimancer</h1>
          <small class="text-center d-block mb-10">v{{ version }}</small>
        </vCol>
      </vRow>
    </vCol>
    <vCol cols="12" md="6" lg="4">
      <VBtn
        class="font-weight-bold"
        align-self="end"
        text="Log in"
        block
        @click="handleLoginClick"
      />
    </vCol>
  </vRow>
</template>
