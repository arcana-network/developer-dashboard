<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

import VOverlay from '@/components/lib/VOverlay/VOverlay.vue'
import { getChainIDUsingRPCUrl } from '@/services/gateway.service'
import { useChainManagementStore } from '@/stores/chainManagement.store'
import validateRPCandChainId from '@/utils/validateRPCandChainId'
import { isValidUrl, isValidWsUrl } from '@/utils/validation'

const emits = defineEmits(['close', 'submit'])
const TitleAction = ref('')
const chainManagementStore = useChainManagementStore()
const showRpcError = ref(false)
const showChainIdMismatchError = ref(false)
const showLoader = ref(false)
const showLoaderRPCValidation = ref(false)

const props = defineProps({
  formAction: {
    type: String,
    required: true,
  },
  editChainId: {
    type: String,
    default: '',
  },
})

const formData = ref({
  name: '',
  chainId: '',
  currency: '',
  symbol: '',
  rpcURL: '',
  explorerURL: '',
  chainType: '',
  id: '',
  built_in: false,
  compatibility: 'evm',
})

const enableSave = computed(() => {
  const { chainId, chainType, currency, explorerURL, name, rpcURL } =
    formData.value
  return (
    chainId !== '' &&
    Number.isInteger(Number(chainId)) &&
    chainType.length &&
    currency.length &&
    name.length &&
    (explorerURL.length ? isValidUrl(explorerURL.trim()) : true) &&
    (isValidUrl(rpcURL.trim()) || isValidWsUrl(rpcURL.trim()))
  )
})

watch(formData.value, (newValue) => {
  const { rpcURL } = newValue
  const isValid = isValidUrl(rpcURL.trim()) || isValidWsUrl(rpcURL.trim())
  if (isValid) fetchChainIdUsingRPCUrl(rpcURL)
})

function populateFormData() {
  const { editChainId } = props
  const chainData = chainManagementStore.appChains.find(
    (chain) =>
      chain.compatibility?.toLowerCase() ===
        chainManagementStore.selectedChainType.toLowerCase() &&
      chain.id === editChainId
  )
  formData.value = {
    name: chainData.name,
    chainId: chainData.chain_id,
    currency: chainData.currency,
    rpcURL: chainData.rpc_url,
    explorerURL: chainData.exp_url,
    chainType: chainData.chain_type,
    id: Number(chainData.id),
    built_in: chainData.built_in,
    compatibility: chainData.compatibility,
  }
}

onMounted(() => {
  const { formAction } = props
  if (formAction === 'add') TitleAction.value = 'Add'
  if (formAction === 'edit') {
    TitleAction.value = 'Edit'
    populateFormData()
  }
})

async function onSave(formData: object) {
  try {
    showLoader.value = true
    if (formData.compatibility === 'evm') {
      const isValid = await validateRPCandChainId(
        formData.rpcURL,
        formData.chainId
      )
      if (isValid) emits('submit', formData)
      else showChainIdMismatchError.value = true
    } else {
      emits('submit', formData)
    }
    showRpcError.value = false
  } catch (e) {
    showChainIdMismatchError.value = false
    showRpcError.value = true
  } finally {
    showLoader.value = false
  }
}

const chainIDs = chainManagementStore.chainIDs

async function fetchChainIdUsingRPCUrl(rpcURL: string) {
  try {
    showLoaderRPCValidation.value = true
    const chainId = await getChainIDUsingRPCUrl(rpcURL)
    formData.value.chainId = `${chainId}`
    showRpcError.value = false
  } catch (e) {
    console.log('Error', e)
    showRpcError.value = true
    formData.value.chainId = '-'
  } finally {
    showLoaderRPCValidation.value = false
  }
}
</script>

