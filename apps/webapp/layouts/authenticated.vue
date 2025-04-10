<script setup>
import ModuleHeader from '~/components/2.modules/Header/Header.vue'
const appSettingsStore = useAppSettingsStore()
const auth = useAuthStore()
provide('layout', 'authenticated')

const drawer = ref(false)
const toggleDrawer = () => (drawer.value = !drawer.value)
</script>
<template>
  <vApp>
    <!-- Navigation drawer with existing functionality -->
    <vNavigationDrawer v-model="drawer" temporary color="primary">
      <vListItem
        prepend-avatar="/icon/newicon.svg"
        title="Melodimancer"
        subtitle="v0.0.0"
        class="py-4"
      />

      <vDivider />

      <vList density="compact" nav>
        <vListItem to="/app/profile" title="Profile" value="profile" />
        <vListItem title="About" value="about" />
        <vListItem title="Terms of use" value="terms-of-use" />
        <vListItem title="Privacy Settings" value="privacy" />
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

    <vBottomNavigation grow mandatory color="primary">
      <vBtn to="/app/playlist" value="recent">
        <vIcon>mdi-view-list</vIcon>

        <span>Playlists</span>
      </vBtn>

      <vBtn to="/app" value="favorites">
        <vIcon>mdi-magnify</vIcon>

        <span>Search</span>
      </vBtn>

      <vBtn to="/app/settings" value="nearby">
        <vIcon>mdi-cog</vIcon>

        <span>Settings</span>
      </vBtn>
    </vBottomNavigation>
  </vApp>
</template>
