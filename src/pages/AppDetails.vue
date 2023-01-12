<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'

import ArcanaLogo from '@/assets/iconography/arcana-dark-vertical.svg'
import ConfigureMobileMenu from '@/components/app-configure/ConfigureMobileMenu.vue'
import ConfigureSidebar from '@/components/app-configure/ConfigureSidebar.vue'
import AppFooter from '@/components/AppFooter.vue'
import VButton from '@/components/lib/VButton/VButton.vue'
import VCard from '@/components/lib/VCard/VCard.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import { useAppsStore } from '@/stores/apps.store'
import { useLoaderStore } from '@/stores/loader.store'
import useArcanaAuth from '@/use/arcanaAuth'
import { useAppId } from '@/use/getAppId'
import { HelpItems, ProfileItems } from '@/utils/constants'
import { createTransactionSigner } from '@/utils/signerUtils'

const appsStore = useAppsStore()
const loaderStore = useLoaderStore()
const currentTab = ref('Dashboard')
const router = useRouter()
const appId = useAppId()
const showHelpMenu = ref(false)
const showProfileMenu = ref(false)
const showMobileMenu = ref(false)
const { logout } = useArcanaAuth()

function switchTab(tab: string) {
  showMobileMenu.value = false
  currentTab.value = tab
  router.push({
    params: { appId },
    name: tab,
  })
}

onBeforeMount(async () => {
  const appId = useAppId()
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
</script>

<template>
  <VStack direction="row" class="app-details__container">
    <div class="app-details__sidebar mobile-remove">
      <ConfigureSidebar :current-tab="currentTab" @switch-tab="switchTab" />
    </div>
    <VStack direction="column" class="app-details__content">
      <VStack justify="space-between">
        <div class="logo tablet-remove laptop-remove" @click.stop="onLogoClick">
          <img :src="ArcanaLogo" alt="Arcana Logo" />
        </div>
        <VStack class="justify-end help-button__container flex-grow">
          <div class="position-relative flex">
            <button
              class="help-button"
              @click.stop="showHelpMenu = !showHelpMenu"
            >
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
            <button
              class="help-button"
              @click.stop="showMobileMenu = !showMobileMenu"
            >
              <img src="@/assets/iconography/menu.svg" alt="menu icon" />
            </button>
          </div>
          <div class="position-relative flex">
            <img
              src="@/assets/iconography/profile.svg"
              class="cursor-pointer"
              @click.stop="showProfileMenu = !showProfileMenu"
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
                    :to="{ name: profileItem.label }"
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
        <RouterView />
        <AppFooter class="footer-bleed" />
      </VStack>
    </VStack>
    <ConfigureMobileMenu
      :show-mobile-menu="showMobileMenu"
      @close="showMobileMenu = false"
    >
      <ConfigureSidebar :current-tab="currentTab" @switch-tab="switchTab" />
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
</style>
