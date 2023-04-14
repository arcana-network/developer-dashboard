<script setup lang="ts">
import moment from 'moment'

defineProps({
  notifications: {
    type: Array,
    required: true,
  },
})

function getNotificationsTime(timeStamp) {
  const isToday = moment(timeStamp).isSame(new Date(), 'day')
  return isToday
    ? moment(timeStamp).format('hh:mm a')
    : moment(timeStamp).fromNow()
}
</script>

<template>
  <div class="notification-item__container">
    <ul v-if="notifications.length">
      <li
        v-for="notification in notifications"
        :key="notification.data"
        class="cursor-pointer notification-item position-relative"
      >
        <div>
          <p class="notification-item__message">
            {{ notification.data }}
          </p>
          <p class="notification-item__time">
            {{ getNotificationsTime(notification.time) }}
          </p>
        </div>
        <span class="blue-dot"></span>
      </li>
    </ul>
    <div v-else class="no-notifications">
      <p>No Notifications</p>
    </div>
  </div>
</template>

<style scoped>
.blue-dot {
  width: 10px;
  height: 10px;
  background: #13a3fd;
  border-radius: 50%;
}

.notification-item__container {
  width: 100%;
}

.notification-item {
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
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

@media only screen and (max-width: 767px) {
  .notification-item__container ul {
    box-sizing: border-box;
    padding: 0;
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
}
</style>
