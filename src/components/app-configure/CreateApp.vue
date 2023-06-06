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
import { WalletUIModes } from '@/utils/constants'
import { createAppConfig } from '@/utils/createAppConfig'
import { createTransactionSigner } from '@/utils/signerUtils'
import validateRPCandChainId from '@/utils/validateRPCandChainId'

const router = useRouter()
const toast = useToast()
const appsStore = useAppsStore()
const appName = ref('')
const selectedChainId: Ref<number | null> = ref(null)
const hasAppNameError = ref(false)
const chainManagementStore = useChainManagementStore()
const showLoader = ref(false)
const selectedWalletUIMode = ref(WalletUIModes[1])

const emit = defineEmits(['close'])

function getPayloadForCreateApp() {
  return {
    name: appName.value,
    chain: selectedChainId.value,
    default_chain: selectedChainId.value,
    wallet_mode: selectedWalletUIMode.value.value,
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
      emit('close')
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
    <div
      class="rounded-[10px] fixed top-[50%] left-[50%] flex-col p-8 max-[768px]:p-4 bg-[#262626] max-w-[560px] min-w-[200px] w-[70%] h-[550px] translate-x-[-50%] translate-y-[-50%]"
    >
      <div v-if="showLoader" class="h-full flex justify-center items-center">
        <p>Please wait...</p>
      </div>
      <div v-else class="gap-4 space-y-5">
        <div class="flex items-center justify-center relative">
          <img
            src="@/assets/iconography/close.svg"
            class="absolute right-0 w-4 max-[768px]:w-3 cursor-pointer"
            @click.stop="emit('close')"
          />
          <h2 class="text-2xl max-[768px]:text-lg font-bold text-center">
            Create New App
          </h2>
        </div>
        <VSeperator class="full-bleed" />
        <form @submit.prevent="handleCreateApp">
          <VStack direction="column" class="space-y-6">
            <VStack direction="column" gap="0.5rem" class="space-y-6">
              <VStack direction="column">
                <label class="text-lg font-normal text-[#8d8d8d]" for="app-name"
                  >Enter App Name</label
                >
                <VTextField
                  id="app-name"
                  v-model.trim="appName"
                  :message-type="hasAppNameError ? 'error' : ''"
                  message="App Name cannot be empty"
                  :no-message="!hasAppNameError"
                />
              </VStack>
              <VStack direction="column">
                <label
                  class="text-lg font-normal text-[#8d8d8d]"
                  for="default-chain"
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
              <VStack direction="column">
                <label
                  class="text-lg font-normal text-[#8d8d8d]"
                  for="default-chain"
                  >Wallet UI Mode*</label
                >
                <VDropdown
                  v-model="selectedWalletUIMode"
                  :options="WalletUIModes"
                  display-field="label"
                  @change="onChainSelect"
                />
                <p class="text-[#8D8D8D]">*You cannot change UI mode later</p>
              </VStack>
            </VStack>
            <VButton
              type="submit"
              label="CREATE"
              class="px-4 py-16 self-center"
              :disabled="enableCreate"
            />
          </VStack>
        </form>
      </div>
    </div>
  </VOverlay>
</template>

<style scoped>
.full-bleed {
  width: calc(100% + 4rem);
  margin-inline: -2rem;
}
</style>
