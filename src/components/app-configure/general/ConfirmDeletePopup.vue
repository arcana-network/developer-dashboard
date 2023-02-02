<script lang="ts" setup>
import { ref, computed } from 'vue'

import VButton from '@/components/lib/VButton/VButton.vue'
import VSeperator from '@/components/lib/VSeperator/VSeperator.vue'
import type { Network } from '@/utils/constants'

const emit = defineEmits(['cancel', 'proceed'])

const appsNetwork = [
  {
    label: 'Mainnet App',
    value: 'mainnet',
  },
  {
    label: 'Testnet App',
    value: 'testnet',
  },
]

const networksForDeletion = ref({ mainnet: false, testnet: false })

function onNetworkSelect(network: Network) {
  networksForDeletion.value[network] = !networksForDeletion.value[network]
}

const disableProceed = computed(() => {
  return (
    !networksForDeletion.value.mainnet && !networksForDeletion.value.testnet
  )
})

function onProceed() {
  emit('proceed', {
    networks: {
      mainnet: networksForDeletion.value.mainnet,
      testnet: networksForDeletion.value.testnet,
    },
  })
}
</script>

<template>
  <header class="sub-heading-1 flex-grow">Delete app</header>
  <VSeperator />
  <main class="body-3">
    <p>
      Deleting the app will remove all the assets that have been uploaded by
      your application and it's users, remove public and private keys assigned
      to users and any access controls that may have been set.<br /><br />
      Please press 'Delete' to confirm this action.
    </p>
    <div class="flex choose-app__container">
      <div
        v-for="network in appsNetwork"
        :key="network.value"
        class="choose-app__option"
      >
        <input
          :id="network.value"
          type="checkbox"
          :name="network.value"
          @change="() => onNetworkSelect(network.value)"
        />
        <label :for="network.value">{{ network.label }}</label>
      </div>
    </div>
  </main>
  <footer class="flex sm-column flex-grow">
    <VButton
      v-wave
      variant="secondary"
      label="CANCEL"
      @click.stop="emit('cancel')"
    />
    <VButton
      v-wave
      variant="primary"
      label="DELETE"
      :disabled="disableProceed"
      @click.stop="onProceed"
    />
  </footer>
</template>

<style scoped>
header {
  display: flex;
  justify-content: center;
}

main {
  padding: 2vw;
  font-size: 0.9rem;
  line-height: 1.5;
  text-align: center;
}

footer {
  gap: 2vh;
  align-items: center;
  justify-content: center;
}

.choose-app__container {
  display: flex;
  justify-content: space-around;
  margin-top: 15px;
}

.choose-app__option {
  display: flex;
  align-items: center;
}

.choose-app__option * + * {
  margin-left: 10px;
}
</style>
