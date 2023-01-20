<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import ArcanaLogo from '@/assets/iconography/arcana-dark-vertical.svg'
import ConfigureMobileMenu from '@/components/app-configure/ConfigureMobileMenu.vue'
import ConfigureSidebar from '@/components/app-configure/ConfigureSidebar.vue'
import AppFooter from '@/components/AppFooter.vue'
import VButton from '@/components/lib/VButton/VButton.vue'
import VCard from '@/components/lib/VCard/VCard.vue'
import VDropdown from '@/components/lib/VDropdown/VDropdown.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import { useAppsStore, type AppId } from '@/stores/apps.store'
import { useLoaderStore } from '@/stores/loader.store'
import useArcanaAuth from '@/use/arcanaAuth'
import { useClickOutside } from '@/use/clickOutside'
import { HelpItems, ProfileItems } from '@/utils/constants'
import { createTransactionSigner } from '@/utils/signerUtils'

const NetworkOptions = [
  {
    label: 'Mainnet',
    value: 'mainnet',
  },
  {
    label: 'Testnet',
    value: 'testnet',
  },
]

const appsStore = useAppsStore()
const loaderStore = useLoaderStore()
const currentTab = ref('Dashboard')
const router = useRouter()
const showHelpMenu = ref(false)
const showProfileMenu = ref(false)
const showMobileMenu = ref(false)
const profile_menu = ref(null)
const help_menu = ref(null)
const mobile_menu = ref(null)
const { logout } = useArcanaAuth()
const route = useRoute()
const currentNetwork = ref(NetworkOptions[1])

useClickOutside(profile_menu, () => {
  showProfileMenu.value = false
})

useClickOutside(help_menu, () => {
  showHelpMenu.value = false
})

function switchApp(selectedAppId: AppId) {
  showMobileMenu.value = false
  currentTab.value = 'Dashboard'
  router.push({
    params: { appId: selectedAppId },
    name: 'Dashboard',
  })
}

function switchTab(tab: string) {
  showMobileMenu.value = false
  currentTab.value = tab
  router.push({
    params: { appId: route.params.appId },
    name: tab,
  })
}

onBeforeMount(async () => {
  const appId = Number(route.params.appId)
  loaderStore.showLoader('Fetching app config')
  await appsStore.fetchAndStoreAppConfig(appId)
  const address = appsStore.app(appId).address
  createTransactionSigner(address)
  loaderStore.hideLoader()
})

async function onLogout() {
  await logout()
  localStorage.clear()
  router.push({ name: 'Login' })
  window.location.reload()
}

function toggleProfileMenu() {
  showProfileMenu.value = !showProfileMenu.value
  showHelpMenu.value = false
  showMobileMenu.value = false
}

function toggleHelpMenu() {
  showProfileMenu.value = false
  showHelpMenu.value = !showHelpMenu.value
  showMobileMenu.value = false
}

function toggleMobileMenu() {
  showProfileMenu.value = false
  showHelpMenu.value = false
  showMobileMenu.value = !showMobileMenu.value
}
</script>

