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
  <VCard
    class="absolute z-overlay flex flex-col p-2 top-px25 right-px-10 w-px380 max-h-px380 border border-system-light_gray max-md:top-0 max-md:right-0 max-md:w-screen max-md:h-screen max-md:rounded-none max-md:rounded-lg"
  >
    <div
      class="flex items-center justify-between w-full h-px50 border-b-px1 border-b-system-smoke"
    >
      <p class="text-lg">Notifications</p>
      <div class="flex items-center">
        <button
          v-show="appsStore.unreadNotificationCount"
          class="bg-transparent border-none outline-none cursor-pointer text-sm text-black_solid-default max-md:mr-px15"
          @click="markAllRead"
        >
          Mark all as read
        </button>
        <button
          class="bg-transparent border-none outline-none cursor-pointer h-3 p-0 hidden max-md:block"
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
