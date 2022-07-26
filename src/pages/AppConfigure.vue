<script lang="ts" setup>
import { ref, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

import ConfigureFooter from '@/components/app-configure/ConfigureFooter.vue'
import ConfigureHeader from '@/components/app-configure/ConfigureHeader.vue'
import ConfigureSidebar from '@/components/app-configure/ConfigureSidebar.vue'
import AppHeader from '@/components/AppHeader.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import { useToast } from '@/components/lib/VToast'
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
const toast = useToast()
const route = useRoute()

currentTab.value = String(route.name).replace('Settings', '').toLowerCase()

let currentConfig: AppConfig = store.getters.appConfigRequestBody

function switchTab(tab: ConfigureTab) {
  currentTab.value = tab.type
  router.replace({ name: `${tab.label}Settings` })
}

async function handleSave() {
  store.commit('showLoader', 'Saving app config...')
  const appConfigRequestBody: AppConfig = store.getters.appConfigRequestBody
  const updatedApp = (await updateApp(appConfigRequestBody)).data
  store.commit(
    'updateWalletUIModeFromGateway',
    updatedApp.app.wallet_type === WalletMode.UI
  )
  await updateSmartContractTransactions(appConfigRequestBody)
  currentConfig = store.getters.appConfigRequestBody
  store.commit('hideLoader')
  toast.success('App configuration updated')
}

async function updateSmartContractTransactions(app: AppConfig) {
  try {
    if (app.name !== currentConfig.name) {
      store.commit('showLoader', 'Updating app name in smart contract...')
      await setAppName(app.name)
      toast.success('App name saved in blockchain')
    }
  } catch (e) {
    handleSmartContractErrors('App name', e)
  }

  try {
    const hasStorageLimitChanged =
      app.storage_limit !== currentConfig.storage_limit
    const hasBandwidthLimitChanged =
      app.bandwidth_limit !== currentConfig.bandwidth_limit

    if (hasStorageLimitChanged || hasBandwidthLimitChanged) {
      store.commit('showLoader', 'Updating user limits in smart contract...')
      await setDefaultLimit(app.storage_limit, app.bandwidth_limit)
      toast.success('User limits saved in blockchain')
    }
  } catch (e) {
    handleSmartContractErrors('User limits', e)
  }

  try {
    store.commit('showLoader', 'Updating social auth in smart contract...')
    await setClientIds(app.cred)
    toast.success('Client IDs saved in blockchain')
  } catch (e) {
    handleSmartContractErrors('Client IDs', e)
  }

  try {
    if (
      app.wallet_type === WalletMode.UI &&
      currentConfig.wallet_type === WalletMode.NoUI
    ) {
      store.commit('showLoader', 'Enabling UI Mode in smart contract...')
      await enableUiMode()
      toast.success('UI mode saved in blockchain')
    }
  } catch (e) {
    handleSmartContractErrors('UI mode', e)
  }
  store.commit('hideLoader')
}

function handleSmartContractErrors(type: string, error: unknown) {
  toast.error(
    `An error occurred while saving the ${type} in the blockchain. Please try again or contact support.`
  )
  console.error(error)
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
      <RouterView />
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
