<script lang="ts" setup>
import { onBeforeMount, ref, type Ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

import AppFallbackLogo from '@/assets/dapp-fallback.svg'
import CloseIcon from '@/assets/iconography/close.svg'
import CreateApp from '@/components/app-configure/CreateApp.vue'
import AppDelete from '@/components/app-configure/general/AppDelete.vue'
import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import AppStatusBanner from '@/components/AppStatusBanner.vue'
import VButton from '@/components/lib/VButton/VButton.vue'
import VCard from '@/components/lib/VCard/VCard.vue'
import VProgressBar from '@/components/lib/VProgressBar/VProgressBar.vue'
import VSeperator from '@/components/lib/VSeperator/VSeperator.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import VTextField from '@/components/lib/VTextField/VTextField.vue'
import { useToast } from '@/components/lib/VToast'
import VTooltip from '@/components/lib/VTooltip/VTooltip.vue'
import {
  getAccountStatus,
  getAuthOverview,
  updateApp,
  type AccountStatus,
} from '@/services/gateway.service'
import { useAppsStore, type AppConfig, type AppId } from '@/stores/apps.store'
import { useChainManagementStore } from '@/stores/chainManagement.store'
import { useLoaderStore } from '@/stores/loader.store'
import type { Network } from '@/utils/constants'
import { NetworkName } from '@/utils/constants'

const router = useRouter()
const appsStore = useAppsStore()
const chainManagementStore = useChainManagementStore()

type AppData = AppConfig & {
  editState?: boolean
}

const apps: Ref<AppData[]> = ref(appsStore.apps)
const hasDeleteApps = ref(false)
const canCreateApp = ref(false)
const showDeletePopup = ref(false)
const accountStatus: Ref<AccountStatus> = ref('active')
const appToDelete = ref(0)
const estimatedCost = ref(0)
const freeMausUsed = ref(0)
const percentageFreeMaus = ref(0)
const paidMausUsed = ref(0)
const freeMausWidth = ref(100)
const paidMausWidth = ref(0)
const toast = useToast()
const loader = useLoaderStore()

const hoveredCards: { [key: number]: boolean } = reactive({})

const setHover = (appId: AppId, state: boolean) => {
  hoveredCards[appId] = state
}
const isHovered = (appId: AppId) => {
  return !!hoveredCards[appId]
}

function goToDashboard(appId: AppId, network: Network) {
  let paramAppId = appId
  if (network === 'mainnet') {
    const mainnetApp = appsStore.getMainnetApp(appId)
    paramAppId = mainnetApp?.id
  }
  router.push({ name: 'AppDetails', params: { appId: paramAppId } })
}

function isMainnetAppAvailable(testnetAppId: AppId) {
  const mainnetApp = appsStore.getMainnetApp(testnetAppId)
  return !(mainnetApp === null)
}

function getMainnetTotalUsers(testnetAppId: AppId) {
  const mainnetApp = appsStore.getMainnetApp(testnetAppId)
  return mainnetApp?.totalUsers || 0
}

function handleDelete(appId: AppId) {
  showDeletePopup.value = true
  appToDelete.value = appId
}

function getImageUrl(appId: AppId) {
  const appInfo = appsStore.app(appId)
  if (appInfo && appInfo.logos) {
    return (
      appInfo.logos.dark.vertical ||
      appInfo.logos.light.vertical ||
      AppFallbackLogo
    )
  }
  return AppFallbackLogo
}

onBeforeMount(async () => {
  if (appsStore.appIds.length === 0) {
    loader.showLoader('Loading apps...')
  }
  const [accountStatusData, authOverviewData, _, __, ___, ____] =
    await Promise.all([
      getAccountStatus(),
      getAuthOverview('mainnet'),
      appsStore.fetchAndStoreAllApps('testnet'),
      appsStore.fetchAndStoreAllApps('mainnet'),
      appsStore.fetchNotifications(),
      chainManagementStore.getAllAppChains('testnet'),
    ])
  loader.hideLoader()
  accountStatus.value = accountStatusData.data
  const authOverview = authOverviewData.data

  const mausUsed = authOverview.mau
  estimatedCost.value = authOverview.bill
  hasDeleteApps.value = authOverview.active_app_mau < authOverview.mau
  const allowedFreeMaus = 2000

  if (mausUsed > allowedFreeMaus) {
    freeMausUsed.value = allowedFreeMaus
    paidMausUsed.value = mausUsed - allowedFreeMaus
    percentageFreeMaus.value = 100
    freeMausWidth.value = (freeMausUsed.value / mausUsed) * 100
    paidMausWidth.value = (paidMausUsed.value / mausUsed) * 100
  } else {
    freeMausUsed.value = mausUsed
    percentageFreeMaus.value = (mausUsed / allowedFreeMaus) * 100
  }
})

appsStore.$subscribe(() => {
  apps.value = appsStore.apps
})

async function handleAppNameSave(app: AppData) {
  if (app.name.trim().length) {
    app.editState = false
    await Promise.all([
      updateApp(app.global_id, { name: app.name }, 'mainnet'),
      updateApp(app.id, { name: app.name }, 'testnet'),
    ])
    toast.success('App name saved')
  } else {
    toast.error('App name is required')
  }
}

function ellipsisAppName(appName: string) {
  if (appName.length > 10) {
    return `${appName.slice(0, 10)}...`
  }
  return appName
}
</script>

<template>
  <div>
    <AppHeader />
    <AppStatusBanner
      v-if="accountStatus !== 'active'"
      :status="accountStatus"
    />
    <main>
      <VStack direction="column" gap="2rem" class="container">
        <VStack gap="2rem">
          <h1 class="tracking-h1">Manage Apps</h1>
        </VStack>
        <VStack gap="1.25rem" md-direction="column" sm-direction="column">
          <VCard class="info-card">
            <VStack direction="column" gap="1.5rem" class="flex-grow">
              <VStack gap="1rem" align="center">
                <h2 class="info-title">Monthly Active Users</h2>
                <VTooltip
                  v-if="hasDeleteApps"
                  title="If there is a discrepancy in aggregate billing please check billing section for further details as you may have deleted apps."
                >
                  <img
                    src="@/assets/iconography/info-circle-outline.svg"
                    style="margin-top: 2rem; cursor: pointer"
                  />
                </VTooltip>
              </VStack>
              <VSeperator class="info-separator" />
              <VStack gap="0.25rem" class="info-margin">
                <VStack
                  direction="column"
                  gap="0.75rem"
                  :style="{ width: `${freeMausWidth}%`, overflow: 'visible' }"
                >
                  <VStack
                    gap="0.25rem"
                    sm-direction="column"
                    align="end"
                    sm-align="start"
                  >
                    <span class="info-detail">{{ freeMausUsed }}</span>
                  </VStack>
                  <VProgressBar
                    class="info-progress"
                    :percentage="percentageFreeMaus"
                    state="success"
                  />
                </VStack>
                <VStack
                  v-if="paidMausUsed > 0"
                  direction="column"
                  gap="0.75rem"
                  align="start"
                  :style="{ width: `${paidMausWidth}%`, overflow: 'visible' }"
                  class="text-ellipsis"
                >
                  <VStack
                    gap="0.25rem"
                    sm-direction="column"
                    align="end"
                    sm-align="start"
                  >
                    <span class="info-detail">{{ paidMausUsed }}</span>
                  </VStack>
                  <VProgressBar
                    class="info-progress"
                    style="min-width: 0"
                    :percentage="100"
                  />
                </VStack>
              </VStack>
              <VStack class="flex-grow info-margin justify-end">
                <VStack gap="1.25rem" sm-direction="column">
                  <VStack gap="0.5rem" align="center">
                    <div
                      class="legend-dot"
                      style="background-color: var(--color-green)"
                    ></div>
                    <span class="info-detail-name">Free users</span>
                  </VStack>
                  <VStack gap="0.5rem" align="center">
                    <div
                      class="legend-dot"
                      style="background-color: var(--primary)"
                    ></div>
                    <span class="info-detail-name">Paid users</span>
                  </VStack>
                </VStack>
              </VStack>
            </VStack>
          </VCard>
          <VCard class="info-card">
            <VStack direction="column" gap="1.5rem" class="flex-grow">
              <h2 class="info-title">Estimated Cost</h2>
              <VSeperator class="info-separator" />
              <VStack gap="1rem" class="info-margin">
                <span class="info-detail">Due:</span>
                <span class="info-detail info-amount"
                  >${{ estimatedCost }}</span
                >
              </VStack>
            </VStack>
          </VCard>
        </VStack>
        <VStack gap="1.25rem" sm-justify="center" wrap>
          <VCard
            variant="depressed"
            class="w-[19rem] min-h-[350px] relative flex items-center justify-center cursor-pointer border border-[#868c90] border-dashed"
            @click.stop="canCreateApp = true"
            @cancel="canCreateApp = false"
          >
            <VStack
              class="add-app"
              direction="column"
              gap="1.25rem"
              align="center"
            >
              <img src="@/assets/iconography/plus-circle.svg" />
              <h3 class="text-lg font-thin">Create New App</h3>
            </VStack>
          </VCard>
          <VCard
            v-for="app in apps"
            :key="`app-${app.id}`"
            class="w-[19rem] min-h-[350px] relative flex items-center justify-center cursor-pointer"
            :class="{
              'cursor-not-allowed opacity-30': accountStatus !== 'active',
            }"
          >
            <VStack
              direction="column"
              align="center"
              class="app-container justify-between relative"
            >
              <button
                class="delete-icon-btn"
                @click.stop="handleDelete(app.id)"
              >
                <img
                  src="@/assets/iconography/delete.svg"
                  alt="close icon"
                  class="delete-icon-img"
                />
              </button>
              <img :src="getImageUrl(app.id)" class="app-logo" />
              <VStack
                gap="0.5rem"
                style="max-width: 100%"
                @mouseenter="setHover(app.id, true)"
                @mouseleave="setHover(app.id, false)"
              >
                <VTextField
                  v-if="app.editState"
                  v-model="app.name"
                  class="text-ellipsis"
                  type="text"
                  no-message
                  :icon="CloseIcon"
                  clickable-icon
                  @icon-clicked="app.name = ''"
                  @keyup.enter.stop="handleAppNameSave(app)"
                />
                <span
                  v-else
                  class="font-nohemi text-base font-thin app-name text-center text-ellipsis overflow-hidden"
                  :title="app.name"
                >
                  {{ ellipsisAppName(app.name) }}
                </span>
                <img
                  v-if="!app.editState && isHovered(app.id)"
                  src="@/assets/iconography/pencil.svg"
                  class="edit-icon"
                  title="Edit app name"
                  @click.stop="app.editState = true"
                />
              </VStack>
              <VCard variant="popup" gap="6px" class="stats-card">
                <VStack direction="column" align="center" gap="0.25rem">
                  <span class="stats-title"
                    >{{ NetworkName.testnet }} Users</span
                  >
                  <span class="stats-number">{{ app.totalUsers || 0 }}</span>
                </VStack>
                <VSeperator
                  v-if="isMainnetAppAvailable(app.id)"
                  vertical
                  style="height: 100%; margin-inline: 1rem"
                />
                <VStack
                  v-if="isMainnetAppAvailable(app.id)"
                  direction="column"
                  align="center"
                  gap="0.25rem"
                >
                  <span class="stats-title"
                    >{{ NetworkName.mainnet }} Users</span
                  >
                  <span class="stats-number">{{
                    getMainnetTotalUsers(app.id)
                  }}</span>
                </VStack>
              </VCard>
              <VStack gap="1rem" style="width: 100%; margin-top: 0.5rem">
                <VButton
                  variant="secondary"
                  :label="NetworkName.testnet"
                  class="app-action-button delete-button"
                  :disabled="app.network !== 'testnet'"
                  @click.stop="() => goToDashboard(app.id, 'testnet')"
                />
                <VButton
                  variant="primary"
                  :label="NetworkName.mainnet"
                  class="app-action-button pause-button"
                  :disabled="!isMainnetAppAvailable(app.id)"
                  @click.stop="() => goToDashboard(app.id, 'mainnet')"
                />
              </VStack>
            </VStack>
          </VCard>
        </VStack>
        <AppDelete
          v-if="showDeletePopup"
          :app-id="appToDelete"
          @close="showDeletePopup = false"
        />
      </VStack>
    </main>
    <AppFooter show-social-icons />
    <Transition name="fade" mode="out-in">
      <CreateApp v-if="canCreateApp" @close="canCreateApp = false" />
    </Transition>
  </div>
