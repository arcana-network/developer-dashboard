<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import ConfirmDeletePopup from '@/components/app-configure/general/ConfirmDeletePopup.vue'
import DeleteTimerPopup from '@/components/app-configure/general/DeleteTimerPopup.vue'
import SettingCard from '@/components/app-configure/SettingCard.vue'
import FullScreenLoader from '@/components/FullScreenLoader.vue'
import VButton from '@/components/lib/VButton/VButton.vue'
import VCard from '@/components/lib/VCard/VCard.vue'
import VOverlay from '@/components/lib/VOverlay/VOverlay.vue'
import appConfigService from '@/services/app-config.service'

const router = useRouter()

const showDeletePopup = ref(false)
const showDeleteTimerPopup = ref(false)
const isLoading = ref(false)
const loadingMessage = ref('')

function handleProceedDeletion() {
  showDeleteTimerPopup.value = true
  showDeletePopup.value = false
}

async function handleAppDeletion() {
  showDeleteTimerPopup.value = false
  isLoading.value = true
  loadingMessage.value = 'Deleting App...'
  await appConfigService.deleteApp()
  isLoading.value = false
  router.push('/')
}
</script>

<template>
  <section name="configure-app-controls">
    <SettingCard>
      <template #title>Controls</template>
      <template #description
        >Lorem ipsum dolor sit amet, consectetuer adipiscing elit, Lorem ipsum
        dolor sit amet, consectetuer adipiscing elit.</template
      >
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
  <FullScreenLoader v-if="isLoading" :message="loadingMessage" />
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
