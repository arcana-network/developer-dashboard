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
import type { ConfigureTab, ConfigureTabType } from '@/utils/constants'
import fetchAndStoreAppConfig from '@/utils/fetchAndStoreAppConfig'
import signerMakeTx from '@/utils/signerMakeTx'

const currentTab: Ref<ConfigureTabType> = ref('general')
const router = useRouter()
const store = useStore()

function switchTab(tab: ConfigureTab) {
  currentTab.value = tab.type
  router.replace({ name: `${tab.label}Settings` })
}

async function handleSave() {
  store.commit('showLoader', 'Saving app config...')
  const appConfigRequestBody: AppConfig = store.getters.appConfigRequestBody
  await updateApp(appConfigRequestBody)
  await updateSmartContractTransactions(appConfigRequestBody)
  store.commit('hideLoader')
}

async function updateSmartContractTransactions(app: AppConfig) {
  try {
    store.commit('showLoader', 'Updating app name in smart contract...')
    await signerMakeTx('setAppName', [app.name])

    store.commit('showLoader', 'Updating user limits in smart contract...')
    await signerMakeTx('setDefaultLimit', [
      app.storage_limit,
      app.bandwidth_limit,
    ])

    store.commit('showLoader', 'Updating social auth in smart contract...')
    const authSignerMakeTxValue: [string[], string[]] = [[], []]
    app.cred?.forEach((authDetail) => {
      if (authDetail.verifier !== 'passwordless' && authDetail.clientId) {
        authSignerMakeTxValue[0].push(authDetail.verifier)
        authSignerMakeTxValue[1].push(authDetail.clientId)
      }
    })
    await signerMakeTx('setClientIds', authSignerMakeTxValue)
  } catch (e) {
    console.error(e)
  }
}

function handleCancel() {
  fetchAndStoreAppConfig()
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
  margin-top: auto;
}
</style>
