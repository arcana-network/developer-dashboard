<script lang="ts" setup>
import bytes from 'bytes'
import { onBeforeMount, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'

import VButton from '@/components/lib/VButton/VButton.vue'
import VCard from '@/components/lib/VCard/VCard.vue'
import VProgressBar from '@/components/lib/VProgressBar/VProgressBar.vue'
import VSeperator from '@/components/lib/VSeperator/VSeperator.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import { fetchStats } from '@/services/gateway.service'
import { useAppsStore, type AppConfig } from '@/stores/apps.store'
import { MAX_ALLOWED_APP_LIMIT } from '@/utils/constants'

const router = useRouter()
const appsStore = useAppsStore()

type AppData = AppConfig & {
  id: number
  noOfUsers?: number
  noOfFiles?: number
  storageUsed?: number
  bandwidthUsed?: number
  storageUsedPercent?: number
  bandwidthUsedPercent?: number
}

const apps: Ref<AppData[]> = ref(appsStore.apps)

function deleteApp(appId: number) {
  alert('Delete App ' + appId)
}

function pauseApp(appId: number) {
  alert('Pause App ' + appId)
}

function goToDashboard(appId: number) {
  router.push({ name: 'Dashboard', params: { appId } })
}

function createNewApp() {
  router.push({ name: 'CreateApp' })
}

function calculateLimitUsedPercent(limitUsed: number) {
  return limitUsed / MAX_ALLOWED_APP_LIMIT / 100
}

function getProgressState(limitUsedPercent: number) {
  if (limitUsedPercent > 70) {
    return 'error'
  }
  if (limitUsedPercent <= 50) {
    return 'success'
  }
  return 'warn'
}

onBeforeMount(() => {
  apps.value.forEach(async (app) => {
    const stats = (await fetchStats(app.id)).data
    console.log(stats)
    app.noOfUsers = stats.no_of_users
    app.noOfFiles = stats.actions.upload - stats.actions.delete
    app.storageUsed = stats.actions.storage
    app.bandwidthUsed = stats.actions.bandwidth
    app.storageUsedPercent = calculateLimitUsedPercent(
      app.storageUsed as number
    )
    app.bandwidthUsedPercent = calculateLimitUsedPercent(
      app.bandwidthUsed as number
    )
  })
})
</script>

<template>
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
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Lectus magna fringilla
      urna porttitor rhoncus dolor purus non.
    </div>
    <VStack gap="1.25rem" wrap>
      <VCard class="app-card" @click.stop="createNewApp()">
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
          <img src="@/assets/dapp-fallback.svg" class="app-logo" />
          <span class="sub-heading-3 app-name">{{ app.name }}</span>
          <VCard variant="depressed" gap="6px" class="stats-card">
            <VStack direction="column" align="center">
              <span class="stats-title">Total Users</span>
              <span class="stats-number">450</span>
            </VStack>
            <VSeperator vertical class="stats-separator" />
            <VStack direction="column" align="center">
              <span class="stats-title">No of Files</span>
              <span class="stats-number">20K</span>
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
                {{ bytes(app.storageUsed as number) }} of 300 GB used
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
                {{ bytes(app.bandwidthUsed as number) }} of 300 GB used
              </span>
              <VProgressBar
                :percentage="app.bandwidthUsedPercent"
                :state="getProgressState(app.bandwidthUsedPercent as number)"
                class="limit-indicator"
              />
            </VStack>
          </VStack>
          <VStack gap="1rem" style="margin-top: auto">
            <VButton
              variant="secondary"
              label="Delete"
              class="app-action-button delete-button"
              @click.stop="deleteApp(app.id)"
            />
            <VButton
              variant="secondary"
              label="Pause"
              class="app-action-button pause-button"
              @click.stop="pauseApp(app.id)"
            />
          </VStack>
        </VStack>
      </VCard>
    </VStack>
  </VStack>
</template>

<style scoped>
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
  width: clamp(20rem, 40vw, 28rem);
  height: 31rem;
  cursor: pointer;
}

.app-container {
  position: absolute;
  inset: 2rem 1.25rem;
}

.app-logo {
  margin-top: 0.75rem;
}

.app-name {
  margin-top: 0.625rem;
  font-size: 1.5rem;
}

.app-action-button {
  width: 12rem;
  text-transform: uppercase;
}

.delete-button {
  background: transparent !important;
  border: 2px solid #ee193f !important;
}

.delete-button:hover {
  color: #ee193f !important;
}

.pause-button {
  background: linear-gradient(#262626, #262626) padding-box,
    linear-gradient(to bottom, #0085ff, #29c8fa) border-box !important;
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
}

.limit-indicator {
  width: 100%;
  height: 5px;
  margin-top: 1.25rem;
}
</style>
