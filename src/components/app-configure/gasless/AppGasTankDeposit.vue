<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'

import VOverlay from '@/components/lib/VOverlay/VOverlay.vue'
import { useGaslessStore } from '@/stores/gasless.store'
import { useWalletStore } from '@/stores/wallet.store'
import { useMetaMask } from '@/use/metamask'

const selectedGasTank = ref(null)
const gaslessStore = useGaslessStore()
const walletStore = useWalletStore()
const isConnected = ref(false)
const depositAmount = ref('')

const emits = defineEmits(['close', 'proceed'])

async function connectWallet() {
  try {
    const { connect, switchChain } = useMetaMask()
    const { provider } = await connect()
    const { chainId } = provider
    const connectedChainId = Number.parseInt(chainId)
    const selectedGasTankChainId = selectedGasTank.value.chainId
    if (connectedChainId !== selectedGasTankChainId) {
      await switchChain(`0x${selectedGasTankChainId.toString(16)}`)
    }
    isConnected.value = true
    walletStore.setWalletProvider(provider)
  } catch (err) {
    console.log({ err })
    isConnected.value = false
  }
}

const props = defineProps({
  depositTankId: {
    type: Number,
    default: null,
  },
})

onMounted(() => {
  const depositTankId = props.depositTankId
  selectedGasTank.value = gaslessStore.gastankList.find((item) => {
    return item.id === depositTankId
  })
})

const enableSave = computed(() => {
  return isConnected.value && Number(depositAmount.value) > 0
})
</script>

<template>
  <VOverlay>
    <div class="h-full flex overflow-y-auto py-2">
      <div
        class="border-[1px] border-[#363636] rounded-lg max-h-[600px] w-[330px] text-white p-4 space-y-5 bg-[#1F1F1F] m-auto"
      >
        <div class="space-y-[10px]">
          <p class="text-sm">Deposit Crypto to Gas Tank</p>
          <p class="text-sm text-[#8D8D8D] leading-4">
            Declare the owner of the gas tank by signing a message with your
            wallet:
          </p>
        </div>
        <div v-if="isConnected">
          <label for="amount" class="text-xs">Amount</label>
          <input
            v-model="depositAmount"
            type="text"
            class="text-sm bg-[#313131] p-[10px] w-full border-none outline-none rounded-md"
            name="amount"
          />
        </div>
        <button
          v-else
          class="uppercase border-2 text-sm w-full p-1 rounded-md bg-white text-black"
          @click="connectWallet"
        >
          Connect Wallet
        </button>
        <div class="space-x-2.5 flex justify-end">
          <button
            class="border-[1.5px] text-sm border-[#F7F7F7] w-[100px] p-2 rounded-md"
            @click="emits('close')"
          >
            Cancel
          </button>
          <button
            class="bg-[#FFFFFF] text-sm text-black w-[100px] p-2 rounded-md transition-opacity duration-500"
            :disabled="!enableSave"
            :class="[!enableSave ? 'opacity-5' : 'opacity-100']"
            @click.prevent="emits('proceed', depositAmount)"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  </VOverlay>
</template>
