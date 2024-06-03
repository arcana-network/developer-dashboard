<script setup lang="ts">
import { computed, onMounted, ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'

import AppChainManagementForm from '@/components/app-configure/chain-management/AppChainManagementForm.vue'
import ChainList from '@/components/app-configure/chain-management/AppChainManagementList.vue'
import ChainTypeSelection from '@/components/app-configure/chain-management/ChainTypeSelection.vue'
import DeleteChain from '@/components/app-configure/chain-management/DeleteChain.vue'
import { useToast } from '@/components/lib/VToast'
import SearchBar from '@/components/SearchBar.vue'
import { updateSelectedChainType } from '@/services/gateway.service'
import { useAppsStore } from '@/stores/apps.store'
import { useChainManagementStore } from '@/stores/chainManagement.store'
import { useLoaderStore } from '@/stores/loader.store'
import { errors } from '@/utils/content'

type FormAction = 'add' | 'edit'

const chainManagementStore = useChainManagementStore()
const route = useRoute()
const appStore = useAppsStore()

const showForm = ref(false)
const formAction: Ref<FormAction> = ref('add')
const editChainId = ref('')
const showDeleteChainModal = ref(false)
const deleteChainId = ref('')
const { showLoader, hideLoader } = useLoaderStore()
const toast = useToast()
const selectedChainTypeCurve = computed(() => {
  return chainManagementStore.selectedChainType?.toLowerCase() || 'evm'
})

onMounted(async () => {
  try {
    showLoader(errors.GENERIC.WAIT)
    await fetchAppChains()
  } catch (e) {
    console.log({ e })
  } finally {
    hideLoader()
  }
})

async function fetchAppChains() {
  const appId = Number(route.params.appId)
  const app = appStore.app(appId)
  await chainManagementStore.getAppChains(appId, app.network)
  await chainManagementStore.getGaslessChains(app.network)
}

function openForm(formActionVal: FormAction, id?: string) {
  showForm.value = true
  formAction.value = formActionVal
  if (id) editChainId.value = id
}

function hideForm() {
  showForm.value = false
}

async function onChainFormSubmit(formData: object) {
  try {
    showForm.value = false
    showLoader(errors.GENERIC.WAIT)
    const appId = Number(route.params.appId)
    const app = appStore.app(appId)
    if (formAction.value === 'add')
      await chainManagementStore.addAppChain(appId, formData, app.network)
    if (formAction.value === 'edit')
      await chainManagementStore.editAppChain(appId, formData, app.network)
  } catch (e: any) {
    const errorMessage =
      e.response?.data?.msg || errors.GENERIC.SOMETHING_WENT_WRONG
    toast.error(errorMessage)
  } finally {
    await fetchAppChains()
    hideLoader()
  }
}

function onDeleteChain({ id }: { id: string }) {
  deleteChainId.value = id
  showDeleteChainModal.value = true
}

async function deleteChain() {
  const appId = Number(route.params.appId)
  const app = appStore.app(appId)
  try {
    showDeleteChainModal.value = false
    showLoader(errors.GENERIC.WAIT)
    const appId = Number(route.params.appId)
    await chainManagementStore.deleteAppChain(
      appId,
      Number(deleteChainId.value),
      app.network
    )
  } catch (e: any) {
    const errorMessage =
      e.response?.data?.msg || errors.GENERIC.SOMETHING_WENT_WRONG
    toast.error(errorMessage)
  } finally {
    await fetchAppChains()
    hideLoader()
  }
}

function onSearch(value: string) {
  chainManagementStore.chainSearchText = value
}

async function setDefaultChain({ id }: { id: string }) {
  const appId = Number(route.params.appId)
  const app = appStore.app(appId)
  try {
    showLoader(errors.GENERIC.WAIT)
    await chainManagementStore.setAppDefaultChain(
      appId,
      Number(id),
      app.network
    )
  } catch (e: any) {
    const errorMessage =
      e.response?.data?.msg || errors.GENERIC.SOMETHING_WENT_WRONG
    toast.error(errorMessage)
  } finally {
    await fetchAppChains()
    hideLoader()
  }
}

async function toggleChainStatus(chainData: object) {
  const appId = Number(route.params.appId)
  const app = appStore.app(appId)
  try {
    showLoader(errors.GENERIC.WAIT)
    await chainManagementStore.toggleAppChainStatus(
      appId,
      chainData,
      app.network
    )
  } catch (e: any) {
    const errorMessage =
      e.response?.data?.msg || errors.GENERIC.SOMETHING_WENT_WRONG
    toast.error(errorMessage)
  } finally {
    await fetchAppChains()
    hideLoader()
  }
}

async function setSelectedChainTypeCurve($event: string) {
  const appId = Number(route.params.appId)
  const app = appStore.app(appId)
  await updateSelectedChainType(appId, app.network, $event)
  chainManagementStore.selectedChainType = $event?.toLowerCase() || 'evm'
}
</script>

<template>
  <div class="space-y-10 relative">
    <div class="space-y-[15px]">
      <h1>Chain Management</h1>
      <p class="font-body text-[14px] text-liquiddark leading-[150%]">
        Allow your users to use any of the chains that your application will
        support. Choose from the available chains or add custom chains that will
        be automatically added to your user’s wallets.
      </p>
    </div>
    <div class="flex flex-col space-y-5">
      <div class="flex w-full justify-between gap-5 items-center">
        <!-- <div class="flex gap-2 items-center">
          <span class="text-liquiddark text-xs">Chain Type</span>
          <ChainTypeSelection
            :selected-chain-type-curve="selectedChainTypeCurve"
            disabled
            @update:selected-chain-type-curve="setSelectedChainTypeCurve"
          />
          <span>${selectedChainTypeCurve}</span>
        </div> -->
        <div class="flex items-center flex-grow justify-end space-x-5">
          <button
            v-if="
              chainManagementStore.selectedChainType?.toLowerCase() === 'evm'
            "
            class="text-black flex items-center space-x-1.5 hover:text-pink"
            @click="openForm('add')"
          >
            <span>Add Chain</span>
          </button>
          <SearchBar
            v-if="!chainManagementStore.areChainsEmpty"
            @search="onSearch"
          />
        </div>
      </div>
      <ChainList
        @edit="({ id }) => openForm('edit', id)"
        @delete="onDeleteChain"
        @set-as-default="setDefaultChain"
        @toggle-chain-status="toggleChainStatus"
      />
    </div>
    <AppChainManagementForm
      v-if="showForm"
      :form-action="formAction"
      :edit-chain-id="editChainId"
      @close="hideForm"
      @submit="onChainFormSubmit"
    />
    <DeleteChain
      v-if="showDeleteChainModal"
      :delete-chain-id="deleteChainId"
      @cancel="showDeleteChainModal = false"
      @delete="deleteChain"
    />
  </div>
</template>
