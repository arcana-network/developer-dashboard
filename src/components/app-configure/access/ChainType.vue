<script lang="ts" setup>
import { computed } from 'vue'

import SettingCard from '@/components/app-configure/SettingCard.vue'
import VDropdown from '@/components/lib/VDropdown/VDropdown.vue'
import { useAppStore } from '@/stores/app.store'
import { useAppsStore } from '@/stores/apps.store'
import { useAppId } from '@/use/getAppId'
import { chains, type Chain, type ChainOption } from '@/utils/constants'

const appStore = useAppStore()
const appsStore = useAppsStore()
const appId = useAppId()
const selectedChain = computed(() => {
  return chains.find(
    (chain) => chain.value === appsStore.app(appId).access.selectedChain
  )
})

function handleSelectedChainChange(chain: ChainOption<Chain>) {
  appStore.updateSelectedChain(chain.value)
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
      <VDropdown
        :model-value="selectedChain"
        :options="chains"
        display-field="label"
        name="ChainSelection"
        class="chain-selection-dropdown"
        @update:model-value="handleSelectedChainChange"
      />
    </SettingCard>
  </section>
</template>

<style scoped>
.chain-selection-dropdown {
  max-width: 20rem;
}
</style>
