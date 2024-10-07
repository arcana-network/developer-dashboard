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
    <main class="pt-4 pb-16">
      <VStack
        direction="column"
        gap="2rem"
        class="container w-auto max-w-full mx-8"
      >
        <VStack gap="2rem">
          <h1 class="tracking-h1">Manage Apps</h1>
        </VStack>
        <VStack gap="1.25rem" md-direction="column" sm-direction="column">
          <VCard
            class="info-card flex flex-wrap justify-evenly w-full pb-8 bg-white_solid-default"
          >
            <VStack direction="column" gap="1.5rem" class="flex-grow">
              <VStack gap="1rem" align="center">
                <h2
                  class="info-title mt-8 ml-8 leading-6 text-black_solid-default"
                >
                  Monthly Active Users
                </h2>
                <VTooltip
                  v-if="hasDeleteApps"
                  title="If there is a discrepancy in aggregate billing please check billing section for further details as you may have deleted apps."
                >
                  <img
                    src="@/assets/iconography/info-circle-outline.svg"
                    class="mt-8 cursor-pointer"
                  />
                </VTooltip>
              </VStack>
              <VSeperator class="info-separator m-0 border-t border-gray-300" />
              <VStack gap="0.25rem" class="info-margin mx-8">
                <VStack
                  direction="column"
                  gap="1.75rem"
                  class="overflow-visible"
                  :style="{ width: `${freeMausWidth}%` }"
                >
                  <VStack
                    gap="0.25rem"
                    sm-direction="column"
                    align="end"
                    sm-align="start"
                  >
                    <span
                      class="info-detail -mb-3 text-rem2.5 font-normal leading-6 text-black_solid-default"
                      >{{ freeMausUsed }}</span
                    >
                  </VStack>
                  <VProgressBar
                    class="info-progress w-full !h-px10"
                    :percentage="percentageFreeMaus"
                    state="success"
                  />
                </VStack>
                <VStack
                  v-if="paidMausUsed > 0"
                  direction="column"
                  gap="1.75rem"
                  align="start"
                  :style="{ width: `${paidMausWidth}%` }"
                  class="text-ellipsis overflow-visible"
                >
                  <VStack
                    gap="0.25rem"
                    sm-direction="column"
                    align="end"
                    sm-align="start"
                  >
                    <span
                      class="info-detail -mb-3 text-rem2.5 font-normal leading-6 text-black_solid-default"
                      >{{ paidMausUsed }}</span
                    >
                  </VStack>
                  <VProgressBar
                    class="info-progress w-full !h-px10 min-w-0"
                    :percentage="100"
                  />
                </VStack>
              </VStack>
              <VStack class="flex-grow info-margin mx-8 justify-end">
                <VStack gap="1.25rem" sm-direction="column">
                  <VStack gap="0.5rem" align="center">
                    <div
                      class="legend-dot w-px10 h-px10 rounded-full bg-system-green"
                    ></div>
                    <span
                      class="info-detail-name text-rem1 leading-1.5 text-black_solid-default"
                      >Free users</span
                    >
                  </VStack>
                  <VStack gap="0.5rem" align="center">
                    <div
                      class="legend-dot w-px10 h-px10 rounded-full bg-cornflower_blue-default"
                    ></div>
                    <span
                      class="info-detail-name text-rem1 leading-1.5 text-black_solid-default"
                      >Paid users</span
                    >
                  </VStack>
                </VStack>
              </VStack>
            </VStack>
          </VCard>
          <VCard
            class="info-card flex flex-wrap justify-evenly w-full pb-8 bg-white_solid-default"
          >
            <VStack direction="column" gap="1.5rem" class="flex-grow">
              <h2 class="info-title mt-8 ml-8 leading-6 text-black">
                Estimated Cost
              </h2>
              <VSeperator class="info-separator m-0 border-t border-gray-300" />
              <VStack gap="1rem" class="info-margin mx-8">
                <span
                  class="info-detail -mb-3 text-rem2.5 font-normal leading-6 text-black_solid-default"
                  >Due:</span
                >
                <span
                  class="info-detail -mb-3 text-rem2.5 font-normal leading-6 text-black_solid-default info-amount text-system-deep_red"
                  >${{ estimatedCost }}</span
                >
              </VStack>
            </VStack>
          </VCard>
        </VStack>
        <VStack gap="1.25rem" sm-justify="center" wrap>
          <VCard
            variant="depressed"
            class="w-rem19 min-h-px350 relative flex items-center justify-center cursor-pointer border border-system-ash border-dashed"
            @click.stop="canCreateApp = true"
            @cancel="canCreateApp = false"
          >
            <VStack
              class="add-app hover:custom-filter"
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
            class="w-rem19 min-h-px350 relative flex items-center justify-center cursor-pointer"
            :class="{
              'cursor-not-allowed opacity-30': accountStatus !== 'active',
            }"
          >
            <VStack
              direction="column"
              align="center"
              class="group justify-between absolute inset-2rem-1.25rem"
            >
              <button
                class="absolute top-px-12 right-px-12 bg-transparent border-0 outline-none hover:custom-filter"
                @click.stop="handleDelete(app.id)"
              >
                <img
                  src="@/assets/iconography/delete.svg"
                  alt="close icon"
                  class="w-px22 h-px22 opacity-0 group-hover:opacity-100"
                />
              </button>
              <img
                :src="getImageUrl(app.id)"
                class="app-logo w-22 h-22 rounded-full bg-black_solid-default"
              />
              <VStack
                gap="0.5rem"
                class="max-w-full"
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
                  class="font-nohemi text-base font-thin app-name max-w-full mt-2.5 text-xl text-center text-ellipsis overflow-hidden"
                  :title="app.name"
                >
                  {{ ellipsisAppName(app.name) }}
                </span>
                <img
                  v-if="!app.editState && isHovered(app.id)"
                  src="@/assets/iconography/pencil.svg"
                  class="edit-icon mt-2 cursor-pointer"
                  title="Edit app name"
                  @click.stop="app.editState = true"
                />
              </VStack>
              <VCard
                variant="popup"
                gap="6px"
                class="stats-card box-border flex items-center justify-center w-full p-2 m-0"
              >
                <VStack direction="column" align="center" gap="0.25rem">
                  <span
                    class="stats-title text-rem0.9 font-200 leading-1.5 text-system-grey"
                    >{{ NetworkName.testnet }} Users</span
                  >
                  <span class="stats-number text-rem1.5 font-400 leading-1.5">{{
                    app.totalUsers || 0
                  }}</span>
                </VStack>
                <VSeperator
                  v-if="isMainnetAppAvailable(app.id)"
                  vertical
                  class="h-full mx-4"
                />
                <VStack
                  v-if="isMainnetAppAvailable(app.id)"
                  direction="column"
                  align="center"
                  gap="0.25rem"
                >
                  <span
                    class="stats-title text-rem0.9 font-200 leading-1.5 text-system-grey"
                    >{{ NetworkName.mainnet }} Users</span
                  >
                  <span class="stats-number text-rem1.5 font-400 leading-1.5">{{
                    getMainnetTotalUsers(app.id)
                  }}</span>
                </VStack>
              </VCard>
              <VStack gap="1rem" class="w-full mt-2">
                <VButton
                  variant="secondary"
                  :label="NetworkName.testnet"
                  class="app-action-button w-full text-base min-w-unset delete-button"
                  :disabled="app.network !== 'testnet'"
                  @click.stop="() => goToDashboard(app.id, 'testnet')"
                />
                <VButton
                  variant="primary"
                  :label="NetworkName.mainnet"
                  class="app-action-button w-full text-base min-w-unset pause-button"
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
