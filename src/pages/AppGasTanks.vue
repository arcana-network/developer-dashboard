<script lang="ts" setup>
import { onMounted, ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'

import AppGaslessSmartContractForm from '@/components/app-configure/gasless/AppGaslessSmartContractForm.vue'
import AppGaslessTankList from '@/components/app-configure/gasless/AppGaslessTankList.vue'
import AppGaslessWhitelist from '@/components/app-configure/gasless/AppGaslessWhitelist.vue'
import AppGasTankDeposit from '@/components/app-configure/gasless/AppGasTankDeposit.vue'
import AppGasTankForm from '@/components/app-configure/gasless/AppGasTankForm.vue'
import { useToast } from '@/components/lib/VToast'
import SearchBar from '@/components/SearchBar.vue'
import { addGastank, changeGastankStatus } from '@/services/gateway.service'
import { useAppsStore } from '@/stores/apps.store'
import { useGaslessStore } from '@/stores/gasless.store'
import { useLoaderStore } from '@/stores/loader.store'

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

async function fetchGastankList() {
  try {
    showLoader('Please wait')
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
    showLoader('Please wait')
    const appId = route.params.appId
    const app = appStore.app(appId)
    const payload = {
      app_id: Number(appId),
      chain_id: formData.chainId,
      name: formData.name,
    }
    await addGastank(payload, app.network)
  } catch (e) {
    const errorMessage = e.response?.data?.err || 'Something went wrong'
    toast.error(errorMessage)
  } finally {
    await fetchGastankList()
    hideLoader()
  }
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

async function toggleChainStatus(info: object) {
  try {
    showLoader('Toggling...')
    const appId = route.params.appId
    const app = appStore.app(appId)
    const { id: tankId, enabled } = info
    const status = !enabled
    await changeGastankStatus(tankId, status, app.network)
    await fetchGastankList()
  } catch (e) {
    console.log(e, 'error')
  } finally {
    hideLoader()
  }
}
</script>

<template>
  <div class="space-y-10 relative">
    <div class="space-y-[15px]">
      <h1 class="font-title text-[32px] leading-[150%] font-[700]">
        Gas Tanks
      </h1>
      <p class="font-body text-[14px] text-[#8D8D8D] leading-[150%]">
        Gas tanks can be set up for every network chain that your app supports.
        Deposit crypto into these tanks to enable gasless transactions for users
        of your dApp. Withdraw crypto if you ever need to.
      </p>
    </div>
    <div class="flex flex-col space-y-5">
      <div class="flex items-baseline w-full justify-end space-x-5">
        <button class="text-white space-x-1.5" @click="showForm = true">
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
        @toggle-chain-status="toggleChainStatus"
      />
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
  </div>
</template>
