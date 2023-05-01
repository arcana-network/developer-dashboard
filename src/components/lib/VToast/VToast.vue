<script setup lang="ts">
import { computed } from 'vue'

import CloseIcon from '@/components/icons/CloseIcon.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import { useToastStore, type ToastMessage } from '@/stores/toast.store'

const toastStore = useToastStore()

const toastMessages = computed(() => toastStore.messages)

function handleCloseToast(toastMessage: ToastMessage) {
  toastStore.removeToast(toastMessage)
}
</script>

<template>
  <VStack
    class="v-toast-container"
    :style="{ padding: toastMessages.length ? '2rem' : '0' }"
    direction="column"
    gap="1rem"
  >
    <TransitionGroup name="v-toast-slide">
      <div
        v-for="toastMessage in toastMessages"
        :key="`toast-message-${toastMessage.id}`"
        class="v-toast"
        :class="toastMessage.type"
      >
        <VStack justify="space-between" align="start" gap="0.5rem">
          <span class="body-2 font-medium v-toast-message">
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
    </TransitionGroup>
  </VStack>
</template>

<style scoped>
.v-toast-container {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 10000000;
  width: 22rem;
  transition: padding 300ms;
}

.v-toast {
  padding: 1rem 1.5rem;
  border-radius: 10px;
  box-shadow: 0 10px 20px rgb(75 50 50 / 50%);
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
  opacity: 1;
  transition: opacity 150ms ease-in;
}

.v-toast-close:hover,
.v-toast-close:focus {
  opacity: 0.5;
}

.v-toast-message {
  color: var(--dark-theme-bg);
}

.v-toast-slide-enter-active,
.v-toast-slide-leave-active,
.v-toast-slide-move {
  transition: all 300ms ease-out;
}

.v-toast-slide-enter-from,
.v-toast-slide-leave-to {
  opacity: 0;
  transform: translateX(26rem);
}

.v-toast-slide-leave-active {
  position: absolute;
}
</style>
