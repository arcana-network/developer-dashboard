<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import ConfirmDeletePopup from '@/components/app-configure/general/ConfirmDeletePopup.vue'
import DeleteTimerPopup from '@/components/app-configure/general/DeleteTimerPopup.vue'
import SettingCard from '@/components/app-configure/SettingCard.vue'
import VButton from '@/components/lib/VButton/VButton.vue'
import VCard from '@/components/lib/VCard/VCard.vue'
import VOverlay from '@/components/lib/VOverlay/VOverlay.vue'
import { useToast } from '@/components/lib/VToast'
import { deleteApp } from '@/services/gateway.service'
import { useAppStore } from '@/stores/app.store'
import { useLoaderStore } from '@/stores/loader.store'

const router = useRouter()
const appStore = useAppStore()
const loaderStore = useLoaderStore()
const toast = useToast()

const showDeletePopup = ref(false)
const showDeleteTimerPopup = ref(false)

function handleProceedDeletion() {
  showDeleteTimerPopup.value = true
  showDeletePopup.value = false
}

async function handleAppDeletion() {
  showDeleteTimerPopup.value = false
  loaderStore.showLoader('Deleting App...')
  try {
    await deleteApp()
    appStore.$reset()
    toast.success('App deleted successfully')
    router.push({ name: 'CreateApp', params: { appId: appStore.appId } })
  } catch (e) {
    console.error(e)
    toast.error(
      'Unable to delete the app at the moment. Please try again or contact support'
    )
  } finally {
    loaderStore.hideLoader()
  }
}
</script>

<template>
  <section name="configure-app-controls">
    <SettingCard>
      <template #title>Controls</template>
      <VButton
        label="DELETE"
        variant="secondary"
        class="delete-button"
        @click.stop="showDeletePopup = true"
      />
    </SettingCard>
    <VOverlay v-if="showDeletePopup || showDeleteTimerPopup">
      <VCard class="modal-card">
        <ConfirmDeletePopup
          v-if="showDeletePopup"
          @cancel="showDeletePopup = false"
          @proceed="handleProceedDeletion"
        />
        <DeleteTimerPopup
          v-if="showDeleteTimerPopup"
          @cancel="showDeleteTimerPopup = false"
          @delete="handleAppDeletion"
        />
      </VCard>
    </VOverlay>
  </section>
</template>

<style scoped>
.delete-button {
  align-self: flex-start;
}

.modal-card {
  position: fixed;
  top: 50%;
  left: 50%;
  flex-direction: column;
  gap: 1vh;
  width: 72%;
  min-width: 200px;
  max-width: 560px;
  padding: 4em 2em;
  transform: translate(-50%, -50%);
}
</style>
