<script lang="ts" setup>
import { ref } from 'vue'

import ConfigureActionButtons from '@/components/app-configure/ConfigureActionButtons.vue'
import SettingCard from '@/components/app-configure/SettingCard.vue'
import VDropdown from '@/components/lib/VDropdown/VDropdown.vue'
import { useToast } from '@/components/lib/VToast'
import { updateApp } from '@/services/gateway.service'
import { useAppsStore } from '@/stores/apps.store'
import { useLoaderStore } from '@/stores/loader.store'
import { useAppId } from '@/use/getAppId'
import { chains, type Chain, type ChainOption } from '@/utils/constants'

const appsStore = useAppsStore()
const appId = useAppId()
const loaderStore = useLoaderStore()
const toast = useToast()
const app = appsStore.app(appId)

const selectedChain = ref(
  chains.find(
    (chain) => chain.value === app.access.selectedChain
  ) as ChainOption<Chain>
)

function isChainChanged() {
  return selectedChain.value.value !== app.access.selectedChain
}

function handleCancel() {
  selectedChain.value = chains.find(
    (chain) => chain.value === app.access.selectedChain
  ) as ChainOption<Chain>
}

async function handleSave() {
  try {
    loaderStore.showLoader('Saving chain type...')
    const { access } = app
    access.selectedChain = selectedChain.value.value
    await updateApp(appId, { ...app, ...access })
    toast.success('Saved chain type')
    app.access.selectedChain = selectedChain.value.value
  } catch (e) {
    toast.error('Error occured while saving chain type.')
  } finally {
    loaderStore.hideLoader()
  }
}
</script>

<template>
  <section name="configure-chain-type">
    <SettingCard>
      <template #title>Chain Type</template>
      <template #description
        >Select the chain where your dApp will be deployed. In case of Web2
        applications or if your chain does not show up in the dropdown list,
        choose "None".</template
      >
      <form @submit.prevent="handleSave">
        <VDropdown
          v-model="selectedChain"
          :options="chains"
          display-field="label"
          name="ChainSelection"
          class="chain-selection-dropdown"
        />
        <ConfigureActionButtons
          :save-disabled="!isChainChanged()"
          :cancel-disabled="!isChainChanged()"
          @cancel="handleCancel"
        />
      </form>
    </SettingCard>
  </section>
</template>

<style scoped>
.chain-selection-dropdown {
  max-width: 20rem;
}
</style>
