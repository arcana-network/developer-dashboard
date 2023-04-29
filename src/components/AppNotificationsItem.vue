<script setup lang="ts">
import moment from 'moment'

defineProps({
  notifications: {
    type: Array,
    required: true,
  },
})

const emits = defineEmits(['onClickofItem'])

function getNotificationsTime(timeStamp) {
  const isToday = moment(timeStamp).isSame(new Date(), 'day')
  return isToday
    ? moment(timeStamp).format('hh:mm a')
    : moment(timeStamp).fromNow()
}
</script>

<template>
  <ul v-if="notifications.length" class="notification-item__container">
    <li
      v-for="notification in notifications"
      :key="notification.data"
      class="cursor-pointer notification-item relative"
      @click="emits('onClickofItem', notification)"
    >
      <div class="notification-item__message-container">
        <p class="notification-item__message">
          {{ notification.data }}
        </p>
        <p class="notification-item__time">
          {{ getNotificationsTime(notification.time) }}
        </p>
      </div>
      <div
        class="notification-blue-dot | flex flex-col items-center justify-center"
      >
        <span v-if="!notification.read" class="blue-dot"></span>
      </div>
    </li>
  </ul>
  <div v-else class="no-notifications">
    <p>No Notifications</p>
  </div>
</template>

<style scoped>
ul {
  padding: 0;
  margin: 0;
}

.notification-item__container {
  width: 100%;
}

.notification-item {
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
  padding-bottom: 12px;
  margin-bottom: 1.25rem;
  color: var(--text-white);
  list-style: none;
}

.notification-item:last-child {
  padding-bottom: 0;
  margin-bottom: 0;
}

.notification-item:not(:last-child) {
  border-bottom: 1px solid #8d8d8d33;
}

.notification-item__message-container {
  flex: 1;
}

.notification-blue-dot {
  width: 10%;
}

.blue-dot {
  width: 10px;
  height: 10px;
  background: #13a3fd;
  border-radius: 50%;
}

.notification-item__message {
  margin-bottom: 10px;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
}

.notification-item__time {
  font-size: 10px;
  font-style: normal;
  font-weight: 400;
  color: #8d8d8d;
}

.no-notifications {
  padding: 10px;
  margin-top: 10px;
}

.no-notifications > p {
  width: 100%;
}

@media only screen and (max-width: 767px) {
  .notification-item__container ul {
    box-sizing: border-box;
    padding: 0;
  }

  .no-notifications {
    padding: 20px;
    margin-top: 50px;
    text-align: center;
  }

  .no-notifications > p {
    width: 100%;
  }
}
</style>
