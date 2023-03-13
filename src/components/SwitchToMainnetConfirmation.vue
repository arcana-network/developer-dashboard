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
    <div class="switch-chain__outer-container">
      <div class="switch-chain__container">
        <h3 class="switch-chain__title">
          Switch to {{ NetworkName.mainnet }}?
        </h3>
        <p class="switch-chain__message">
          To create {{ NetworkName.mainnet }} configuration profile you can copy
          {{ NetworkName.testnet }} application settings profile or create a
          fresh {{ NetworkName.mainnet }} configuration. Each configuration
          profile is assigned a unique App Address.
        </p>
        <div class="flex switch-chain__copy-optionss">
          <div
            v-for="option in mainnetCopyOptions"
            :key="option.label"
            class="switch-chain__copy-options"
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
        <div class="switch-chain__button-container">
          <VButton
            variant="secondary"
            class="switch-chain__button"
            label="Cancel"
            @click="emits('cancel')"
          />
          <VButton
            class="switch-chain__button"
            label="Proceed"
            @click.stop="onProceed"
          />
        </div>
      </div>
    </div>
  </VOverlay>
</template>

<style scoped>
.switch-chain__dropdown-container {
  display: flex;
  justify-content: flex-end;
}

.switch-chain__outer-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 10px;
}

.switch-chain__container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 600px;
  padding: 2rem;
  background-color: #262626;
  border-radius: 10px;
}

.switch-chain__title {
  font-size: 35px;
  text-align: center;
}

.switch-chain__message {
  font-family: var(--font-body);
  font-size: 15px;
  color: var(--text-white);
  text-align: center;
}

.switch-chain__container > * + * {
  margin-top: 20px;
}

.switch-chain__button-container {
  display: flex;
  gap: 1rem;
  margin-top: 64px;
}

.switch-chain__button {
  height: 40px;
}

.switch-chain__copy-optionss {
  flex-wrap: wrap;
  gap: 1.25rem;
  justify-content: center;
  width: 100%;
  margin-top: 40px;
}

.switch-chain__copy-optionss > * + * {
  margin-left: 5px;
}

.switch-chain__copy-options {
  display: flex;
  align-items: baseline;
  justify-content: center;
}

.switch-chain__copy-options > * + * {
  margin-left: 5px;
}

@media only screen and (max-width: 767px) {
  .switch-chain__title {
    font-size: 20px;
  }

  .switch-chain__message {
    font-size: 15px;
  }
}
</style>
