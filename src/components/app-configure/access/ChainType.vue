<script lang="ts" setup>
import { computed, type ComputedRef } from 'vue'
import { useStore } from 'vuex'

import SettingCard from '@/components/app-configure/SettingCard.vue'
import VCard from '@/components/lib/VCard/VCard.vue'
import VRadioGroup from '@/components/lib/VRadioGroup/VRadioGroup.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import { chains, type Chain } from '@/utils/constants'

const store = useStore()
const selectedChain: ComputedRef<Chain> = computed(
  () => store.getters.selectedChain
)

function handleChangeChainType(value: Chain) {
  store.commit('updateSelectedChain', value)
}
</script>

<template>
  <section name="configure-chain-type">
    <SettingCard>
      <template #title>Chain Type</template>
      <template #description
        >Please specify the blockchains that your app is going to use in the
        future <a>LEARN MORE</a></template
      >
      <VCard variant="depressed" class="chain-options-container">
        <VStack
          direction="column"
          gap="2rem"
          justify="space-between"
          class="flex-grow"
        >
          <VRadioGroup
            :model-value="selectedChain"
            :options="chains"
            name="ChainSelection"
            @update:modelValue="handleChangeChainType"
          />
        </VStack>
      </VCard>
    </SettingCard>
  </section>
</template>

<style scoped>
.chain-options-container {
  max-width: 20rem;
  padding: 1.5rem 2rem;
}
</style>
