<script lang="ts" setup>
import moment from 'moment'
import { onBeforeMount, ref, watch, onMounted, type Ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import ArcanaLogo from '@/assets/iconography/arcana-dark-vertical.svg'
import NotificationWithBubbleIcon from '@/assets/iconography/notification-with-bubble.svg'
import NotificationIcon from '@/assets/iconography/notification.svg'
import ConfigureMobileMenu from '@/components/app-configure/ConfigureMobileMenu.vue'
import ConfigureSidebar from '@/components/app-configure/ConfigureSidebar.vue'
import AppFooter from '@/components/AppFooter.vue'
import VButton from '@/components/lib/VButton/VButton.vue'
import VCard from '@/components/lib/VCard/VCard.vue'
import VDropdown from '@/components/lib/VDropdown/VDropdown.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import { useToast } from '@/components/lib/VToast'
import MainnetAppCreatedPopup from '@/components/MainnetAppCreatedPopup.vue'
import SwitchToMainnetConfirmation from '@/components/SwitchToMainnetConfirmation.vue'
import {
  createApp,
  fetchApp,
  getNotifications,
  updateApp,
  updateAppLogos,
  updateNotificationRead,
  type AppConfig as AppResponse,
} from '@/services/gateway.service'
import { useAppsStore, type AppId, type AppConfig } from '@/stores/apps.store'
import { useLoaderStore } from '@/stores/loader.store'
import useArcanaAuth from '@/use/arcanaAuth'
import { useClickOutside } from '@/use/clickOutside'
import {
  HelpItems,
  ProfileItems,
  type Network,
  regions,
  RegionMapping,
  NetworkName,
} from '@/utils/constants'
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

const appsStore = useAppsStore()
const loaderStore = useLoaderStore()
const currentTab = ref('Dashboard')
const router = useRouter()
const showHelpMenu = ref(false)
const showProfileMenu = ref(false)
const showMobileMenu = ref(false)
const showNotifications = ref(false)
const profile_menu = ref(null)
const help_menu = ref(null)
const mobile_menu = ref(null)
const { logout } = useArcanaAuth()
const route = useRoute()
const currentNetwork = ref(NetworkOptions[1])
const selectedRegion = ref(regions[0])
const showMainnetConfirmation = ref(false)
const toast = useToast()
const createdMainnetAppId: Ref<AppId | null> = ref(null)
const showMainnetSuccessPopup = ref(false)
const isOnlyTestnet = import.meta.env.VITE_IS_ONLY_TESTNET === 'true'
const notifications = ref([])
const latestNotificationId = ref(null)

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
  const app = appsStore.app(appId)
  loaderStore.showLoader('Fetching app config')
  await appsStore.fetchAndStoreAppConfig(appId, app.network)
  const address = appsStore.app(appId).address
  createTransactionSigner(address, app.network)
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

function toggleNotifications() {
  const value = !showNotifications.value
  showNotifications.value = value
  if (!value) markNotificationAsRead()
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

async function fetchNotifications() {
  const { notification, latest_notification_id } = (await getNotifications())
    .data
  notifications.value = notification
  latestNotificationId.value = latest_notification_id
}

async function markNotificationAsRead() {
  await updateNotificationRead(latestNotificationId.value)
}

async function createMainnetApp(app: AppConfig): Promise<AppResponse> {
  try {
    const mainnetApp = (
      await createApp(
        {
          name: app.name,
          region: RegionMapping[selectedRegion.value.value],
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
    loaderStore.showLoader('Creating app...')
    const testnetAppId = Number(route.params.appId)
    const testnetApp = appsStore.app(testnetAppId)

    const mainnetApp = await createMainnetApp(testnetApp)
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
    ).data.app
    mainnetAppConfig['global_id'] = updatedMainnetApp.global_id
    await appsStore.fetchAndStoreAppConfig(mainnetApp?.ID, 'mainnet')

    const updatedTestnetApp = (
      await updateApp(testnetApp.id, { global_id: mainnetApp?.ID }, 'testnet')
    ).data.app
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
    console.log(e)
    currentNetwork.value = NetworkOptions[0]
    toast.error('Error occured while creating mainnet app')
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

onMounted(fetchNotifications)

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
  <VStack direction="row" class="app-details__container">
    <div class="app-details__sidebar mobile-remove">
      <ConfigureSidebar
        :current-tab="currentTab"
        :current-network="currentNetwork.value"
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
          <div class="notification-container flex">
            <img
              :src="
                notifications.length
                  ? NotificationWithBubbleIcon
                  : NotificationIcon
              "
              class="cursor-pointer notification-icon"
              @click.stop="toggleNotifications"
            />
            <VCard
              v-if="showNotifications"
              class="notification-items position-absolute mobile-hide"
            >
              <div
                class="flex flex-start width-100 notification-title-container"
              >
                <p class="notification-title">Notifications</p>
              </div>
              <div class="notification-item__container">
                <ul>
                  <li
                    v-for="notification in notifications"
                    :key="notification.Data"
                    class="cursor-pointer notification-item"
                  >
                    <p class="notification-item__message">
                      {{ notification.Data }}
                    </p>
                    <p class="notification-item__time">
                      {{
                        moment(notification.Time).format('ddd-MMM, h:mm:ss a')
                      }}
                    </p>
                  </li>
                </ul>
              </div>
            </VCard>
            <VCard
              v-if="showNotifications"
              class="notification-items__mobile position-absolute tablet-hide laptop-hide"
            >
              <div
                class="flex flex-start width-100 notification-title-container"
              >
                <p class="notification-title">Notifications</p>
                <button class="close-button" @click="toggleNotifications">
                  <img src="@/assets/iconography/close.svg" alt="close" />
                </button>
              </div>
              <div class="notification-item__container">
                <ul>
                  <li
                    v-for="notification in notifications"
                    :key="notification.Data"
                    class="cursor-pointer notification-item"
                  >
                    <p class="notification-item__message">
                      {{ notification.Data }}
                    </p>
                    <p class="notification-item__time">
                      {{
                        moment(notification.Time).format('ddd-MMM, h:mm:ss a')
                      }}
                    </p>
                  </li>
                </ul>
              </div>
            </VCard>
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
          :disabled="isOnlyTestnet"
          class="app-details__network-dropdown"
          @change="(_, option) => onNetworkSwitch(option)"
        />
        <RouterView />
        <AppFooter class="footer-bleed" />
      </VStack>
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

.close-button {
  cursor: pointer;
  background-color: transparent;
  border: none;
}

@media only screen and (max-width: 1023px) {
  .help-button__container {
    gap: 0.3rem;
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

.notification-container {
  position: relative;
}

.notification-icon {
  width: 18px;
}

.notification-title-container {
  box-sizing: border-box;
  padding: 1.25rem;
  border-bottom: 1px solid #8d8d8d33;
}

.notification-title {
  margin-right: 1.25rem;
  font-family: var(--font-body);
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  text-transform: uppercase;
}

.notification-items {
  top: calc(100% + 0.75rem);
  right: 0;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 300px;
  padding: 0;
  overflow: auto;
  box-shadow: -4px -5px 4px rgb(0 0 0 / 20%), 4px 5px 4px rgb(0 0 0 / 20%) !important;
}

.notification-items ul {
  padding: 0;
}

.notification-item {
  box-sizing: border-box;
  width: 100%;
  padding-inline: 1.25rem;
  padding-bottom: 12px;
  margin-bottom: 1.25rem;
  font-family: var(--font-body);
  color: var(--text-white);
  white-space: nowrap;
  list-style: none;
}

.notification-item:not(:last-child) {
  border-bottom: 1px solid #8d8d8d33;
}

.notification-item * + * {
  margin-top: 10px;
}

.notification-item__message {
  font-family: var(--font-body);
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
}

.notification-item__time {
  font-family: var(--font-body);
  font-size: 10px;
  font-style: normal;
  font-weight: 400;
  color: #8d8d8d;
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

@media only screen and (max-width: 767px) {
  .notification-items__mobile {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 999;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    border-radius: 0;
  }

  .notification-items {
    display: none;
  }

  .notification-container {
    position: inherit;
  }

  .notification-items__mobile .notification-item__container {
    width: 100%;
  }

  .notification-item__container ul {
    box-sizing: border-box;
    padding: 0;
  }

  .notification-title-container {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
  }
}
</style>
