<script lang="ts" setup>
import { ref } from 'vue'

import VButton from '@/components/lib/VButton/VButton.vue'
import VOverlay from '@/components/lib/VOverlay/VOverlay.vue'
import VRadio from '@/components/lib/VRadio/VRadio.vue'
import { NetworkName } from '@/utils/constants'

const emits = defineEmits(['cancel', 'proceed'])

const mainnetCopyOptions = [
  {
    label: `Copy Existing ${NetworkName.testnet} Config`,
    value: 0,
  },
  {
    label: `New ${NetworkName.mainnet} Config`,
    value: 1,
  },
]

const selectedMainnetCopyOption = ref(0)

function onProceed() {
  const shouldCopyTestnetConfig = selectedMainnetCopyOption.value === 0
  emits('proceed', { shouldCopyTestnetConfig })
}
</script>

<template>
  <VOverlay>
    <div class="flex items-center justify-center h-full p-2.5">
      <div
        class="flex flex-col items-center justify-center max-w-px600 p-8 bg-white_solid-default rounded-lg space-y-5"
      >
        <h3 class="text-px35 text-center max-md:text-px20">
          Switch to {{ NetworkName.mainnet }}?
        </h3>
        <p
          class="text-px15 text-black_solid-default text-center max-md:text-px15"
        >
          To create {{ NetworkName.mainnet }} configuration profile you can copy
          {{ NetworkName.testnet }} application settings profile or create a
          fresh {{ NetworkName.mainnet }} configuration. Each configuration
          profile is assigned a unique App Address.
        </p>
        <div
          class="flex flex-wrap gap-5 justify-center w-full mt-10 space-x-px5"
        >
          <div
            v-for="option in mainnetCopyOptions"
            :key="option.label"
            class="flex items-baseline justify-center space-x-px5"
          >
            <VRadio
              id="switch-option"
              :label="option.label"
              :value="option.value"
              :model-value="selectedMainnetCopyOption"
              type="radio"
              name="switch-option"
              @click.stop="selectedMainnetCopyOption = option.value"
            />
          </div>
        </div>
        <div class="flex gap-4 mt-16">
          <VButton
            variant="secondary"
            class="h-10"
            label="Cancel"
            @click="emits('cancel')"
          />
          <VButton class="h-10" label="Proceed" @click.stop="onProceed" />
        </div>
      </div>
    </div>
  </VOverlay>
</template>
