<script lang="ts" setup>
import { ref, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import ConfigureFooter from '@/components/app-configure/ConfigureFooter.vue'
import ConfigureHeader from '@/components/app-configure/ConfigureHeader.vue'
import ConfigureSidebar from '@/components/app-configure/ConfigureSidebar.vue'
import AppHeader from '@/components/AppHeader.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import { useToast } from '@/components/lib/VToast'
import {
  getAppConfigRequestBody,
  updateApp,
  type AppConfig,
  type AppConfigCred,
} from '@/services/gateway.service'
import {
  setAppConfig,
  setDefaultLimit,
  enableUiMode,
} from '@/services/smart-contract.service'
import { useAppStore } from '@/stores/app.store'
import { useLoaderStore } from '@/stores/loader.store'
import {
  WalletMode,
  type ConfigureTab,
  type ConfigureTabType,
} from '@/utils/constants'

const currentTab: Ref<ConfigureTabType> = ref('general')
const router = useRouter()
const appStore = useAppStore()
const loaderStore = useLoaderStore()
const toast = useToast()
const route = useRoute()

currentTab.value = String(route.name)
  .replace('Settings', '')
  .toLowerCase() as ConfigureTabType

let currentConfig = getAppConfigRequestBody()

function switchTab(tab: ConfigureTab) {
  currentTab.value = tab.type
  router.replace({
    name: `${tab.label}Settings`,
    params: { appId: appStore.appId },
  })
}

async function handleSave() {
  loaderStore.showLoader('Saving app config...')
  const appConfigRequestBody = getAppConfigRequestBody()
  const updatedApp = (await updateApp(appConfigRequestBody)).data
  appStore.updateWalletUIModeFromGateway(
    updatedApp.app.wallet_type === WalletMode.UI
  )
  await updateSmartContractTransactions(appConfigRequestBody)
  currentConfig = appConfigRequestBody
  loaderStore.hideLoader()
  toast.success('App configuration updated')
}

async function updateSmartContractTransactions(app: AppConfig) {
  try {
    const hasStorageLimitChanged =
      app.storage_limit !== currentConfig.storage_limit
    const hasBandwidthLimitChanged =
      app.bandwidth_limit !== currentConfig.bandwidth_limit

    if (hasStorageLimitChanged || hasBandwidthLimitChanged) {
      loaderStore.showLoader('Updating user limits in smart contract...')
      await setDefaultLimit(app.storage_limit, app.bandwidth_limit)
      toast.success('User limits saved in blockchain')
    }
  } catch (e) {
    handleSmartContractErrors('User limits', e)
  }

  try {
    if (
      app.wallet_type === WalletMode.UI &&
      currentConfig.wallet_type === WalletMode.NoUI
    ) {
      loaderStore.showLoader('Enabling UI Mode in smart contract...')
      await enableUiMode()
      toast.success('UI mode saved in blockchain')
    }
  } catch (e) {
    handleSmartContractErrors('UI mode', e)
  }

  try {
    loaderStore.showLoader('Updating app config in smart contract...')
    await setAppConfig(app.name as string, app.cred as AppConfigCred[])
    toast.success('App config saved in blockchain')
  } catch (e) {
    handleSmartContractErrors('App Config', e)
  }

  loaderStore.hideLoader()
}

function handleSmartContractErrors(type: string, error: unknown) {
  toast.error(
    `An error occurred while saving the ${type} in the blockchain. Please try again or contact support.`
  )
  console.error(error)
}

function handleCancel() {
  appStore.fetchAppConfig()
  router.push({ name: 'Dashboard', params: { appId: appStore.appId } })
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
