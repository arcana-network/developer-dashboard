<script lang="ts" setup>
import { ethers } from 'ethers'
import { onMounted, ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'

import AddressSwitchConfirmation from '@/components/app-configure/gasless/AddressSwitchConfirmation.vue'
import AppGaslessSmartContractForm from '@/components/app-configure/gasless/AppGaslessSmartContractForm.vue'
import AppGaslessTankList from '@/components/app-configure/gasless/AppGaslessTankList.vue'
import AppGaslessWhitelist from '@/components/app-configure/gasless/AppGaslessWhitelist.vue'
import AppGasTankDeposit from '@/components/app-configure/gasless/AppGasTankDeposit.vue'
import AppGasTankForm from '@/components/app-configure/gasless/AppGasTankForm.vue'
import AppHeader from '@/components/AppHeader.vue'
import { useToast } from '@/components/lib/VToast'
import SearchBar from '@/components/SearchBar.vue'
import {
  getFundingMessage,
  updateSignature,
  addGastank,
  changeGastankStatus,
} from '@/services/gateway.service'
import { useAppsStore } from '@/stores/apps.store'
import { useChainManagementStore } from '@/stores/chainManagement.store'
import { useGaslessStore } from '@/stores/gasless.store'
import { useLoaderStore } from '@/stores/loader.store'
import { useWalletStore } from '@/stores/wallet.store'
import { connectWallet } from '@/utils/connectToMetaMask'
import { content, errors } from '@/utils/content'

type DepositType = 'deposit' | 'withdraw'
type SmartContractFormType = 'add' | 'edit'
type SmartContractForm = {
  show: boolean
  type: SmartContractFormType
}

const showForm = ref(false)
const route = useRoute()
const toast = useToast()
const appStore = useAppsStore()
const gaslessStore = useGaslessStore()
const walletStore = useWalletStore()
const chainStore = useChainManagementStore()
const { showLoader, hideLoader } = useLoaderStore()
const showDepositForm = ref(false)
const showWhitelistForm = ref(false)
const showSmartContractForm: Ref<SmartContractForm> = ref({
  show: false,
  type: 'add',
})
const editSmartContractInfo = ref({})
const depositTankId = ref(null)
const depositType: Ref<DepositType | null> = ref(null)
const showAddressSwitchConfirmation = ref(false)
const gastankInfoForSwitchingAddress: Ref<object | null> = ref(null)

async function fetchGastankList() {
  try {
    showLoader(errors.GENERIC.WAIT)
    const appId = route.params.appId
    const app = appStore.app(appId)
    await gaslessStore.getGastankList(appId, app.network)
  } catch (e) {
    console.log({ e })
  } finally {
    hideLoader()
  }
}

onMounted(fetchGastankList)

async function onFormSubmit(formData: object) {
  try {
    showForm.value = false
    showLoader(errors.GENERIC.WAIT)
    const appId = route.params.appId
    const app = appStore.app(appId)
    const payload = {
      app_id: Number(appId),
      chain_id: formData.chainId,
      name: formData.name,
    }
    const provider = await connectWallet(formData.chainId, chainStore.allChains)
    walletStore.setWalletProvider(provider)
    payload.owner = provider.selectedAddress
    const gasTankInfo = (await addGastank(payload, app.network)).data
    const gasTankId = gasTankInfo.ID
    await setupGasTank(gasTankId)
    toast.success(content.GAS_TANK.ADDED)
  } catch (e) {
    const errorMessage =
      e.response?.data?.err || errors.GENERIC.SOMETHING_WENT_WRONG
    toast.error(errorMessage)
  } finally {
    await fetchGastankList()
    hideLoader()
  }
}

async function setupGasTank(gasTankId: number) {
  showLoader(content.GAS_TANK.SETUP)
  const appId = route.params.appId
  const app = appStore.app(appId)
  const { data } = (await getFundingMessage(app.network, appId as string)).data
  const fundingMessage = data.fundingMessage
  const web3Provider = new ethers.providers.Web3Provider(walletStore.provider)
  const wallet = await web3Provider.getSigner()
  const owner = await wallet.getAddress()
  const signature = await wallet.signMessage(fundingMessage)
  await updateSignature(owner, gasTankId, signature, app.network)
  toast.success(content.GAS_TANK.SETUP_COMPLETE)
}

function onSearch(value: string) {
  gaslessStore.chainSearchText = value
}

function onAddContract() {
  showSmartContractForm.value.show = true
  showSmartContractForm.value.type = 'add'
  showWhitelistForm.value = false
}

function deposit(tankId) {
  showDepositForm.value = true
  depositTankId.value = tankId
  depositType.value = 'deposit'
}

function withdraw(tankId) {
  showDepositForm.value = true
  depositTankId.value = tankId
  depositType.value = 'withdraw'
}

function whitelist(tankId) {
  showWhitelistForm.value = true
  depositTankId.value = tankId
}

function editWhitelist(info) {
  showSmartContractForm.value.show = true
  showSmartContractForm.value.type = 'edit'
  showWhitelistForm.value = false
  editSmartContractInfo.value = info
}

async function hideSmartContractForm() {
  showSmartContractForm.value.show = false
  await fetchGastankList()
}

function onToggleChainStatus(info: object) {
  showAddressSwitchConfirmation.value = true
  gastankInfoForSwitchingAddress.value = info
}

async function toggleChainStatus(info: object) {
  showAddressSwitchConfirmation.value = false
  gastankInfoForSwitchingAddress.value = null
  try {
    showLoader(content.GENERIC.TOGGLING)
    const appId = route.params.appId
    const app = appStore.app(appId)
    const { id: tankId, enabled } = info
    const status = !enabled
    await changeGastankStatus(tankId, status, app.network)
    await fetchGastankList()
  } catch (e) {
    console.log(e, errors.GENERIC.ERROR)
  } finally {
    hideLoader()
  }
}
</script>

<template>
  <div class="space-y-10 relative">
    <div class="space-y-[15px]">
      <h1>Gas Tanks</h1>
      <p class="font-body text-[14px] text-liquiddark leading-[150%]">
        Gas tanks can be set up for every network chain that your app supports.
        Deposit crypto into these tanks to enable gasless transactions for users
        of your dApp. Withdraw crypto if you ever need to.
      </p>
    </div>
    <div class="flex flex-col space-y-5">
      <div class="flex items-baseline w-full justify-end space-x-5">
        <button class="text-black space-x-1.5" @click="showForm = true">
          <span>Add Gas Tank</span>
        </button>
        <SearchBar
          v-if="!gaslessStore.areGastankListEmpty"
          @search="onSearch"
        />
      </div>
      <AppGaslessTankList
        @deposit="deposit"
        @manage-whitelist="whitelist"
        @withdraw="withdraw"
        @toggle-chain-status="onToggleChainStatus"
      />
      <div class="flex items-center justify-end">
        <p class="font-normal text-xs">Powered by</p>
        <img
          src="@/assets/biconomy-logo.png"
          alt="biconomy logo"
          class="h-5 w-16"
        />
      </div>
    </div>
    <AppGasTankForm
      v-if="showForm"
      @close="showForm = false"
      @submit="onFormSubmit"
    />
    <AppGasTankDeposit
      v-if="showDepositForm"
      :deposit-tank-id="depositTankId"
      :deposit-type="depositType"
      @close="showDepositForm = false"
    />
    <AppGaslessWhitelist
      v-if="showWhitelistForm"
      :gas-tank-id="depositTankId"
      @edit="editWhitelist"
      @cancel="showWhitelistForm = false"
      @add-contract="onAddContract"
    />
    <AppGaslessSmartContractForm
      v-if="showSmartContractForm.show"
      :form-type="showSmartContractForm.type"
      :deposit-tank-id="depositTankId"
      :edit-smart-contract-info="editSmartContractInfo"
      @close="hideSmartContractForm"
    />
    <AddressSwitchConfirmation
      v-if="showAddressSwitchConfirmation"
      :info="gastankInfoForSwitchingAddress"
      @proceed="toggleChainStatus"
      @close="showAddressSwitchConfirmation = false"
    />
  </div>
</template>
