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
import { useAppsStore, type AppOverview, type AppId } from '@/stores/apps.store'

const router = useRouter()
const appsStore = useAppsStore()

type AppData = AppOverview & {
  storageUsedPercent?: number
  bandwidthUsedPercent?: number
}

const apps: Ref<AppData[]> = ref(appsStore.apps)
const canCreateApp = ref(false)
const showDeletePopup = ref(false)
const appToDelete = ref(0)

function goToDashboard(appId: AppId) {
  router.push({ name: 'AppDetails', params: { appId } })
}

function calculatePercentageLimitUsed(limitUsed: number, limitAllowed: number) {
  return (limitUsed / limitAllowed) * 100
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

function calculateAppLimits() {
  apps.value.forEach((app) => {
    app.storageUsedPercent = calculatePercentageLimitUsed(
      app.storage.consumed,
      app.storage.allowed
    )
    app.bandwidthUsedPercent = calculatePercentageLimitUsed(
      app.bandwidth.consumed,
      app.bandwidth.allowed
    )
  })
}

function getImageUrl(appId: AppId) {
  const appLogos = appsStore.app(appId).logos
  return appLogos.dark.vertical || appLogos.light.vertical || AppFallbackLogo
}

onBeforeMount(calculateAppLimits)

appsStore.$subscribe(() => {
  apps.value = appsStore.apps
  calculateAppLimits()
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
              <span
                class="sub-heading-3 app-name text-ellipsis"
                :title="app.name"
              >
                {{ app.name }}
              </span>
              <VCard variant="depressed" gap="6px" class="stats-card">
                <VStack direction="column" align="center" gap="0.25rem">
                  <span class="stats-title">Total Users</span>
                  <span class="stats-number">{{ app.totalUsers }}</span>
                </VStack>
                <VSeperator vertical class="stats-separator" />
                <VStack direction="column" align="center" gap="0.25rem">
                  <span class="stats-title">Estimated Cost</span>
                  <span class="stats-number">${{ app.estimatedCost }}</span>
                </VStack>
              </VCard>
              <VStack gap="1.25rem" class="limit-indicator-container">
                <VStack direction="column" class="flex-grow">
                  <span class="limit-title">Monthly Active Users</span>
                  <span class="limit-details">
                    <span class="mau-users">1000</span>
                    users
                  </span>
                </VStack>
              </VStack>
              <VStack gap="1rem" style="width: 100%; margin-top: 1.5rem">
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
  height: 28rem;
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
  max-width: 100%;
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

.mau-users {
  font-family: var(--font-body);
  font-size: 1.5rem;
  color: var(--text-white);
}
</style>
