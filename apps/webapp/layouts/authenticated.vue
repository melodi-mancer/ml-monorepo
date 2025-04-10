<script setup>
import ModuleHeader from '~/components/2.modules/Header/Header.vue'
const appSettingsStore = useAppSettingsStore()
const auth = useAuthStore()
const theme = useTheme()
provide('layout', 'authenticated')

const drawer = ref(false)
const toggleDrawer = () => (drawer.value = !drawer.value)
const config = useRuntimeConfig()

</script>
<template>

  <vApp>
    <!-- Navigation drawer with existing functionality -->
    <vNavigationDrawer v-model="drawer" temporary color="primary">
      <vListItem
        prepend-avatar="/icon/newicon.svg"
        title="Melodimancer"
        :subtitle="`v${config.public.appVersion}`"
        class="py-4"
      />

      <vDivider />

      <vList density="compact" nav>
        <!-- Appearance section: Dark Mode -->
        <vListItem value="dark-mode">
          <template #prepend>
            <vIcon>mdi-theme-light-dark</vIcon>
          </template>
          <vListItemTitle>Dark Mode</vListItemTitle>
          <template #append>
            <vSwitch
              :model-value="appSettingsStore.dark"
              color="primary"
              hide-details
              density="compact"
              @click="appSettingsStore.toggleTheme(theme)"
            />
          </template>
        </vListItem>
        <!-- Information section: About and Legal -->
        <vListItem 
          prepend-icon="mdi-information-outline" 
          title="About" 
          value="about" 
        />
        <vListItem 
          prepend-icon="mdi-file-document-outline" 
          title="Terms of use" 
          value="terms-of-use" 
        />
        <vListItem 
          prepend-icon="mdi-shield-account-outline" 
          title="Privacy Settings" 
          value="privacy" 
        />
      </vList>
      
      <template #append>
        <ElIsAdmin admin-type="permission">
          <vList density="compact">
            <vListItem
              prepend-avatar="/icon/newicon.svg"
              title="App"
              value="app"
              :variant="!appSettingsStore.adminUi ? 'flat' : 'plain'"
              :disabled="!appSettingsStore.adminUi"
              @click="appSettingsStore.setAdminUi(false)"
            >
              <template #append>
                <vRadio :model-value="!appSettingsStore.adminUi" />
              </template>
            </vListItem>
            <vListItem
              prepend-icon="mdi-cogs"
              title="Admin"
              value="admin"
              :variant="appSettingsStore.adminUi ? 'flat' : 'plain'"
              :disabled="appSettingsStore.adminUi"
              @click="appSettingsStore.setAdminUi(true)"
            >
              <template #append>
                <vRadio :model-value="appSettingsStore.adminUi" />
              </template>
            </vListItem>
          </vList>
          <vDivider />
        </ElIsAdmin>
        <vList density="comfortable">
          <vListItem
            prepend-icon="mdi-power"
            title="Logout"
            value="logout"
            @click="auth.logOut()"
          />
        </vList>
      </template>
    </vNavigationDrawer>

    <!-- Replace vAppBar with ModuleHeader -->
    <ModuleHeader 
      :showDrawerToggle="true" 
      @toggle-drawer="toggleDrawer" 
    />

    <vMain>
      <vContainer height="100%">
        <slot />
      </vContainer>
    </vMain>
  </vApp>
</template>
