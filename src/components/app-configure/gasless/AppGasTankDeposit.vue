<script lang="ts" setup>
import { ethers } from 'ethers'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import VOverlay from '@/components/lib/VOverlay/VOverlay.vue'
import { getPaymaster } from '@/services/gateway.service'
import { useAppsStore } from '@/stores/apps.store'
import { useChainManagementStore } from '@/stores/chainManagement.store'
import { useGaslessStore } from '@/stores/gasless.store'
import { useWalletStore } from '@/stores/wallet.store'
import { useMetaMask } from '@/use/metamask'

const selectedGasTank = ref(null)
const gaslessStore = useGaslessStore()
const walletStore = useWalletStore()
const chainStore = useChainManagementStore()
const isConnected = ref(false)
const appStore = useAppsStore()
const depositAmount = ref('')
const route = useRoute()
const walletBalance = ref('')
const walletDeposit = ref('')
const loader = ref({
  show: false,
  message: '',
})

const emits = defineEmits(['close', 'proceed'])

function showLoader(message: string) {
  loader.value.show = true
  loader.value.message = message
}

function hideLoader() {
  loader.value.show = false
  loader.value.message = ''
}

async function connectWallet() {
  const { connect, switchChain, createChain } = useMetaMask()
  const selectedGasTankChainId = selectedGasTank.value.chainId
  showLoader('connecting to wallet...')
  try {
    const { provider } = await connect()
    const { chainId } = provider
    const connectedChainId = Number.parseInt(chainId)
    if (connectedChainId !== selectedGasTankChainId) {
      await switchChain(`0x${selectedGasTankChainId.toString(16)}`)
    }
    walletStore.setWalletProvider(provider)
    isConnected.value = true
  } catch (err) {
    if (err.code === 4902) {
      const chainInfo = chainStore.appChains.find(
        (item) => item.chain_id === selectedGasTankChainId
      )
      await createChain(chainInfo)
      isConnected.value = true
    } else {
      console.log(err, 'Failed to switch to the network')
    }
  } finally {
    hideLoader()
  }
}

async function fetchBalanceAndDeposit() {
  try {
    showLoader('fetching balance and deposit amount...')
    const appId = route.params.appId
    const app = appStore.app(appId)
    const { data: paymaster } = (
      await getPaymaster(props.depositTankId, app.network)
    ).data
    const web3Provider = new ethers.providers.Web3Provider(walletStore.provider)
    const wallet = await web3Provider.getSigner()
    const owner = await wallet.getAddress()
    const paymasterContract = new ethers.Contract(
      paymaster.address,
      paymaster.abi,
      wallet
    )
    const balance = await paymasterContract.getBalance(owner)
    const deposit = await paymasterContract.getDeposit()
    walletBalance.value = ethers.utils.formatEther(balance)
    walletDeposit.value = ethers.utils.formatEther(deposit)
  } catch (e) {
    console.log(e)
  } finally {
    hideLoader()
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

watch(
  () => isConnected.value,
  () => {
    fetchBalanceAndDeposit()
  }
)

const enableSave = computed(() => {
  return isConnected.value && Number(depositAmount.value) > 0
})
</script>

<template>
  <VOverlay>
    <div class="h-full flex overflow-y-auto py-2">
      <div v-if="loader.show" class="flex justify-center items-center m-auto">
        {{ loader.message }}
      </div>
      <div
        v-else
        class="border-[1px] border-[#363636] rounded-lg max-h-[600px] w-[330px] text-white p-4 bg-[#1F1F1F] m-auto"
      >
        <div class="space-y-5">
          <div class="space-y-[10px]">
            <p class="text-sm">Deposit Crypto to Gas Tank</p>
            <p class="text-sm text-[#8D8D8D] leading-4">
              Declare the owner of the gas tank by signing a message with your
              wallet:
            </p>
          </div>
          <div v-if="isConnected">
            <div>
              <p class="text-[10px]">
                <span class="text-[#8D8D8D]">Total balance:</span>
                {{ walletBalance }}
              </p>
              <p class="text-[10px]">
                <span class="text-[#8D8D8D]">Total deposit:</span>
                {{ walletDeposit }}
              </p>
            </div>
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
    </div>
  </VOverlay>
</template>
