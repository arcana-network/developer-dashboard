<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import VOverlay from '@/components/lib/VOverlay/VOverlay.vue'
import { useChainManagementStore } from '@/stores/chainManagement.store'
import { isValidUrl } from '@/utils/validation'

const emits = defineEmits(['close', 'submit'])
const TitleAction = ref('')
const chainManagementStore = useChainManagementStore()

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
    isValidUrl(explorerURL) &&
    isValidUrl(rpcURL)
  )
})

function populateFormData() {
  const { editChainId } = props
  const chainData = chainManagementStore.appChains.find(
    (chain) => chain.id === editChainId
  )
  formData.value = {
    name: chainData.name,
    chainId: chainData.chain_id,
    currency: chainData.currency,
    rpcURL: chainData.rpc_url,
    explorerURL: chainData.exp_url,
    chainType: chainData.chain_type,
    id: Number(chainData.id),
    built_in: chainData.built_in === 'true',
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
</script>

<template>
  <VOverlay>
    <div class="h-full flex">
      <div
        class="border-[1px] border-[#363636] rounded-lg w-[330px] text-white p-4 space-y-5 bg-[#1F1F1F] m-auto"
      >
        <div class="space-y-[10px]">
          <p class="text-sm">{{ TitleAction }} a Custom EVM Chain</p>
          <p class="text-sm text-[#8D8D8D] leading-4">
            {{ `${TitleAction}ed` }} custom EVM chains will be automatically
            added to your user’s wallets.
          </p>
        </div>
        <form class="space-y-5">
          <div class="flex flex-col space-y-2">
            <label for="network-name" class="text-xs text-[#8D8D8D]"
              >Network Name</label
            >
            <p v-if="formData.built_in" class="text-sm">{{ formData.name }}</p>
            <input
              v-else
              v-model="formData.name"
              type="text"
              class="text-sm bg-[#313131] p-[10px] w-full border-none outline-none"
              name="network-name"
            />
          </div>
          <div class="flex space-x-2">
            <div class="flex flex-col space-y-2 w-1/2">
              <label for="chain-id" class="text-xs text-[#8D8D8D]"
                >Chain ID</label
              >
              <p v-if="formData.built_in" class="text-sm">
                {{ formData.chainId }}
              </p>
              <input
                v-else
                v-model="formData.chainId"
                type="text"
                class="text-sm bg-[#313131] p-[10px] w-full border-none outline-none"
                name="chain-id"
              />
            </div>
            <div class="flex flex-col space-y-2 w-1/2">
              <label for="currency" class="text-xs text-[#8D8D8D]"
                >Currency</label
              >
              <p v-if="formData.built_in" class="text-sm">
                {{ formData.currency }}
              </p>
              <input
                v-else
                v-model="formData.currency"
                type="text"
                class="text-sm bg-[#313131] p-[10px] w-full border-none outline-none"
                name="currency"
              />
            </div>
          </div>
          <div class="flex flex-col space-y-2">
            <label for="rpc-url" class="text-xs text-[#8D8D8D]">RPC URL</label>
            <input
              v-model="formData.rpcURL"
              type="text"
              class="text-sm bg-[#313131] p-[10px] w-full border-none outline-none"
              name="rpc-url"
            />
          </div>
          <div class="flex flex-col space-y-2">
            <label for="explorer" class="text-xs text-[#8D8D8D]"
              >Explorer</label
            >
            <p v-if="formData.built_in" class="text-sm">
              {{ formData.explorerURL }}
            </p>
            <input
              v-else
              v-model="formData.explorerURL"
              type="text"
              class="text-sm bg-[#313131] p-[10px] w-full border-none outline-none"
              name="explorer"
            />
          </div>
          <div class="space-y-2">
            <legend class="text-xs text-[#8D8D8D]">Chain Type</legend>
            <p v-if="formData.built_in" class="text-sm">
              {{ formData.chainType }}
            </p>
            <div v-else class="flex flex-col space-y-1">
              <label class="text-sm text-[#F7F7F7] flex space-x-1"
                ><input
                  v-model="formData.chainType"
                  type="radio"
                  name="radio"
                  value="testnet"
                />
                <span>Testnet</span></label
              >
              <label class="text-sm text-[#F7F7F7] flex space-x-1"
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
          <div class="space-x-2.5 flex justify-end">
            <button
              class="border-[1.5px] border-[#F7F7F7] w-[100px] p-2 rounded-md"
              @click="emits('close')"
            >
              Cancel
            </button>
            <button
              class="bg-[#FFFFFF] text-black w-[100px] p-2 rounded-md transition-opacity duration-500"
              :disabled="!enableSave"
              :class="[!enableSave ? 'opacity-5' : 'opacity-100']"
              @click.stop="emits('submit', formData)"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  </VOverlay>
</template>
