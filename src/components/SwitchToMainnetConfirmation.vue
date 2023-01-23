<script lang="ts" setup>
import { ref } from 'vue'

import VButton from '@/components/lib/VButton/VButton.vue'
import VOverlay from '@/components/lib/VOverlay/VOverlay.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['cancel', 'proceed'])

const mainnetCopyOptions = [
  {
    label: 'Copy Existing Testnet Config',
    value: 0,
  },
  {
    label: 'New Mainnet Config',
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
  <VOverlay v-if="props.show">
    <div class="switch-chain__outer-container">
      <div class="switch-chain__container">
        <h3 class="switch-chain__title">Switch to Mainnet?</h3>
        <p class="switch-chain__message">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Diam ut
          fermentum, bibendum lectus phasellus ligula morbi.
        </p>
        <div class="flex switch-chain__copy-optionss">
          <div
            v-for="option in mainnetCopyOptions"
            :key="option.label"
            class="switch-chain__copy-options"
          >
            <input
              id="switch-option"
              type="radio"
              name="switch-option"
              :checked="selectedMainnetCopyOption === option.value"
              @click.stop="selectedMainnetCopyOption = option.value"
            />
            <label for="switch-option">{{ option.label }}</label>
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
  padding: 20px;
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

.switch-chain__button-container * + * {
  margin-left: 15px;
}

.switch-chain__button {
  height: 40px;
}

.switch-chain__copy-optionss {
  justify-content: space-around;
  width: 100%;
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
