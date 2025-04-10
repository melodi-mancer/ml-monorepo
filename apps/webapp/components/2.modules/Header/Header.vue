<script setup lang="ts">
import './Header.scss'

// Props for customizing header functionality
const props = defineProps({
  showBackButton: {
    type: Boolean,
    default: false
  },
  showDrawerToggle: {
    type: Boolean,
    default: false
  },
  showLogoutButton: {
    type: Boolean,
    default: true
  },
  pageTitle: {
    type: String,
    default: ''
  }
})

// Emit events for parent components to handle
const emit = defineEmits(['toggle-drawer', 'go-back'])

const config = useRuntimeConfig()
const authStore = useAuthStore()

const version = config.public.appVersion

async function handleLogoutClick() {
  try {
    await authStore.logOut()
  } catch (err) {
    console.log(err)
  }
}

function handleToggleDrawer() {
  emit('toggle-drawer')
}

function handleGoBack() {
  emit('go-back')
}
</script>

<template>
  <vAppBar app :elevation="0">
    <!-- Left side navigation elements (back button OR drawer toggle) -->
    <template #prepend>
      <!-- Drawer toggle button for authenticated layout -->
      <vAppBarNavIcon 
        v-if="showDrawerToggle" 
        @click="handleToggleDrawer" 
      />
      
      <!-- Back button for subpage layout -->
      <vBtn 
        v-if="showBackButton" 
        icon 
        @click="handleGoBack"
      >
        <vIcon>mdi-arrow-left</vIcon>
      </vBtn>
      
      <!-- Use the title from props if available -->
      <vAppBarTitle v-if="pageTitle">{{ pageTitle }}</vAppBarTitle>
      
      <!-- Use the default title with logo if no specific title is provided -->
      <div v-else class="d-flex align-center">
        <div class="logo me-2"></div>
        <h1 class="text-h6 mb-0">Melodimancer</h1>
      </div>
    </template>
    
    <!-- Default slot for any additional content -->
    <slot></slot>
    
    <!-- Right side elements (version and logout) -->
    <template #append>
      <div class="d-flex align-center">
        <span class="text-caption me-4">v{{ version }}</span>
        <vBtn 
          v-if="showLogoutButton"
          icon
          @click="handleLogoutClick"
          title="Log out"
        >
          <vIcon>mdi-logout</vIcon>
        </vBtn>
      </div>
    </template>
  </vAppBar>
</template>
