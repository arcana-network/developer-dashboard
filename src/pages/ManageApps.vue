<script lang="ts" setup>
import { onBeforeMount, ref, type Ref } from 'vue'
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
import {
  getAccountStatus,
  getAuthOverview,
  updateApp,
  type AccountStatus,
} from '@/services/gateway.service'
import { useAppsStore, type AppConfig, type AppId } from '@/stores/apps.store'
import type { Network } from '@/utils/constants'

const router = useRouter()
const appsStore = useAppsStore()

type AppData = AppConfig & {
  editState?: boolean
}

const apps: Ref<AppData[]> = ref(appsStore.apps)
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
  accountStatus.value = (await getAccountStatus()).data
  const authOverview = (await getAuthOverview('mainnet')).data

  const mausUsed = authOverview.mau
  estimatedCost.value = authOverview.bill
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
  await appsStore.fetchAndStoreAllApps('testnet')
  await appsStore.fetchAndStoreAllApps('mainnet')
})

appsStore.$subscribe(() => {
  apps.value = appsStore.apps
})

async function handleAppNameSave(app: AppData) {
  if (app.name.trim().length) {
    app.editState = false
    await updateApp(app.global_id, { name: app.name }, 'mainnet')
    await updateApp(app.id, { name: app.name }, 'testnet')
    toast.success('App name saved')
  } else {
    toast.error('App name is required')
  }
}
</script>

<template>
  <div>
    <AppStatusBanner
      v-if="accountStatus !== 'active'"
      :status="accountStatus"
    />
    <AppHeader />
    <main>
      <VStack direction="column" gap="2rem" class="container">
        <VStack gap="2rem">
          <h1>MANAGE APPS</h1>
        </VStack>
        <VStack gap="1.25rem" md-direction="column" sm-direction="column">
          <VCard class="info-card">
            <VStack direction="column" gap="1.5rem" class="flex-grow">
              <span class="info-title">Monthly Active Users</span>
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
              <span class="info-title">Estimated Cost</span>
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
            class="app-card cursor-pointer"
            @click.stop="canCreateApp = true"
            @cancel="canCreateApp = false"
          >
            <VStack direction="column" gap="1.25rem" align="center">
              <img src="@/assets/iconography/plus-circle-outline.svg" />
              <span class="body-1 font-500">Create New App</span>
            </VStack>
          </VCard>
          <VCard
            v-for="app in apps"
            :key="`app-${app.id}`"
            class="app-card"
            :class="{ 'app-card-disabled': accountStatus !== 'active' }"
          >
            <VStack
              direction="column"
              align="center"
              class="app-container justify-space-between position-relative"
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
              <VStack gap="0.5rem" style="max-width: 100%">
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
                  class="sub-heading-3 app-name text-ellipsis"
                  :title="app.name"
                  style="max-width: calc(100% - 1rem)"
                >
                  {{ app.name }}
                </span>
                <img
                  v-if="!app.editState"
                  src="@/assets/iconography/pencil.svg"
                  class="edit-icon"
                  title="Edit app name"
                  @click.stop="app.editState = true"
                />
              </VStack>
              <VCard variant="depressed" gap="6px" class="stats-card">
                <VStack direction="column" align="center" gap="0.25rem">
                  <span class="stats-title">Testnet Users</span>
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
                  <span class="stats-title">Mainnet Users</span>
                  <span class="stats-number">{{
                    getMainnetTotalUsers(app.id)
                  }}</span>
                </VStack>
              </VCard>
              <VStack gap="1rem" style="width: 100%; margin-top: 0.5rem">
                <VButton
                  variant="secondary"
                  label="Testnet"
                  class="app-action-button delete-button"
                  :disabled="app.network !== 'testnet'"
                  @click.stop="() => goToDashboard(app.id, 'testnet')"
                />
                <VButton
                  variant="primary"
                  label="Mainnet"
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

.app-card {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 19rem;
  min-height: 350px;
}

.app-card-disabled {
  cursor: not-allowed;
  opacity: 0.3;
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
  text-transform: uppercase;
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
  font-family: var(--font-title);
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.5;
}

.stats-number {
  font-family: var(--font-body);
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.5;
}

.info-card {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  width: 100%;
  padding-bottom: 2rem;
}

.info-title {
  margin-inline: 2rem;
  margin-top: 2rem;
  font-family: var(--font-title);
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.5;
  text-transform: uppercase;
}

.info-separator {
  margin: 0;
  border-top: 1px solid rgb(141 141 141 / 20%);
}

.info-detail {
  margin-bottom: -0.75rem;
  font-family: var(--font-body);
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.5;
}

.info-detail-name {
  font-family: var(--font-body);
  font-size: 1rem;
  line-height: 1.5;
  color: var(--text-grey);
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
  color: var(--color-orange);
}

.info-progress {
  width: 100%;
  height: 10px;
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
  width: 18px;
  height: 18px;
}
</style>
