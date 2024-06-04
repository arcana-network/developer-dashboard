<script setup lang="ts">
import { computed, toRefs } from 'vue'

import { useAppsStore } from '@/stores/apps.store'

const appStore = useAppsStore()
const { unreadNotificationCount } = toRefs(appStore)
const emits = defineEmits(['click'])

const formattedNotificationCount = computed(() => {
  const count = unreadNotificationCount.value || 0
  return count > 99 ? '99+' : unreadNotificationCount
})

const areUnreadNotificationAvaiable = computed(() => {
  return !!unreadNotificationCount.value
})
</script>

<template>
  <div class="relative cursor-pointer notification" @click="emits('click')">
    <div v-if="areUnreadNotificationAvaiable" class="notification-bubble">
      <span class="notification-bubble__count">1</span>
      <span class="notification-bubble__ripple"></span>
    </div>
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="cursor-pointer notification-icon"
      @click.stop="emits('click')"
    >
      <path
        d="M9.35418 21C10.0593 21.6224 10.9856 22 12 22C13.0145 22 13.9407 21.6224 14.6458 21M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 11.0902 5.22047 13.206 4.34967 14.6054C3.61513 15.7859 3.24786 16.3761 3.26133 16.5408C3.27624 16.7231 3.31486 16.7926 3.46178 16.9016C3.59446 17 4.19259 17 5.38886 17H18.6111C19.8074 17 20.4055 17 20.5382 16.9016C20.6851 16.7926 20.7238 16.7231 20.7387 16.5408C20.7521 16.3761 20.3849 15.7859 19.6503 14.6054C18.7795 13.206 18 11.0902 18 8Z"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </div>
</template>

<style scoped>
.notification-bubble {
  position: absolute;
  top: -8px;
  right: -8px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  min-height: 18px;
  padding: 1px;
  font-size: 10px;
  color: var(--primary-light);
  background: var(--primary);
  border-radius: 50%;
}

.notification-bubble__count {
  z-index: 999;
}

.notification-bubble__ripple {
  position: absolute;
  width: 16px;
  height: 16px;
  background: white;
  background: var(--primary);
  border-radius: 50%;
  animation: ripple 1s cubic-bezier(0.65, 0, 0.34, 1) 0s infinite;
}

.notification-icon {
  width: 22px;
}

.notification:hover svg {
  color: var(--secondary);
}

.notification:hover div {
  background: var(--secondary);
}

@keyframes ripple {
  from {
    opacity: 1;
    transform: scale3d(0.75, 0.75, 1);
  }

  to {
    opacity: 0;
    transform: scale3d(3, 3, 1);
  }
}
</style>