<template>
  <VStack direction="row" class="app-details__container">
    <div class="app-details__sidebar mobile-remove">
      <ConfigureSidebar
        :current-tab="currentTab"
        @switch-tab="switchTab"
        @switch-app="switchApp"
      />
    </div>
    <VStack direction="column" class="app-details__content">
      <VStack justify="space-between">
        <div
          class="logo tablet-remove laptop-remove"
          @click.stop="router.push({ name: 'ManageApps' })"
        >
          <img :src="ArcanaLogo" alt="Arcana Logo" />
        </div>
        <VStack class="justify-end help-button__container flex-grow">
          <div id="help_menu" ref="help_menu" class="position-relative flex">
            <button class="help-button" @click.stop="toggleHelpMenu">
              Help
            </button>
            <VCard
              v-if="showHelpMenu"
              class="help-menu-items position-absolute"
            >
              <ul style="margin: 0">
                <li
                  v-for="helpItem in HelpItems"
                  :key="helpItem.label"
                  class="cursor-pointer help-menu-item"
                  @click.stop="showHelpMenu = false"
                >
                  <a
                    :href="helpItem.link"
                    class="flex"
                    style="gap: 0.75rem"
                    target="_blank"
                  >
                    <img :src="helpItem.icon" />
                    <span>{{ helpItem.label }} </span></a
                  >
                </li>
              </ul>
            </VCard>
          </div>
          <div class="tablet-remove laptop-remove">
            <button class="help-button" @click.stop="toggleMobileMenu">
              <img src="@/assets/iconography/menu.svg" alt="menu icon" />
            </button>
          </div>
          <div
            id="profile_menu"
            ref="profile_menu"
            class="position-relative flex"
          >
            <img
              src="@/assets/iconography/profile.svg"
              class="cursor-pointer"
              @click.stop="toggleProfileMenu"
            />
            <VCard
              v-if="showProfileMenu"
              class="help-menu-items position-absolute"
            >
              <ul style="margin: 0">
                <li
                  v-for="profileItem in ProfileItems"
                  :key="profileItem.label"
                  class="cursor-pointer help-menu-item"
                  @click.stop="showProfileMenu = false"
                >
                  <RouterLink
                    :to="{ name: `App${profileItem.label}` }"
                    class="flex"
                    style="gap: 0.75rem"
                    ><img :src="profileItem.icon" />
                    <span>{{ profileItem.label }} </span></RouterLink
                  >
                </li>
                <li
                  class="cursor-pointer help-menu-item"
                  style="margin-top: 1.5rem"
                >
                  <VButton
                    label="LOGOUT"
                    variant="secondary"
                    @click.stop="onLogout"
                  />
                </li>
              </ul>
            </VCard>
          </div>
        </VStack>
      </VStack>
      <VStack direction="column" gap="2rem" class="flex-grow">
        <VDropdown
          v-model="currentNetwork"
          :options="NetworkOptions"
          display-field="label"
          class="app-details__network-dropdown"
        />
        <RouterView />
        <AppFooter class="footer-bleed" />
      </VStack>
    </VStack>
    <ConfigureMobileMenu
      ref="mobile_menu"
      :show-mobile-menu="showMobileMenu"
      @close="showMobileMenu = false"
    >
      <ConfigureSidebar
        :current-tab="currentTab"
        @switch-tab="switchTab"
        @switch-app="switchApp"
      />
    </ConfigureMobileMenu>
  </VStack>
</template>

<style scoped>
.app-details__container {
  display: flex;
  width: 100%;
  height: 100vh;
  margin: 0;
  overflow: hidden;
}

.app-details__content {
  box-sizing: border-box;
  flex: 1;
  height: 100%;
  padding: 2rem;
  padding-bottom: 0;
  overflow-x: hidden;
  overflow-y: auto;
}

.footer-bleed {
  margin-inline: -2rem;
}

.help-button__container {
  gap: 1rem;
  margin-bottom: 2rem;
}

@media only screen and (max-width: 1023px) {
  .help-button__container {
    gap: 0.5rem;
  }
}

.help-button {
  padding: 0;
  font-family: var(--font-body);
  color: var(--primary);
  cursor: pointer;
  background: transparent;
  border: none;
  outline: none;
}

.help-menu-items {
  top: calc(100% + 0.75rem);
  right: 0;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  padding-top: 1.25rem;
  box-shadow: -4px -5px 4px rgb(0 0 0 / 20%), 4px 5px 4px rgb(0 0 0 / 20%) !important;
}

.help-menu-items ul {
  padding: 0;
}

.help-menu-item {
  width: 100%;
  padding-inline: 1.25rem;
  padding-bottom: 1.25rem;
  font-family: var(--font-body);
  color: var(--text-white);
  white-space: nowrap;
  list-style: none;
}

.help-menu-items a {
  color: white;
  text-decoration: none;
}

.logo {
  cursor: pointer;
  transition: opacity 0.3s;
}

.app-details__network-dropdown {
  align-self: flex-end;
  width: 16rem;
}
</style>
