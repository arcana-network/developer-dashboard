<script lang="ts" setup>
import { ethers } from 'ethers'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import VOverlay from '@/components/lib/VOverlay/VOverlay.vue'
import { useToast } from '@/components/lib/VToast'
import { getPaymaster } from '@/services/gateway.service'
import { useAppsStore } from '@/stores/apps.store'
import { useChainManagementStore } from '@/stores/chainManagement.store'
import { useGaslessStore } from '@/stores/gasless.store'
import { useWalletStore } from '@/stores/wallet.store'
import { connectWallet } from '@/utils/connectToMetaMask'
import { content } from '@/utils/content'

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
const toast = useToast()
const loader = ref({
  show: false,
  message: '',
})
const connectedWalletAddress = ref('')

const emits = defineEmits(['close', 'proceed'])

const props = defineProps({
  depositTankId: {
    type: Number,
    default: null,
  },
  depositType: {
    type: String,
    default: 'deposit',
  },
})

function showLoader(message: string) {
  loader.value.show = true
  loader.value.message = message
}

function hideLoader() {
  loader.value.show = false
  loader.value.message = ''
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
    connectedWalletAddress.value = await wallet.getAddress()
    const owner = selectedGasTank.value.owner
    const paymasterContract = new ethers.Contract(
      paymaster.address,
      paymaster.abi,
      wallet
    )
    const balance = await web3Provider.getBalance(owner)
    const deposit = await paymasterContract.getBalance(owner)
    walletBalance.value = ethers.utils.formatEther(balance)
    walletDeposit.value = ethers.utils.formatEther(deposit)
  } catch (e) {
    toast.error('Failed to fetch deposit or balance')
  } finally {
    hideLoader()
  }
}

function onProceed() {
  if (props.depositType === 'deposit') depositHandler()
  if (props.depositType === 'withdraw') withdrawHandler()
}

async function depositHandler() {
  showLoader('depositing...')
  try {
    const appId = route.params.appId
    const app = appStore.app(appId)
    const { data: paymaster } = (
      await getPaymaster(props.depositTankId, app.network)
    ).data
    const web3Provider = new ethers.providers.Web3Provider(walletStore.provider)
    const wallet = await web3Provider.getSigner()
    const owner = selectedGasTank.value.owner
    const paymasterContract = new ethers.Contract(
      paymaster.address,
      paymaster.abi,
      wallet
    )
    let tx = await paymasterContract.depositFor(owner, {
      value: ethers.utils.parseEther(depositAmount.value + ''),
    })
    await tx.wait()
    toast.success('Deposit complete')
  } catch (e) {
    if (e?.data?.code === -32000) toast.error('Insufficient funds')
    else toast.error('Deposit failed')
  } finally {
    hideLoader()
    emits('close')
  }
}

async function withdrawHandler() {
  showLoader('withdrawing...')
  try {
    const appId = route.params.appId
    const app = appStore.app(appId)
    const { data: paymaster } = (
      await getPaymaster(props.depositTankId, app.network)
    ).data
    const web3Provider = new ethers.providers.Web3Provider(walletStore.provider)
    const wallet = await web3Provider.getSigner()
    const owner = selectedGasTank.value.owner
    const paymasterContract = new ethers.Contract(
      paymaster.address,
      paymaster.abi,
      wallet
    )
    let tx = await paymasterContract.withdrawTo(
      owner,
      ethers.utils.parseEther(depositAmount.value + '')
    )
    await tx.wait()
    toast.success('Withdraw complete')
  } catch (e) {
    console.log(e)
    toast.error('Withdraw failed')
  } finally {
    hideLoader()
    emits('close')
  }
}

async function connectToWallet(chainId: number) {
  try {
    showLoader(content.GENERIC.CONNECTING)
    const provider = await connectWallet(chainId, chainStore.allChains)
    walletStore.setWalletProvider(provider)
    isConnected.value = true
  } catch (e) {
    toast.error(e.message)
  } finally {
    hideLoader()
  }
}

function isConnectedAddressSameAsOwner() {
  return (
    connectedWalletAddress.value.toLowerCase() ===
    selectedGasTank.value.owner.toLowerCase()
  )
}

onMounted(async () => {
  const depositTankId = props.depositTankId
  selectedGasTank.value = gaslessStore.gastankList.find((item) => {
    return item.id === depositTankId
  })
  const chainId = selectedGasTank.value.chainId
  connectToWallet(chainId)
})

watch(() => isConnected.value, fetchBalanceAndDeposit)

const enableSave = computed(() => {
  return isConnected.value && Number(depositAmount.value) > 0
})
</script>

<template>
  <VOverlay>
    <div class="h-full flex overflow-y-auto py-2">
      <div
        v-if="loader.show"
        class="flex justify-center items-center m-auto h-[200px] w-[330px] border-[1px] border-[#363636] bg-white rounded-lg"
      >
        {{ loader.message }}
      </div>
      <div
        v-else
        class="border-[1px] border-[#363636] rounded-lg max-h-[600px] w-[330px] text-black p-4 bg-white m-auto"
      >
        <div class="space-y-7">
          <div class="space-y-2.5">
            <p v-if="props.depositType === 'deposit'" class="text-sm">
              Deposit Crypto to Gas Tank
            </p>
            <p v-else class="text-sm">Withdraw Crypto from Gas Tank</p>
            <p class="text-sm text-liquiddark leading-4">
              Declare the owner of the gas tank by signing a message with your
              wallet:
            </p>
          </div>
          <div v-if="isConnected">
            <div>
              <p class="text-[10px]">
                <span class="text-liquiddark">Total balance:</span>
                {{ walletBalance }}
              </p>
              <p class="text-[10px]">
                <span class="text-liquiddark">Total deposit:</span>
                {{ walletDeposit }}
              </p>
            </div>
            <label for="amount" class="text-xs text-black">Amount</label>
            <input
              v-model="depositAmount"
              :disabled="!isConnectedAddressSameAsOwner()"
              type="text"
              :class="{
                'bg-neutral-900 cursor-not-allowed':
                  !isConnectedAddressSameAsOwner(),
              }"
              class="text-sm bg-liquidlight p-[10px] w-full border-none outline-none rounded-md"
              name="amount"
            />
            <p
              v-if="!isConnectedAddressSameAsOwner()"
              class="text-xs mt-3 text-red-800"
            >
              Address of the connected wallet is different from this Gastank's
              owner address
            </p>
          </div>
          <div v-else>
            <span class="text-sm text-liquiddark leading-4">Tank Owner</span>
            <button
              class="uppercase border-2 text-sm w-full p-1 rounded-md bg-liquid text-black"
              @click.stop="connectToWallet(selectedGasTank.chainId)"
            >
              Connect Wallet
            </button>
          </div>
          <div class="space-x-2.5 flex justify-end">
            <button
              class="border-[1.5px] text-sm border-liquid w-[100px] p-2 rounded-3xl hover:text-pink"
              @click="emits('close')"
            >
              Cancel
            </button>
            <button
              class="bg-liquid text-sm text-black w-[100px] p-2 rounded-3xl transition-opacity duration-500"
              :disabled="!enableSave"
              :class="[
                !enableSave ? 'opacity-30' : 'opacity-100 hover:text-pink',
              ]"
              @click.prevent="onProceed"
            >
              Proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  </VOverlay>
</template>
