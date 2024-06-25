<script lang="ts" setup>
import { onBeforeMount, ref, watch, onMounted, type Ref, computed } from 'vue'
import { useRouter, useRoute, RouterView } from 'vue-router'

import ConfigureMobileMenu from '@/components/app-configure/ConfigureMobileMenu.vue'
import ConfigureSidebar from '@/components/app-configure/ConfigureSidebar.vue'
import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import VDropdownSecondary from '@/components/lib/VDropdownSecondary/VDropdownSecondary.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import { useToast } from '@/components/lib/VToast'
import MainnetAppCreatedPopup from '@/components/MainnetAppCreatedPopup.vue'
import SwitchToMainnetConfirmation from '@/components/SwitchToMainnetConfirmation.vue'
import {
  createApp,
  fetchApp,
  updateApp,
  updateAppLogos,
  type AppConfig as AppResponse,
} from '@/services/gateway.service'
import { useAppsStore, type AppId, type AppConfig } from '@/stores/apps.store'
import { useChainManagementStore } from '@/stores/chainManagement.store'
import { useLoaderStore } from '@/stores/loader.store'
import useArcanaAuth from '@/use/arcanaAuth'
import { useClickOutside } from '@/use/clickOutside'
import {
  type Network,
  regions,
  RegionMapping,
  NetworkName,
  isProductionDashboard,
} from '@/utils/constants'
import { content, errors } from '@/utils/content'
import { createAppConfig } from '@/utils/createAppConfig'
import { createTransactionSigner } from '@/utils/signerUtils'

const NetworkOptions = [
  {
    label: NetworkName.testnet,
    value: 'testnet',
  },
  {
    label: NetworkName.mainnet,
    value: 'mainnet',
  },
]

const selectedAppId = computed(() => Number(route.params.appId))
const appsStore = useAppsStore()
const loaderStore = useLoaderStore()
const chainManagementStore = useChainManagementStore()
const currentTab = ref('Dashboard')
const router = useRouter()
const showHelpMenu = ref(false)
const showProfileMenu = ref(false)
const showMobileMenu = ref(false)
const showNotifications = ref(false)
const profile_menu = ref(null)
const help_menu = ref(null)
const mobile_menu = ref(null)
const notification_menu = ref(null)
const { logout } = useArcanaAuth()
const route = useRoute()
const currentNetwork = ref(NetworkOptions[1])
const selectedRegion = ref(regions[0])
const showMainnetConfirmation = ref(false)
const toast = useToast()
const createdMainnetAppId: Ref<AppId | null> = ref(null)
const showMainnetSuccessPopup = ref(false)
const isOnlyTestnet = import.meta.env.VITE_IS_ONLY_TESTNET === 'true'
const selectedApp = computed(() => {
  return appsStore.app(selectedAppId.value)
})

useClickOutside(profile_menu, () => {
  showProfileMenu.value = false
})

useClickOutside(help_menu, () => {
  showHelpMenu.value = false
})

useClickOutside(notification_menu, () => {
  showNotifications.value = false
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
  const app = appsStore.app(appId)
  loaderStore.showLoader(content.APP.APP_DETAILS.FETCH_CONFIG)
  await appsStore.fetchAndStoreAppConfig(appId, app.network)
  const address = appsStore.app(appId).address
  createTransactionSigner(address, app.network)
  await appsStore.fetchNotifications()
  await chainManagementStore.getGaslessChains('testnet')
  await chainManagementStore.getAppChains(appId, app.network)
  loaderStore.hideLoader()
})

async function onLogout() {
  await logout()
  localStorage.clear()
  await router.push({ name: 'Login' })
  window.location.reload()
}

function toggleProfileMenu() {
  showProfileMenu.value = !showProfileMenu.value
  showHelpMenu.value = false
  showMobileMenu.value = false
  showNotifications.value = false
}

function toggleNotifications() {
  showNotifications.value = !showNotifications.value
  showHelpMenu.value = false
  showProfileMenu.value = false
  showMobileMenu.value = false
}

function toggleHelpMenu() {
  showHelpMenu.value = !showHelpMenu.value
  showProfileMenu.value = false
  showMobileMenu.value = false
  showNotifications.value = false
}

function toggleMobileMenu() {
  showMobileMenu.value = !showMobileMenu.value
  showProfileMenu.value = false
  showHelpMenu.value = false
  showNotifications.value = false
}

async function createMainnetApp(
  app: AppConfig,
  shouldCopyTestnetConfig: boolean
): Promise<AppResponse> {
  try {
    const mainnetApp = (
      await createApp(
        {
          name: app.name,
          region: RegionMapping[selectedRegion.value.value],
          default_chain: chainManagementStore.defaultChainId,
          chain_type: app.chain_type,
          chain: app.chain,
          chains: shouldCopyTestnetConfig
            ? chainManagementStore.appChains
            : ([] as any[]),
          wallet_mode: app.wallet_mode,
        },
        'mainnet'
      )
    ).data.app
    return mainnetApp
  } catch (e) {
    throw new Error(e)
  }
}

