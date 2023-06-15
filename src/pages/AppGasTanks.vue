<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import PlusIcon from '@/assets/iconography/plus.svg'
import AppGaslessTankList from '@/components/app-configure/gasless/AppGaslessTankList.vue'
import AppGasTankDeposit from '@/components/app-configure/gasless/AppGasTankDeposit.vue'
import AppGasTankForm from '@/components/app-configure/gasless/AppGasTankForm.vue'
import { useToast } from '@/components/lib/VToast'
import SearchBar from '@/components/SearchBar.vue'
import { addGastank } from '@/services/gateway.service'
import { useAppsStore } from '@/stores/apps.store'
import { useGaslessStore } from '@/stores/gasless.store'
import { useLoaderStore } from '@/stores/loader.store'

const showForm = ref(false)
const route = useRoute()
const toast = useToast()
const appStore = useAppsStore()
const gaslessStore = useGaslessStore()
const { showLoader, hideLoader } = useLoaderStore()
const showDepositForm = ref(false)

async function fetchGastankList() {
  const appId = route.params.appId
  const app = appStore.app(appId)
  await gaslessStore.getGastankList(appId, app.network)
}

onMounted(async () => {
  try {
    showLoader('Please wait')
    await fetchGastankList()
  } catch (e) {
    console.log({ e })
  } finally {
    hideLoader()
  }
})

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
        <button
          class="text-white flex items-center space-x-1.5"
          @click="showForm = true"
        >
          <img :src="PlusIcon" alt="Add Chain" class="w-3" />
          <span>Add Gas Tank</span>
        </button>
        <SearchBar
          v-if="!gaslessStore.areGastankListEmpty"
          @search="onSearch"
        />
      </div>
      <AppGaslessTankList @deposit="showDepositForm = true" />
    </div>
    <AppGasTankForm
      v-if="showForm"
      @close="showForm = false"
      @submit="onFormSubmit"
    />
    <AppGasTankDeposit
      v-if="showDepositForm"
      @cancel="showDepositForm = false"
    />
  </div>
</template>
