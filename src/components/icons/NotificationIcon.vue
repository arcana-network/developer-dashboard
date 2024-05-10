<script setup lang="ts">
import { computed, toRefs } from 'vue'

import NotificationIcon from '@/assets/iconography/notification.svg'
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
  <div class="relative cursor-pointer" @click="emits('click')">
    <div v-if="areUnreadNotificationAvaiable" class="notification-bubble">
      <span class="notification-bubble__count">{{
        formattedNotificationCount
      }}</span>
      <span class="notification-bubble__ripple"></span>
    </div>
    <img
      src="@/assets/iconography/notification.svg"
      class="cursor-pointer notification-icon"
      @click.stop="emits('click')"
    />
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
  font-size: 15px;
  color: #fff;
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