<template>
  <VOverlay>
    <div class="h-full flex overflow-y-auto py-2">
      <div
        class="border-[1px] border-[#363636] rounded-lg max-h-[600px] w-[330px] text-black p-4 space-y-5 bg-white m-auto"
      >
        <div
          v-if="showLoader"
          class="m-auto h-[600px] flex justify-center items-center"
        >
          <p>Please Wait ...</p>
        </div>
        <div v-else class="space-y-5">
          <div class="space-y-[10px]">
            <p class="text-lg">{{ TitleAction }} a Custom Chain</p>
            <p class="text-sm text-liquiddark leading-4">
              {{ `${TitleAction}ed` }} custom chains will be automatically added
              to your user’s wallets.
            </p>
          </div>
          <form class="space-y-5">
            <div class="flex flex-col space-y-2">
              <label for="network-name" class="text-xs text-liquiddark"
                >Network Name*</label
              >
              <p v-if="formData.built_in" class="text-sm">
                {{ formData.name }}
              </p>
              <input
                v-else
                v-model.trim="formData.name"
                type="text"
                class="text-sm bg-liquidlight p-[10px] w-full border-none outline-none"
                name="network-name"
              />
            </div>
            <div class="flex flex-col space-y-2">
              <div class="flex items-center space-x-5">
                <label for="rpc-url" class="text-xs text-liquiddark"
                  >RPC URL*</label
                >
                <p
                  v-if="showLoaderRPCValidation"
                  class="text-xs text-liquiddark"
                >
                  Validating RPC URL...
                </p>
              </div>
              <input
                v-model.trim="formData.rpcURL"
                type="text"
                class="text-sm bg-liquidlight p-[10px] w-full border-none outline-none"
                name="rpc-url"
              />
              <p v-if="showRpcError" class="text-xs text-red-700">
                Looks like provided RPC URL is invalid
              </p>
            </div>
            <div class="flex space-x-2">
              <div class="flex flex-col space-y-2 w-1/2">
                <label for="chain-id" class="text-xs text-liquiddark"
                  >Chain ID*</label
                >
                <p
                  class="text-sm w-full h-full border-none outline-none"
                  :class="[
                    formData.built_in ? 'p-0' : 'p-[10px] bg-liquidlight',
                  ]"
                >
                  {{ formData.chainId }}
                </p>
                <p
                  v-if="chainIDs.find((chain) => chain === formData.chainId)"
                  class="text-xs text-red-700"
                >
                  Chain Already Exists!
                </p>
                <p v-if="showChainIdMismatchError" class="text-xs text-red-700">
                  Chain ID doesn't match with network
                </p>
              </div>
              <div class="flex flex-col space-y-2 w-1/2">
                <label for="currency" class="text-xs text-liquiddark"
                  >Currency*</label
                >
                <p v-if="formData.built_in" class="text-sm">
                  {{ formData.currency }}
                </p>
                <input
                  v-else
                  v-model.trim="formData.currency"
                  type="text"
                  class="text-sm bg-liquidlight p-[10px] w-full border-none outline-none"
                  name="currency"
                />
              </div>
            </div>
            <div class="flex flex-col space-y-2">
              <label for="explorer" class="text-xs text-liquiddark"
                >Explorer</label
              >
              <p v-if="formData.built_in" class="text-sm">
                {{ formData.explorerURL }}
              </p>
              <input
                v-else
                v-model.trim="formData.explorerURL"
                type="text"
                class="text-sm bg-liquidlight p-[10px] w-full border-none outline-none"
                name="explorer"
              />
            </div>
            <div class="space-y-2">
              <legend class="text-xs text-liquiddark">Chain Type*</legend>
              <p v-if="formData.built_in" class="text-sm">
                {{ formData.chainType }}
              </p>
              <div v-else class="flex flex-col space-y-1">
                <label class="text-sm text-black flex space-x-1"
                  ><input
                    v-model="formData.chainType"
                    type="radio"
                    name="radio"
                    value="testnet"
                  />
                  <span>Testnet</span></label
                >
                <label class="text-sm text-black flex space-x-1"
                  ><input
                    v-model="formData.chainType"
                    type="radio"
                    name="radio"
                    value="mainnet"
                  />
                  <span>Mainnet</span></label
                >
              </div>
            </div>
            <div class="space-x-4 flex justify-end">
              <button
                class="bg-liquid border-[1.5px] border-[#F7F7F7] w-[100px] p-2 rounded-md hover:text-pink"
                @click="emits('close')"
              >
                Cancel
              </button>
              <button
                class="bg-liquid text-black w-[100px] hover:text-pink p-2 rounded-md transition-opacity duration-500 opacity-100 disabled:opacity-30 disabled:text-black"
                :disabled="
                  !enableSave ||
                  chainIDs.find((chain) => chain === formData.chainId)
                "
                @click.prevent="onSave(formData)"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </VOverlay>
</template>
