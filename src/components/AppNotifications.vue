<script lang="ts" setup>
import { toRefs } from 'vue'

import AppNotificationsItem from '@/components/AppNotificationsItem.vue'
import VCard from '@/components/lib/VCard/VCard.vue'
import { useAppsStore } from '@/stores/apps.store'

const emits = defineEmits(['close'])
const appsStore = useAppsStore()

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
</script>

<template>
  <div>
    <VCard class="notification-items position-absolute mobile-hide">
      <div
        class="flex flex-center justify-space-between width-100 notification-title-container"
      >
        <p class="notification-title">Notifications</p>
        <button
          class="notification-read-btn cursor-pointer"
          @click="markAllRead"
        >
          Mark all as read
        </button>
      </div>
      <AppNotificationsItem :notifications="notifications" />
    </VCard>
    <VCard
      class="notification-items__mobile position-absolute tablet-hide laptop-hide"
    >
      <div class="flex flex-start width-100 notification-title-container">
        <p class="notification-title">Notifications</p>
        <div class="flex flex-baseline">
          <button
            class="notification-read-btn cursor-pointer"
            @click="markAllRead"
          >
            Mark all as read
          </button>
          <button class="close-button" @click="close">
            <img
              src="@/assets/iconography/close.svg"
              alt="close"
              class="close-button__img"
            />
          </button>
        </div>
      </div>
      <AppNotificationsItem :notifications="notifications" />
    </VCard>
  </div>
</template>

<style>
.close-button {
  height: 14px;
  cursor: pointer;
  background-color: transparent;
  border: none;
}

.close-button__img {
  width: 100%;
  height: 100%;
}

.notification-title-container {
  box-sizing: border-box;
  padding: 1.25rem;
  border-bottom: 1px solid #8d8d8d33;
}

.notification-title {
  font-family: var(--font-body);
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  text-align: center;
  text-transform: uppercase;
}

.notification-items {
  top: calc(100% + 0.75rem);
  right: 5px;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 420px;
  min-height: 120px;
  max-height: 300px;
  padding: 0;
  overflow: auto;
  box-shadow: -4px -5px 4px rgb(0 0 0 / 20%), 4px 5px 4px rgb(0 0 0 / 20%) !important;
}

.notification-items ul {
  padding: 0;
}

.no-notifications > p {
  width: 100%;
}

.notification-read-btn {
  font-family: var(--font-body);
  color: var(--primary);
  background-color: transparent;
  border: none;
  outline: none;
}

@media only screen and (max-width: 767px) {
  .notification-items__mobile {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 999;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    height: 100vh;
    border-radius: 0;
  }

  .notification-items__mobile > div {
    width: 100%;
    height: 100%;
  }

  .notification-items {
    display: none !important;
  }

  .notification-container {
    position: inherit;
  }

  .notification-title-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 75px !important;
  }

  .notification-read-btn {
    margin-right: 14px;
  }
}
</style>