async function handleCreateMainnetApp({
  shouldCopyTestnetConfig,
}: {
  shouldCopyTestnetConfig: boolean
}) {
  try {
    showMainnetConfirmation.value = false
    loaderStore.showLoader(content.APP.APP_DETAILS.CREATING)
    const testnetAppId = Number(route.params.appId)
    const testnetApp = appsStore.app(testnetAppId)

    const mainnetApp = await createMainnetApp(
      testnetApp,
      shouldCopyTestnetConfig
    )
    const mainnetAppConfig = createAppConfig(mainnetApp, 'mainnet')

    appsStore.addApp(mainnetApp?.ID, mainnetAppConfig, 'mainnet')

    const updatedMainnetAppConfig = shouldCopyTestnetConfig
      ? {
          ...testnetApp,
          global_id: testnetApp.id,
          address: mainnetAppConfig.address,
        }
      : { global_id: testnetApp.id }

    if (shouldCopyTestnetConfig) {
      const app = (await fetchApp(testnetAppId, 'testnet')).data
      await updateAppLogos(mainnetApp?.ID, app.logo, 'mainnet')
    }
    const updatedMainnetApp = (
      await updateApp(mainnetApp?.ID, updatedMainnetAppConfig, 'mainnet')
    )?.data.app
    mainnetAppConfig['global_id'] = updatedMainnetApp.global_id
    await appsStore.fetchAndStoreAppConfig(mainnetApp?.ID, 'mainnet')

    const updatedTestnetApp = (
      await updateApp(testnetApp.id, { global_id: mainnetApp?.ID }, 'testnet')
    )?.data.app
    testnetApp.global_id = updatedTestnetApp.global_id
    await appsStore.fetchAndStoreAppConfig(updatedTestnetApp?.ID, 'testnet')

    toast.success(`${NetworkName.mainnet} app created`)
    if (mainnetApp) {
      showMainnetConfirmation.value = false
      createdMainnetAppId.value = mainnetApp.ID
      showMainnetSuccessPopup.value = true
      currentTab.value = 'Keyspace'
    }
  } catch (e) {
    console.error(e)
    currentNetwork.value = NetworkOptions[0]
    toast.error(errors.APP.APP_DETAILS.ERROR_CREATING_MAINNET)
  } finally {
    loaderStore.hideLoader()
  }
}

function onNetworkSwitch(networkOption) {
  const appId = Number(route.params.appId)
  const network: Network = networkOption.value
  currentTab.value = 'Dashboard'
  if (network === 'mainnet') {
    const mainnetApp = appsStore.getMainnetApp(appId)
    if (mainnetApp) {
      router.push({
        params: { appId: mainnetApp?.id },
        name: 'Dashboard',
      })
    } else showMainnetConfirmation.value = true
  } else {
    const testnetApp = appsStore.getTestnetApp(appId)
    if (testnetApp) {
      router.push({
        params: { appId: testnetApp?.id },
        name: 'Dashboard',
      })
    }
  }
}

function onNetworkSwitchCancel() {
  showMainnetConfirmation.value = false
  currentNetwork.value = NetworkOptions[0]
}

onMounted(() => {
  const appId = Number(route.params.appId)
  if (!appId) return
  const app = appsStore.app(appId)
  currentNetwork.value = NetworkOptions.find(
    (option) => option.value === app.network
  )
})

watch(
  () => Number(route.params.appId),
  () => {
    const appId = Number(route.params.appId)
    if (!appId) return
    const app = appsStore.app(appId)
    currentNetwork.value = NetworkOptions.find(
      (option) => option.value === app.network
    )
  }
)
</script>

<template>
  <div class="flex flex-col">
    <AppHeader />
    <VStack direction="row" class="flex w-full h-screen m-0 overflow-hidden">
      <div class="app-details__sidebar mobile-remove">
        <ConfigureSidebar
          :current-tab="currentTab"
          :current-network="currentNetwork.value"
          @switch-tab="switchTab"
          @switch-app="switchApp"
        />
      </div>
      <VStack
        direction="column"
        class="box-border flex flex-1 h-full p-8 pb-0 overflow-y-auto overflow-x-hidden"
        gap="2rem"
      >
        <VDropdownSecondary
          v-model="currentNetwork"
          :options="NetworkOptions"
          display-field="label"
          :disabled="
            selectedApp.chain_type === 'random' && isProductionDashboard
          "
          class="app-details__network-dropdown"
          @change="(_, option) => onNetworkSwitch(option)"
        />
        <RouterView />
        <AppFooter class="footer-bleed" />
      </VStack>
      <SwitchToMainnetConfirmation
        v-if="showMainnetConfirmation"
        @cancel="onNetworkSwitchCancel"
        @proceed="handleCreateMainnetApp"
      />
      <MainnetAppCreatedPopup
        v-if="showMainnetSuccessPopup && createdMainnetAppId"
        :app-id="createdMainnetAppId"
        @close="showMainnetSuccessPopup = false"
      />
      <ConfigureMobileMenu
        ref="mobile_menu"
        :show-mobile-menu="showMobileMenu"
        @close="showMobileMenu = false"
      >
        <ConfigureSidebar
          :current-tab="currentTab"
          :current-network="currentNetwork.value"
          @switch-tab="switchTab"
          @switch-app="switchApp"
        />
      </ConfigureMobileMenu>
    </VStack>
  </div>
</template>

<style scoped>
.footer-bleed {
  margin-inline: -2rem;
}

@media only screen and (max-width: 1023px) {
  .help-button__container {
    gap: 0.3rem;
  }
}

.help-button {
  padding: 0;
  color: var(--color-blue);
  cursor: pointer;
  background: transparent;
  border: none;
  outline: none;
}

.notification-container {
  position: relative;
}

.help-menu-items {
  top: calc(100% + 0.75rem);
  right: 0;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 200px;
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

@media only screen and (max-width: 767px) {
  .notification-container {
    position: inherit;
  }
}
</style>
