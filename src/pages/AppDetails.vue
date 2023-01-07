<script lang="ts" setup>
import { onBeforeMount, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'

import ConfigureSidebar from '@/components/app-configure/ConfigureSidebar.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import { useAppsStore } from '@/stores/apps.store'
import { useLoaderStore } from '@/stores/loader.store'
import { useAppId } from '@/use/getAppId'
import { createTransactionSigner } from '@/utils/signerUtils'

const appsStore = useAppsStore()
const loaderStore = useLoaderStore()
const currentTab = ref('dashboard')
const router = useRouter()
const appId = useAppId()

function switchTab(tab: string) {
  currentTab.value = tab
  router.push({
    params: { appId },
    path: tab,
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
</script>

<template>
  <VStack direction="row" class="app-details__container">
    <div class="app-details__sidebar">
      <ConfigureSidebar :current-tab="currentTab" @switch-tab="switchTab" />
    </div>
    <VStack direction="column" class="app-details__content">
      <div class="flex justify-end help-button__container">
        <button class="help-button">Help</button>
      </div>
      <RouterView />
    </VStack>
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
  padding-top: 2rem;
  overflow-x: hidden;
  overflow-y: auto;
}

.help-button__container {
  margin-bottom: 10px;
}

.help-button {
  font-family: var(--font-body);
  color: var(--primary);
  cursor: pointer;
  background: transparent;
  border: none;
  outline: none;
}
</style>
