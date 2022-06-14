<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'

import CloseIcon from '@/components/icons/CloseIcon.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import type { ToastMessage } from '@/store/toast.store'

const store = useStore()

const toastMessages = computed(() => store.getters.toastMessages)

function handleCloseToast(toastMessage: ToastMessage) {
  store.dispatch('closeToast', toastMessage)
}
</script>

<template>
  <VStack class="v-toast-container" direction="column" gap="1rem">
    <div
      v-for="toastMessage in toastMessages"
      :key="`toast-message-${toastMessage.id}`"
      class="v-toast"
      :class="{
        success: toastMessage.type === 'success',
        error: toastMessage.type === 'error',
        show: toastMessage.show,
      }"
    >
      <VStack justify="space-between" align="start" gap="0.5rem">
        <span class="body-2 font-500 v-toast-message">
          {{ toastMessage.message }}
        </span>
        <span
          class="v-toast-close"
          @click.stop="handleCloseToast(toastMessage)"
        >
          <CloseIcon color="#181818" />
        </span>
      </VStack>
    </div>
  </VStack>
</template>

<style scoped>
.v-toast-container {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 10000000;
  width: 22rem;
  padding: 2rem;
}

.v-toast {
  padding: 1rem 1.5rem;
  border-radius: 10px;
  box-shadow: 0 10px 20px rgb(75 50 50 / 50%);
  opacity: 0;
  transition: transform 300ms, opacity 300ms;
  transform: translateX(26rem);
}

.v-toast.show {
  opacity: 1;
  transform: translateX(0);
}

.v-toast.success {
  background-color: var(--color-green);
}

.v-toast.error {
  background-color: var(--color-orange);
}

.v-toast-close {
  width: 1rem;
  height: 1rem;
  cursor: pointer;
}

.v-toast-message {
  color: var(--dark-theme-bg);
}
</style>
