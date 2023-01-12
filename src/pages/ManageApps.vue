<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import AppFallbackLogo from '@/assets/dapp-fallback.svg'
import CreateApp from '@/components/app-configure/CreateApp.vue'
import AppDelete from '@/components/app-configure/general/AppDelete.vue'
import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import VButton from '@/components/lib/VButton/VButton.vue'
import VCard from '@/components/lib/VCard/VCard.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import { useAppsStore, type AppId } from '@/stores/apps.store'

const router = useRouter()
const appsStore = useAppsStore()

const apps = ref(appsStore.apps)
const canCreateApp = ref(false)
const showDeletePopup = ref(false)
const appToDelete = ref(0)

function goToDashboard(appId: AppId) {
  router.push({ name: 'AppDetails', params: { appId } })
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

appsStore.$subscribe(() => {
  apps.value = appsStore.apps
})
</script>

<template>
  <div>
    <AppHeader />
    <main>
      <VStack direction="column" gap="2rem" class="container">
        <VStack gap="2rem">
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
            <VStack
              direction="column"
              align="center"
              class="app-container justify-space-between"
            >
              <img :src="getImageUrl(app.id)" class="app-logo" />
              <span class="sub-heading-3 app-name">{{ app.name }}</span>
              <VCard variant="depressed" class="stats-card">
                <VStack direction="column" align="center">
                  <span class="stats-title">Total Users</span>
                  <span class="stats-number">{{ app.totalUsers }}</span>
                </VStack>
              </VCard>
              <VStack gap="1rem" style="width: 100%">
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
  margin: 0 2rem;
}

.back-icon {
  width: 2.25rem;
}

.app-card {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 19rem;
  min-height: 350px;
  cursor: pointer;
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
</style>
