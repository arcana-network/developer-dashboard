<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'

import PlusIcon from '@/assets/iconography/plus.svg'
import AppChainManagementForm from '@/components/app-configure/chain-management/AppChainManagementForm.vue'
import ChainList from '@/components/app-configure/chain-management/AppChainManagementList.vue'
import DeleteChain from '@/components/app-configure/chain-management/DeleteChain.vue'
import SearchBar from '@/components/SearchBar.vue'
import { useChainManagementStore } from '@/stores/chainManagement.store'

type FormAction = 'add' | 'edit'

const chainManagementStore = useChainManagementStore()
const route = useRoute()

const showForm = ref(false)
const formAction: Ref<FormAction> = ref('add')
const editChainId = ref('')
const showDeleteChainModal = ref(false)
const deleteChainId = ref('')

onMounted(async () => {
  const appId = route.params.appId
  await chainManagementStore.getAppChains(appId)
})

function openForm(formActionVal: FormAction, chainId?: string) {
  showForm.value = true
  formAction.value = formActionVal
  if (chainId) editChainId.value = chainId
}

function hideForm() {
  showForm.value = false
}

function onChainFormSubmit(formData: object) {
  const appId = route.params.appId
  if (formAction.value === 'add')
    chainManagementStore.addAppChain(appId, formData)
  if (formAction.value === 'edit')
    chainManagementStore.editAppChain(appId, formData)
  showForm.value = false
}

function onDeleteChain({ chainId }: { chainId: string }) {
  showDeleteChainModal.value = true
  deleteChainId.value = chainId
}

function deleteChain() {
  const appId = route.params.appId
  chainManagementStore.deleteAppChain(appId, deleteChainId.value)
  showDeleteChainModal.value = false
}

function onSearch(value: string) {
  chainManagementStore.chainSearchText = value
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
        @edit="({ chainId }) => openForm('edit', chainId)"
        @delete="onDeleteChain"
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
      @cancel="showDeleteChainModal = false"
      @delete="deleteChain"
    />
  </div>
</template>
