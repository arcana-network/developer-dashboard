<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import ConfirmDeletePopup from '@/components/app-configure/general/ConfirmDeletePopup.vue'
import DeleteTimerPopup from '@/components/app-configure/general/DeleteTimerPopup.vue'
import VCard from '@/components/lib/VCard/VCard.vue'
import VOverlay from '@/components/lib/VOverlay/VOverlay.vue'
import { useToast } from '@/components/lib/VToast'
import { deleteApp } from '@/services/gateway.service'
import { useAppsStore } from '@/stores/apps.store'
import { useLoaderStore } from '@/stores/loader.store'

const router = useRouter()
const loaderStore = useLoaderStore()
const toast = useToast()
const appsStore = useAppsStore()

const showDeletePopup = ref(true)
const showDeleteTimerPopup = ref(false)
let appsToDelete = { mainnet: false, testnet: false }

type DeleteProp = {
  appId?: number
}

const emit = defineEmits(['close'])
const props = defineProps<DeleteProp>()

function handleProceedDeletion({ networks }) {
  appsToDelete = networks
  showDeleteTimerPopup.value = true
  showDeletePopup.value = false
}

async function handleAppDeletion() {
  showDeleteTimerPopup.value = false
  emit('close')
  loaderStore.showLoader('Deleting App...')
  try {
    const testnetAppId = props.appId as number
    const app = appsStore.app(testnetAppId)
    const mainnetAppId = app.network === 'mainnet' ? app.id : app.global_id
    if (appsToDelete.mainnet) {
      await deleteApp(mainnetAppId, 'mainnet')
      appsStore.deleteApp(mainnetAppId, 'mainnet')
    }
    if (appsToDelete.testnet) {
      await deleteApp(testnetAppId, 'testnet')
      appsStore.deleteApp(testnetAppId, 'testnet')
    }
    toast.success('App deleted successfully')
    router.push({ name: 'ManageApps' })
  } catch (e) {
    console.error(e)
    toast.error(
      'Unable to delete the app at the moment. Please try again or contact support'
    )
  } finally {
    loaderStore.hideLoader()
  }
}

function handleCancel() {
  emit('close')
}
</script>

<template>
  <VOverlay>
    <VCard class="modal-card">
      <ConfirmDeletePopup
        v-if="showDeletePopup"
        @cancel="handleCancel"
        @proceed="handleProceedDeletion"
      />
      <DeleteTimerPopup
        v-if="showDeleteTimerPopup"
        @cancel="handleCancel"
        @delete="handleAppDeletion"
      />
    </VCard>
  </VOverlay>
</template>

<style scoped>
.modal-card {
  position: fixed;
  top: 50%;
  left: 50%;
  flex-direction: column;
  gap: 1vh;
  width: 72%;
  min-width: 200px;
  max-width: 560px;
  padding: 2em;
  transform: translate(-50%, -50%);
}
</style>
