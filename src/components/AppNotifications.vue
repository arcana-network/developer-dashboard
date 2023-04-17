<script lang="ts" setup>
import { toRefs } from 'vue'
import { useRouter } from 'vue-router'

import AppNotificationsItem from '@/components/AppNotificationsItem.vue'
import VCard from '@/components/lib/VCard/VCard.vue'
import { useAppsStore } from '@/stores/apps.store'

const emits = defineEmits(['close'])
const appsStore = useAppsStore()
const router = useRouter()

const { notifications } = toRefs(appsStore)

function close() {
  emits('close')
}

function markAllRead() {
  appsStore.updateNotificationReadStatus(
    notifications.value.map((item) => item.id)
  )
  close()
}

function onClickofItem(notification) {
  const type = notification.type
  if (type === 'billing') router.push({ name: 'AppProfile' })
  else if (type === 'invoice') router.push({ name: 'AppInvoices' })
  close()
}
</script>

<template>
  <VCard class="position-absolute notification__container">
    <div
      class="flex flex-center justify-space-between width-100 | notification__header"
    >
      <p class="notification__title">Notifications</p>
      <div class="flex flex-center">
        <button
          class="btn cursor-pointer | notification__mark-read-btn"
          @click="markAllRead"
        >
          Mark all as read
        </button>
        <button
          class="btn cursor-pointer | notification__close-btn"
          @click="close"
        >
          <img
            src="@/assets/iconography/close.svg"
            alt="close"
            class="notification__close-btn-img"
          />
        </button>
      </div>
    </div>
    <div class="notification__body">
      <AppNotificationsItem
        :notifications="notifications"
        @onClickofItem="onClickofItem"
      />
    </div>
  </VCard>
</template>

<style scoped>
.btn {
  height: 18px;
  background: transparent;
  border: none;
  outline: none;
}

.notification__close-btn {
  display: none;
  height: 12px;
  padding: 0;
}

.notification__close-btn-img {
  height: 12px;
}

.notification__mark-read-btn {
  font-size: 14px;
  color: #13a3fd;
}

.notification__container {
  top: 25px;
  right: -10px;
  z-index: 999;
  display: flex;
  flex-direction: column;
  width: 380px;
  max-height: 380px;
  padding: 16px;
  font-family: var(--font-body);
}

.notification__title {
  font-size: 18px;
}

.notification__header {
  height: 50px;
}

.notification__body {
  flex: 1;
  padding: 20px 0;
  overflow: auto;
}

@media only screen and (max-width: 767px) {
  .notification__close-btn {
    display: block;
  }

  .notification__container {
    top: 0;
    right: 0;
    box-sizing: border-box;
    width: 100vw;
    height: 100vh;
    border-radius: 0;
  }

  .notification__mark-read-btn {
    margin-right: 15px;
  }
}
</style>
