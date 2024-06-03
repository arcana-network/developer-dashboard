<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'

import VDropdown from '@/components/lib/VDropdown/VDropdown.vue'
import VOverlay from '@/components/lib/VOverlay/VOverlay.vue'
import { useChainManagementStore } from '@/stores/chainManagement.store'
import { useGaslessStore } from '@/stores/gasless.store'

const chainManagementStore = useChainManagementStore()
const { gaslessChains, appChains } = chainManagementStore
const { gastankList } = useGaslessStore()
const emits = defineEmits(['close', 'submit'])
const supportedGaslessChains = ref([])
const isMetaMaskInstalled = window?.ethereum?.isMetaMask

const formData = ref({
  name: '',
  chainId: '',
})

async function onSave(formData: object) {
  emits('submit', formData)
}

function onChainSelect(_, option) {
  formData.value.chainId = option.chain_id
}

onMounted(() => {
  const supportedChain = appChains
    .filter((chain) => gaslessChains[chain.chain_id])
    .filter(
      (chain) =>
        !gastankList.find((gasTank) => gasTank.chainId === chain.chain_id)
    )
  supportedGaslessChains.value = supportedChain
})

const enableSave = computed(() => {
  const { chainId, name } = formData.value
  return chainId !== '' && Number.isInteger(Number(chainId)) && name.length
})
</script>

<template>
  <VOverlay>
    <div class="h-full flex overflow-y-auto py-2">
      <div
        v-if="!isMetaMaskInstalled"
        class="border-[1px] border-[#363636] rounded-lg max-h-[600px] w-[330px] h-[230px] text-white p-4 space-y-5 bg-[#1F1F1F] m-auto text-center flex flex-col justify-center items-center"
      >
        <p>
          Looks like Metamask extension is not installed, please install to add
          gas tank
        </p>
        <button
          class="bg-[#FFFFFF] text-black w-[100px] p-2 rounded-md transition-opacity duration-500"
          @click="emits('close')"
        >
          Close
        </button>
      </div>
      <div
        v-else
        class="border-[1px] border-[#363636] rounded-lg max-h-[600px] w-[330px] text-white p-4 space-y-5 bg-[#1F1F1F] m-auto"
      >
        <div class="space-y-[10px]">
          <p class="text-sm">Add Gas Tank</p>
          <p class="text-sm text-[#8D8D8D] leading-4">
            Please provide the following details to setup a gas tank:
          </p>
        </div>
        <form class="space-y-5" @submit.prevent="onSave(formData)">
          <div class="flex flex-col space-y-2">
            <label for="network-name" class="text-xs text-[#8D8D8D]"
              >Name</label
            >
            <input
              v-model.trim="formData.name"
              type="text"
              class="text-sm bg-[#313131] p-[10px] w-full border-none outline-none rounded-md"
              name="network-name"
            />
          </div>
          <div class="flex flex-col space-y-2">
            <label for="network-name" class="text-xs text-[#8D8D8D]"
              >Network (Gasless Supported)</label
            >
            <VDropdown
              :options="supportedGaslessChains"
              display-field="name"
              @change="onChainSelect"
            />
          </div>
          <div class="space-x-2.5 flex justify-end">
            <button
              type="button"
              class="border-[1.5px] border-[#F7F7F7] w-[100px] p-2 rounded-md"
              @click.stop="emits('close')"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="bg-[#FFFFFF] text-black w-[100px] p-2 rounded-md transition-opacity duration-500"
              :disabled="!enableSave"
              :class="[!enableSave ? 'opacity-5' : 'opacity-100']"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  </VOverlay>
</template>
