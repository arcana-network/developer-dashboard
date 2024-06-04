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
  if (appsStore.unreadNotificationCount) {
    appsStore.updateNotificationReadStatus(
      notifications.value.map((item) => item.id)
    )
  }
  close()
}

function onClickofItem(notification) {
  const { type, id, read } = notification
  if (type === 'billing')
    router.push({ name: 'AppProfile', params: { scrollTo: 'billing' } })
  else if (type === 'invoice') router.push({ name: 'AppInvoices' })
  if (!read) appsStore.updateNotificationReadStatus([id])
  close()
}
</script>

<template>
  <VCard class="absolute z-[999] flex flex-col p-2 | notification__container">
    <div
      class="flex items-center justify-between w-full h-[50px] border-b-[1px] border-b-[#8d8d8d33]"
    >
      <p class="text-lg">Notifications</p>
      <div class="flex items-center">
        <button
          v-show="appsStore.unreadNotificationCount"
          class="bg-transparent border-none outline-none cursor-pointer text-sm text-black | notification__mark-read-btn"
          @click="markAllRead"
        >
          Mark all as read
        </button>
        <button
          class="bg-transparent border-none outline-none cursor-pointer h-3 p-0 | notification__close-btn"
          @click="close"
        >
          <img src="@/assets/iconography/close.svg" alt="close" class="h-3" />
        </button>
      </div>
    </div>
    <div class="flex-1 py-2 px-0 overflow-auto">
      <AppNotificationsItem
        :notifications="notifications"
        @onClickofItem="onClickofItem"
      />
    </div>
  </VCard>
</template>

<style scoped>
.notification__close-btn {
  display: none;
}

.notification__container {
  top: 25px;
  right: -10px;
  width: 380px;
  max-height: 380px;
  border: #d9d9d9 1px solid;
}

@media only screen and (max-width: 767px) {
  .notification__close-btn {
    display: block;
  }

  .notification__container {
    top: 0;
    right: 0;
    width: 100vw;
    height: 100vh;
    border-radius: 0;
  }

  .notification__mark-read-btn {
    margin-right: 15px;
  }
}
</style>
