<script lang="ts" setup>
import { computed, type ComputedRef } from 'vue'
import { useStore } from 'vuex'

import SettingCard from '@/components/app-configure/SettingCard.vue'
import VDropdown from '@/components/lib/VDropdown/VDropdown.vue'
import { chains, type Chain, type ChainOption } from '@/utils/constants'

const store = useStore()
const selectedChain: ComputedRef<ChainOption<Chain> | undefined> = computed(
  () => {
    return chains.find((chain) => chain.value === store.getters.selectedChain)
  }
)

function handleSelectedChainChange(chain: ChainOption<Chain>) {
  store.commit('updateSelectedChain', chain.value)
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
