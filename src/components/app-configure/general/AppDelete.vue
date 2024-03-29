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
import { content, errors } from '@/utils/content'

const router = useRouter()
const loaderStore = useLoaderStore()
const toast = useToast()
const appsStore = useAppsStore()

const showDeletePopup = ref(true)
const showDeleteTimerPopup = ref(false)

type DeleteProp = {
  appId?: number
}

const emit = defineEmits(['close'])
const props = defineProps<DeleteProp>()

function handleProceedDeletion() {
  showDeleteTimerPopup.value = true
  showDeletePopup.value = false
}

async function handleAppDeletion() {
  showDeleteTimerPopup.value = false
  emit('close')
  loaderStore.showLoader(content.APP.DELETE_APP.DELETING)
  try {
    const appId = props.appId as number
    const app = appsStore.app(appId)
    const globalAppNetwork = app.network === 'mainnet' ? 'testnet' : 'mainnet'
    if (app.global_id) {
      await deleteApp(app.global_id, globalAppNetwork)
    }
    await deleteApp(appId, app.network)
    appsStore.deleteApp(appId, app.network)
    if (app.global_id) {
      appsStore.deleteApp(app.global_id, globalAppNetwork)
    }
    toast.success(content.APP.DELETE_APP.SUCCESS)
    router.push({ name: 'ManageApps' })
  } catch (e) {
    console.error(e)
    toast.error(errors.APP.DELETE_APP.ERROR)
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
        :app-id="props.appId"
        @cancel="handleCancel"
        @proceed="handleProceedDeletion"
      />
      <DeleteTimerPopup
        v-if="showDeleteTimerPopup"
        :app-id="props.appId"
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
