<script lang="ts" setup>
import { computed, ref } from 'vue'
import type { Ref } from 'vue'
import { useRouter } from 'vue-router'

import VButton from '@/components/lib/VButton/VButton.vue'
import VDropdown from '@/components/lib/VDropdown/VDropdown.vue'
import VOverlay from '@/components/lib/VOverlay/VOverlay.vue'
import VSeperator from '@/components/lib/VSeperator/VSeperator.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import VTextFieldSecondary from '@/components/lib/VTextFieldSecondary/VTextFieldSecondary.vue'
import { useToast } from '@/components/lib/VToast'
import { createApp } from '@/services/gateway.service'
import { useAppsStore } from '@/stores/apps.store'
import { useChainManagementStore } from '@/stores/chainManagement.store'
import { chainTypes } from '@/utils/chainTypes'
import { WalletUIModes, ShardValues } from '@/utils/constants'
import { content, errors } from '@/utils/content'
import { createAppConfig } from '@/utils/createAppConfig'
import { createTransactionSigner } from '@/utils/signerUtils'

const router = useRouter()
const toast = useToast()
const appsStore = useAppsStore()
const appName = ref('')
const selectedChainId: Ref<number | null> = ref(null)
const selectedChainType = ref(chainTypes[0])
const selectedShard = ref(ShardValues[0])
const hasAppNameError = ref(false)
const chainManagementStore = useChainManagementStore()
const showLoader = ref(false)
const selectedWalletUIMode = ref(WalletUIModes[1])

const emit = defineEmits(['close'])

function getPayloadForCreateApp() {
  return {
    name: appName.value,
    chain: selectedChainId.value,
    chain_type: selectedChainType.value.type,
    default_chain: selectedChainId.value,
    wallet_mode: selectedWalletUIMode.value.value,
  }
}

function getPayloadForShard() {
  return {
    shards: selectedShard.value.value,
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
    const {
      data: { app },
    } = await createApp(getPayloadForCreateApp(), 'testnet')
    appsStore.addApp(app.ID, createAppConfig(app, 'testnet'), 'testnet')
    if (selectedChainType.value.name === 'MultiversX') {
      chainManagementStore.editChainSettings(
        app.ID,
        getPayloadForShard(),
        'testnet'
      )
    }

    createTransactionSigner(app.address, 'testnet')
    router.push({ name: 'AppDetails', params: { appId: app.ID } })
    emit('close')
    toast.success(content.APP.APP_DETAILS.SUCCESS)
  } catch (e) {
    console.error(e)
    toast.error(errors.APP.APP_DETAILS.ERROR_CREATING)
  } finally {
    showLoader.value = false
  }
}

const enableCreate = computed(() => {
  return !(
    appName.value.trim().length > 0 &&
    !!selectedChainId.value &&
    !!selectedWalletUIMode.value.label
  )
})

function onChainSelect(_, option) {
  selectedChainId.value = option.chain_id
}
</script>

<template>
  <VOverlay>
    <div class="fixed inset-0 flex justify-center items-center">
      <div
        class="rounded-px10 flex-col p-8 max-md:p-4 bg-white_solid-default max-w-px560 min-w-px200 w-70% max-h-screen overflow-y-auto"
      >
        <div v-if="showLoader" class="h-full flex justify-center items-center">
          <p>Please wait...</p>
        </div>
        <div v-else class="gap-4 space-y-5">
          <div class="flex items-center justify-center relative">
            <img
              src="@/assets/iconography/close.svg"
              class="absolute right-0 w-4 max-md:w-3 cursor-pointer"
              @click.stop="emit('close')"
            />
            <h2 class="text-2xl max-md:text-lg font-bold text-center">
              Create New App
            </h2>
          </div>
          <VSeperator class="w-calc-full-add-rem4 -mx-8" />
          <form @submit.prevent="handleCreateApp">
            <VStack direction="column" class="space-y-4">
              <VStack direction="column" class="space-y-3">
                <VStack direction="column">
                  <label
                    class="text-lg font-normal text-system-grey"
                    for="app-name"
                    >Enter App Name</label
                  >
                  <VTextFieldSecondary
                    id="app-name"
                    v-model.trim="appName"
                    :message-type="hasAppNameError ? 'error' : ''"
                    message="App Name cannot be empty"
                    :no-message="!hasAppNameError"
                  />
                </VStack>
                <VStack direction="column">
                  <label
                    class="text-lg font-normal text-system-grey"
                    for="default-chain"
                    >Chain Type<span class="text-system-deep_red"
                      >*</span
                    ></label
                  >
                  <VDropdown
                    v-model="selectedChainType"
                    :options="chainTypes"
                    display-field="name"
                  />
                </VStack>
                <VStack
                  v-if="selectedChainType.name === 'MultiversX'"
                  direction="column"
                >
                  <label
                    class="text-lg font-normal text-system-grey"
                    for="default-chain"
                    >Shard Value<span class="text-system-deep_red"
                      >*</span
                    ></label
                  >
                  <VDropdown
                    v-model="selectedShard"
                    :options="ShardValues"
                    display-field="label"
                  />
                </VStack>
                <VStack direction="column">
                  <label
                    class="text-lg font-normal text-system-grey"
                    for="default-chain"
                    >Default Chain</label
                  >
                  <VDropdown
                    :options="
                      chainManagementStore
                        .chainTypeSpecificChains(selectedChainType.type)
                        .sort((a, b) => a.name.localeCompare(b.name))
                    "
                    display-field="name"
                    :disabled="!selectedChainType"
                    @change="onChainSelect"
                  />
                </VStack>
                <VStack direction="column">
                  <label
                    class="text-lg font-normal text-system-grey"
                    for="default-chain"
                    >Wallet UI Mode<span class="text-system-deep_red"
                      >*</span
                    ></label
                  >
                  <VDropdown
                    v-model="selectedWalletUIMode"
                    :options="WalletUIModes"
                    display-field="label"
                  />
                  <p class="text-system-grey">
                    <span class="text-system-deep_red">*</span>You cannot change
                    these properties later.
                  </p>
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
    </div>
  </VOverlay>
</template>
