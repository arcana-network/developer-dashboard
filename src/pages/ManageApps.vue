<script lang="ts" setup>
import bytes from 'bytes'
import { onBeforeMount, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'

import AppFallbackLogo from '@/assets/dapp-fallback.svg'
import CreateApp from '@/components/app-configure/CreateApp.vue'
import AppDelete from '@/components/app-configure/general/AppDelete.vue'
import AppHeader from '@/components/AppHeader.vue'
import VButton from '@/components/lib/VButton/VButton.vue'
import VCard from '@/components/lib/VCard/VCard.vue'
import VProgressBar from '@/components/lib/VProgressBar/VProgressBar.vue'
import VSeperator from '@/components/lib/VSeperator/VSeperator.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import { fetchStats } from '@/services/gateway.service'
import { useAppsStore, type AppConfig, type AppId } from '@/stores/apps.store'
import {
  MAX_ALLOWED_APP_LIMIT,
  MAX_ALLOWED_APP_LIMIT_IN_BYTES,
} from '@/utils/constants'

const router = useRouter()
const appsStore = useAppsStore()

type AppData = AppConfig & {
  noOfUsers?: number
  noOfFiles?: number
  storageUsed?: number
  bandwidthUsed?: number
  storageUsedPercent?: number
  bandwidthUsedPercent?: number
}

const apps: Ref<AppData[]> = ref(appsStore.apps)
const canCreateApp = ref(false)
const showDeletePopup = ref(false)
const appToDelete = ref(0)

function goToDashboard(appId: number) {
  router.push({ name: 'AppDetails', params: { appId } })
}

function calculatePercentageLimitUsed(limitUsed: number) {
  return (limitUsed / MAX_ALLOWED_APP_LIMIT_IN_BYTES) * 100
}

function getProgressState(limitUsedPercent: number) {
  if (limitUsedPercent <= 50) {
    return 'success'
  }
  if (limitUsedPercent > 70) {
    return 'error'
  }
  return 'warn'
}

function handleDelete(appId: AppId) {
  showDeletePopup.value = true
  appToDelete.value = appId
}

function fetchAppDetails() {
  apps.value.forEach(async (app) => {
    const stats = (await fetchStats(app.id)).data
    app.noOfUsers = stats.no_of_users
    app.noOfFiles = stats.actions.upload - stats.actions.delete
    app.storageUsed = stats.actions.storage
    app.bandwidthUsed = stats.actions.bandwidth
    app.storageUsedPercent = calculatePercentageLimitUsed(
      app.storageUsed as number
    )
    app.bandwidthUsedPercent = calculatePercentageLimitUsed(
      app.bandwidthUsed as number
    )
  })
}

function getImageUrl(appId: AppId) {
  const appLogos = appsStore.app(appId).logos
  return appLogos.dark.vertical || appLogos.light.vertical || AppFallbackLogo
}

onBeforeMount(fetchAppDetails)

appsStore.$subscribe(() => {
  apps.value = appsStore.apps
  fetchAppDetails()
})
</script>

<template>
  <div>
    <AppHeader />
    <main>
      <VStack direction="column" gap="2rem" class="container">
        <VStack gap="2rem">
          <img
            src="@/assets/iconography/back.svg"
            class="cursor-pointer back-icon"
            alt="Go Back"
            @click.stop="router.back()"
          />
          <h1>MANAGE APPS</h1>
        </VStack>
        <div class="body-1 description">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Lectus
          magna fringilla urna porttitor rhoncus dolor purus non.
        </div>
        <VStack gap="1.25rem" wrap>
          <VCard
            class="app-card"
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
            @click.stop="goToDashboard(app.id)"
          >
            <VStack direction="column" align="center" class="app-container">
              <img :src="getImageUrl(app.id)" class="app-logo" />
              <span class="sub-heading-3 app-name">{{ app.name }}</span>
              <VCard variant="depressed" gap="6px" class="stats-card">
                <VStack direction="column" align="center">
                  <span class="stats-title">Total Users</span>
                  <span class="stats-number">{{ app.noOfUsers }}</span>
                </VStack>
                <VSeperator vertical class="stats-separator" />
                <VStack direction="column" align="center">
                  <span class="stats-title">No of Files</span>
                  <span class="stats-number">{{ app.noOfFiles }}</span>
                </VStack>
                <VSeperator vertical class="stats-separator" />
                <VStack direction="column" align="center">
                  <span class="stats-title">Estimated Cost</span>
                  <span class="stats-number">$0</span>
                </VStack>
              </VCard>
              <VStack gap="1.25rem" class="limit-indicator-container">
                <VStack direction="column" class="flex-grow">
                  <span class="limit-title">Storage</span>
                  <span class="limit-details">
                    {{ bytes(app.storageUsed as number, {decimalPlaces: 2}) }}
                    of {{ MAX_ALLOWED_APP_LIMIT }} used
                  </span>
                  <VProgressBar
                    :percentage="app.storageUsedPercent"
                    :state="getProgressState(app.storageUsedPercent as number)"
                    class="limit-indicator"
                  />
                </VStack>
                <VStack direction="column" class="flex-grow">
                  <span class="limit-title">Bandwidth</span>
                  <span class="limit-details">
                    {{ bytes(app.bandwidthUsed as number, {decimalPlaces: 2}) }}
                    of {{ MAX_ALLOWED_APP_LIMIT }} used
                  </span>
                  <VProgressBar
                    :percentage="app.bandwidthUsedPercent"
                    :state="getProgressState(app.bandwidthUsedPercent as number)"
                    class="limit-indicator"
                  />
                </VStack>
              </VStack>
              <VStack gap="1rem" style="width: 100%; margin-top: auto">
                <VButton
                  variant="secondary"
                  label="Delete"
                  class="app-action-button delete-button"
                  @click.stop="handleDelete(app.id)"
                />
                <VButton
                  variant="secondary"
                  label="Pause"
                  class="app-action-button pause-button"
                  disabled
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
    <Transition name="fade" mode="out-in">
      <CreateApp v-if="canCreateApp" @close="canCreateApp = false" />
    </Transition>
  </div>
</template>

<style scoped>
.container {
  margin-block: 2rem;
}

.back-icon {
  width: 2.25rem;
}

.description {
  font-size: 1.25rem;
  color: var(--text-grey);
}

.app-card {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: clamp(20rem, 30vw, 25rem);
  height: 31rem;
  cursor: pointer;
}

.app-container {
  position: absolute;
  inset: 2rem 1.25rem;
}

.app-logo {
  width: 5.5rem;
  height: 5.5rem;
  margin-top: 0.75rem;
  background: var(--primary-dark);
  border-radius: 50%;
}

.app-name {
  margin-top: 0.625rem;
  font-size: 1.5rem;
}

.app-action-button {
  width: 100%;
  text-transform: uppercase;
}

.delete-button {
  background: transparent !important;
  border: 2px solid #ee193f !important;
}

.delete-button:hover {
  color: #ee193f !important;
}

.stats-card {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
  height: 4.5rem;
  margin-block: 2rem;
}

.stats-separator {
  height: calc(100% - 1.25rem);
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

.limit-indicator-container {
  width: 100%;
}

.limit-title {
  font-family: var(--font-title);
  font-size: 0.875rem;
  font-weight: 700;
}

.limit-details {
  margin-top: 0.625rem;
  font-family: var(--font-title);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-grey);
}

.limit-indicator {
  width: 100%;
  height: 5px;
  margin-top: 1.25rem;
}
</style>