</template>

<style scoped>
main {
  padding-block: 1rem 4rem;
}

.container {
  width: auto;
  max-width: 100%;
  margin: 0 2rem;
}

.app-container {
  position: absolute;
  inset: 2rem 1.25rem;
}

.app-logo {
  width: 5.5rem;
  height: 5.5rem;
  background: var(--primary-dark);
  border-radius: 50%;
}

.app-name {
  max-width: 100%;
  margin-top: 0.625rem;
  font-size: 1.5rem;
}

.app-action-button {
  width: 100%;
  min-width: unset !important;
  font-size: 16px;
}

.stats-card {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 10px;
  margin: 0;
}

.stats-title {
  font-size: 0.9rem;
  font-weight: 200;
  line-height: 1.5;
  color: var(--text-grey);
}

.stats-number {
  font-size: 1.5rem;
  font-weight: 400;
  line-height: 1.5;
}

.info-card {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  width: 100%;
  padding-bottom: 2rem;
  background-color: white;
}

.info-title {
  margin-top: 2rem;
  margin-left: 2rem;
  line-height: 1.5;
  color: black;
}

.info-separator {
  margin: 0;
  border-top: 1px solid rgb(220 220 220);
}

.info-detail {
  margin-bottom: -0.75rem;
  font-size: 2.5rem;
  font-weight: 400;
  line-height: 1.5;
  color: black;
}

.info-detail-name {
  font-size: 1rem;
  line-height: 1.5;
  color: var(--text-grey);
  color: black;
}

.info-margin {
  margin-inline: 2rem;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.info-amount {
  color: #f55;
}

.info-progress {
  width: 100%;
  height: 10px;
}

.add-app:hover {
  filter: brightness(0) saturate(100%) invert(50%) sepia(32%) saturate(4510%)
    hue-rotate(304deg) brightness(100%) contrast(103%);
}

.edit-icon {
  margin-top: 0.5rem;
  cursor: pointer;
}

.delete-icon-btn {
  position: absolute;
  top: -12px;
  right: -12px;
  background-color: transparent;
  border: none;
  outline: none;
}

.delete-icon-img {
  width: 22px;
  height: 22px;
  opacity: 0;
}

.delete-icon-btn:hover {
  filter: brightness(0) saturate(100%) invert(50%) sepia(32%) saturate(4510%)
    hue-rotate(304deg) brightness(100%) contrast(103%);
}

.app-container:hover .delete-icon-img {
  opacity: 1;
}
</style>
