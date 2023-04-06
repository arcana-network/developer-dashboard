<script lang="ts" setup>
import moment from 'moment'
import { toRefs } from 'vue'

import VCard from '@/components/lib/VCard/VCard.vue'
import { useAppsStore } from '@/stores/apps.store'

const emits = defineEmits(['close'])
const appsStore = useAppsStore()

const { notifications } = toRefs(appsStore)

function onCloseClick() {
  emits('close')
  appsStore.updateNotificationReadStatus()
}

function getNotificationsTime(timeStamp) {
  const isToday = moment(timeStamp).isSame(new Date(), 'day')
  return isToday
    ? moment(timeStamp).format('hh:mm a')
    : moment(timeStamp).fromNow()
}
</script>

<template>
  <div>
    <VCard class="notification-items position-absolute mobile-hide">
      <div
        class="flex flex-center justify-space-between width-100 notification-title-container"
      >
        <p class="notification-title">Notifications</p>
        <button class="notification-read-btn cursor-pointer">
          Mark all as read
        </button>
      </div>
      <div class="notification-item__container">
        <ul v-if="notifications.length">
          <li
            v-for="notification in notifications"
            :key="notification.Data"
            class="cursor-pointer notification-item"
          >
            <p class="notification-item__message">
              {{ notification.Data }}
            </p>
            <p class="notification-item__time">
              {{ getNotificationsTime(notification.Time) }}
            </p>
          </li>
        </ul>
        <div v-else class="no-notifications">
          <p>No Notifications</p>
        </div>
      </div>
    </VCard>
    <VCard
      class="notification-items__mobile position-absolute tablet-hide laptop-hide"
    >
      <div class="flex flex-start width-100 notification-title-container">
        <p class="notification-title">Notifications</p>
        <div class="flex flex-baseline">
          <button class="notification-read-btn cursor-pointer">
            Mark all as read
          </button>
          <button class="close-button" @click="onCloseClick">
            <img
              src="@/assets/iconography/close.svg"
              alt="close"
              class="close-button__img"
            />
          </button>
        </div>
      </div>
      <div class="notification-item__container flex-grow">
        <ul v-if="notifications.length">
          <li
            v-for="notification in notifications"
            :key="notification.Data"
            class="cursor-pointer notification-item"
          >
            <p class="notification-item__message">
              {{ notification.Data }}
            </p>
            <p class="notification-item__time">
              {{ getNotificationsTime(notification.Time) }}
            </p>
          </li>
        </ul>
        <div v-else class="no-notifications">
          <p>No Notifications</p>
        </div>
      </div>
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
  min-width: 380px;
  min-height: 120px;
  max-height: 300px;
  padding: 0;
  overflow: auto;
  box-shadow: -4px -5px 4px rgb(0 0 0 / 20%), 4px 5px 4px rgb(0 0 0 / 20%) !important;
}

.notification-items ul {
  padding: 0;
}

.notification-item {
  box-sizing: border-box;
  width: 100%;
  padding-inline: 1.25rem;
  padding-bottom: 12px;
  margin-bottom: 1.25rem;
  font-family: var(--font-body);
  color: var(--text-white);
  white-space: nowrap;
  list-style: none;
}

.notification-item:not(:last-child) {
  border-bottom: 1px solid #8d8d8d33;
}

.notification-item * + * {
  margin-top: 10px;
}

.notification-item__message {
  font-family: var(--font-body);
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
}

.notification-item__time {
  font-family: var(--font-body);
  font-size: 10px;
  font-style: normal;
  font-weight: 400;
  color: #8d8d8d;
}

.no-notifications {
  padding: 10px;
  margin-top: 10px;
  font-family: var(--font-body);
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

  .notification-items__mobile .notification-item__container {
    width: 100%;
  }

  .notification-item__container ul {
    box-sizing: border-box;
    padding: 0;
  }

  .notification-title-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 75px !important;
  }

  .no-notifications {
    padding: 20px;
    margin-top: 50px;
    font-family: var(--font-body);
    text-align: center;
  }

  .no-notifications > p {
    width: 100%;
  }

  .notification-read-btn {
    margin-right: 14px;
  }
}
</style>
