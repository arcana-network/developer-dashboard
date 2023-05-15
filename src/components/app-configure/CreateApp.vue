<script lang="ts" setup>
import { computed, ref } from 'vue'
import type { Ref } from 'vue'
import { useRouter } from 'vue-router'

import VButton from '@/components/lib/VButton/VButton.vue'
import VDropdown from '@/components/lib/VDropdown/VDropdown.vue'
import VOverlay from '@/components/lib/VOverlay/VOverlay.vue'
import VSeperator from '@/components/lib/VSeperator/VSeperator.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import VTextField from '@/components/lib/VTextField/VTextField.vue'
import { useToast } from '@/components/lib/VToast'
import { createApp } from '@/services/gateway.service'
import { useAppsStore } from '@/stores/apps.store'
import { useChainManagementStore } from '@/stores/chainManagement.store'
import { RegionMapping, regions } from '@/utils/constants'
import { createAppConfig } from '@/utils/createAppConfig'
import { createTransactionSigner } from '@/utils/signerUtils'
import validateRPCandChainId from '@/utils/validateRPCandChainId'

const router = useRouter()
const toast = useToast()
const appsStore = useAppsStore()
const appName = ref('')
const selectedChainId: Ref<number | null> = ref(null)
const hasAppNameError = ref(false)
const selectedRegion = ref(regions[0])
const chainManagementStore = useChainManagementStore()
const showLoader = ref(false)

const emit = defineEmits(['close'])

function getPayloadForCreateApp() {
  return {
    name: appName.value,
    chain: selectedChainId.value,
    default_chain: selectedChainId.value,
    region: RegionMapping[selectedRegion.value.value],
  }
}

function getChain(chainId: number) {
  return chainManagementStore.allChains.find(
    (item) => item.chain_id === chainId
  )
}

async function handleCreateApp() {
  try {
    showLoader.value = true
    hasAppNameError.value = false
    const selectedChain = getChain(selectedChainId.value)
    const isChainValid = await validateRPCandChainId(
      selectedChain.rpc_url,
      selectedChain.chain_id
    )
    if (isChainValid) {
      const {
        data: { app },
      } = await createApp(getPayloadForCreateApp(), 'testnet')
      appsStore.addApp(app.ID, createAppConfig(app, 'testnet'), 'testnet')
      createTransactionSigner(app.address, 'testnet')
      router.push({ name: 'AppDetails', params: { appId: app.ID } })
    } else {
      toast.error('Chain is not valid, please change it to another one')
    }
  } catch (e) {
    console.error(e)
    toast.error('Error occurred while creating app')
  } finally {
    showLoader.value = false
  }
}

const enableCreate = computed(() => {
  return !(appName.value.trim().length > 0 && !!selectedChainId.value)
})

function onChainSelect(_, option) {
  selectedChainId.value = option.chain_id
}
</script>

<template>
  <VOverlay>
    <div class="create-app-modal-card | rounded-[10px] space-y-5">
      <img
        src="@/assets/iconography/close.svg"
        class="close-btn"
        @click.stop="emit('close')"
      />
      <h2 class="create-app-title">Create New App</h2>
      <VSeperator class="full-bleed" />
      <form @submit.prevent="handleCreateApp">
        <VStack direction="column">
          <VStack direction="column" gap="0.5rem">
            <label class="app-name-label" for="app-name">Enter App Name</label>
            <VTextField
              id="app-name"
              v-model.trim="appName"
              class="app-name-input"
              :message-type="hasAppNameError ? 'error' : ''"
              message="App Name cannot be empty"
            />
            <label class="app-name-label" for="default-chain"
              >Default Chain*</label
            >
            <VDropdown
              :options="chainManagementStore.allChains"
              display-field="name"
              @change="onChainSelect"
            />
            <p class="text-[#8D8D8D]">
              *You can change the default chain later
            </p>
          </VStack>
          <VButton
            type="submit"
            label="CREATE"
            class="create-button"
            :disabled="enableCreate"
          />
        </VStack>
      </form>
    </div>
  </VOverlay>
</template>

<style scoped>
.create-app-modal-card {
  position: fixed;
  top: 50%;
  left: 50%;
  flex-direction: column;
  gap: 1rem;
  width: 72%;
  min-width: 200px;
  max-width: 560px;
  padding: 2rem;
  background-color: #262626;
  transform: translate(-50%, -50%);
}

.full-bleed {
  width: calc(100% + 4rem);
  margin-inline: -2rem;
}

.create-app-title {
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
}

.app-name-label {
  font-size: 1.125rem;
  font-weight: 400;
  color: var(--text-grey);
}

.create-button {
  align-self: center;
  padding: 1rem 4rem;
  margin-top: 1rem;
}

.region-dropdown {
  width: 100%;
}

.close-btn {
  position: fixed;
  top: 1.25rem;
  right: 1.25rem;
  width: 1rem;
  cursor: pointer;
}
</style>
