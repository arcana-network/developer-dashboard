<script lang="ts" setup>
import { ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

import ConfigureFooter from '@/components/app-configure/ConfigureFooter.vue'
import ConfigureHeader from '@/components/app-configure/ConfigureHeader.vue'
import ConfigureSidebar from '@/components/app-configure/ConfigureSidebar.vue'
import AppHeader from '@/components/AppHeader.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import { updateApp, type AppConfig } from '@/services/gateway.service'
import {
  setAppName,
  setClientIds,
  setDefaultLimit,
  enableUiMode,
} from '@/services/smart-contract.service'
import {
  WalletMode,
  type ConfigureTab,
  type ConfigureTabType,
} from '@/utils/constants'

const currentTab: Ref<ConfigureTabType> = ref('general')
const router = useRouter()
const store = useStore()

let currentConfig: AppConfig = store.getters.appConfigRequestBody

function switchTab(tab: ConfigureTab) {
  currentTab.value = tab.type
  router.replace({ name: `${tab.label}Settings` })
}

async function handleSave() {
  store.commit('showLoader', 'Saving app config...')
  const appConfigRequestBody: AppConfig = store.getters.appConfigRequestBody
  await updateApp(appConfigRequestBody)
  await updateSmartContractTransactions(appConfigRequestBody)
  currentConfig = store.getters.appConfigRequestBody
  store.commit('hideLoader')
}

async function updateSmartContractTransactions(app: AppConfig) {
  try {
    if (app.name !== currentConfig.name) {
      store.commit('showLoader', 'Updating app name in smart contract...')
      await setAppName(app.name)
    }

    const hasStorageLimitChanged =
      app.storage_limit !== currentConfig.storage_limit
    const hasBandwidthLimitChanged =
      app.bandwidth_limit !== currentConfig.bandwidth_limit

    if (hasStorageLimitChanged || hasBandwidthLimitChanged) {
      store.commit('showLoader', 'Updating user limits in smart contract...')
      await setDefaultLimit(app.storage_limit, app.bandwidth_limit)
    }

    store.commit('showLoader', 'Updating social auth in smart contract...')
    await setClientIds(app.cred)

    if (
      app.wallet_type === WalletMode.UI &&
      currentConfig.wallet_type === WalletMode.noUI
    ) {
      store.commit('showLoader', 'Enabling UI Mode in smart contract...')
      await enableUiMode()
    }
  } catch (e) {
    console.error(e)
  } finally {
    store.commit('hideLoader')
  }
}

function handleCancel() {
  store.dispatch('fetchAppConfig')
  router.push({ name: 'Dashboard' })
}
</script>

<template>
  <VStack direction="column" gap="2rem" class="configure-container">
    <AppHeader />
    <ConfigureHeader />
    <VStack gap="2rem" class="container">
      <ConfigureSidebar :current-tab="currentTab" @switch-tab="switchTab" />
      <router-view />
    </VStack>
    <ConfigureFooter
      class="configure-footer"
      @save="handleSave"
      @cancel="handleCancel"
    />
  </VStack>
</template>

<style scoped>
.configure-container {
  min-height: 100vh;
}

.configure-footer {
  margin-top: 4rem;
}
</style>
