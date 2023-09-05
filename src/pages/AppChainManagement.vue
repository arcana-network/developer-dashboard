<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'

import PlusIcon from '@/assets/iconography/plus.svg'
import AppChainManagementForm from '@/components/app-configure/chain-management/AppChainManagementForm.vue'
import ChainList from '@/components/app-configure/chain-management/AppChainManagementList.vue'
import DeleteChain from '@/components/app-configure/chain-management/DeleteChain.vue'
import { useToast } from '@/components/lib/VToast'
import SearchBar from '@/components/SearchBar.vue'
import { useAppsStore } from '@/stores/apps.store'
import { useChainManagementStore } from '@/stores/chainManagement.store'
import { useLoaderStore } from '@/stores/loader.store'

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

onMounted(async () => {
  try {
    showLoader('Please wait')
    await fetchAppChains()
  } catch (e) {
    console.log({ e })
  } finally {
    hideLoader()
  }
})

async function fetchAppChains() {
  const appId = route.params.appId
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
    showLoader('Please wait')
    const appId = route.params.appId
    const app = appStore.app(appId)
    if (formAction.value === 'add')
      await chainManagementStore.addAppChain(appId, formData, app.network)
    if (formAction.value === 'edit')
      await chainManagementStore.editAppChain(appId, formData, app.network)
  } catch (e) {
    const errorMessage = e.response?.data?.msg || 'Something went wrong'
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
  const appId = route.params.appId
  const app = appStore.app(appId)
  try {
    showDeleteChainModal.value = false
    showLoader('Please wait')
    const appId = route.params.appId
    await chainManagementStore.deleteAppChain(
      appId,
      Number(deleteChainId.value),
      app.network
    )
  } catch (e) {
    const errorMessage = e.response?.data?.msg || 'Something went wrong'
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
  const appId = route.params.appId
  const app = appStore.app(appId)
  try {
    showLoader('Please wait')
    const appId = route.params.appId
    await chainManagementStore.setAppDefaultChain(
      appId,
      Number(id),
      app.network
    )
  } catch (e) {
    const errorMessage = e.response?.data?.msg || 'Something went wrong'
    toast.error(errorMessage)
  } finally {
    await fetchAppChains()
    hideLoader()
  }
}

async function toggleChainStatus(chainData: object) {
  const appId = route.params.appId
  const app = appStore.app(appId)
  try {
    showLoader('Please wait')
    await chainManagementStore.toggleAppChainStatus(
      appId,
      chainData,
      app.network
    )
  } catch (e) {
    const errorMessage = e.response?.data?.msg || 'Something went wrong'
    toast.error(errorMessage)
  } finally {
    await fetchAppChains()
    hideLoader()
  }
}
</script>

<template>
  <div class="space-y-10 relative">
    <div class="space-y-[15px]">
      <h1 class="font-title text-[32px] leading-[150%] font-[700]">
        Chain Management
      </h1>
      <p class="font-body text-[14px] text-[#8D8D8D] leading-[150%]">
        Allow your users to use any of the chains that your application will
        support. Choose from the available chains or add custom chains that will
        be automatically added to your user’s wallets.
      </p>
    </div>
    <div class="flex flex-col space-y-5">
      <div class="flex items-baseline w-full justify-end space-x-5">
        <button
          class="text-white flex items-center space-x-1.5"
          @click="openForm('add')"
        >
          <img :src="PlusIcon" alt="Add Chain" class="w-3" />
          <span>Add Chain</span>
        </button>
        <SearchBar
          v-if="!chainManagementStore.areChainsEmpty"
          @search="onSearch"
        />
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
