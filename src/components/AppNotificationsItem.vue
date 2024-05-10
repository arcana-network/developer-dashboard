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
  <ul v-if="notifications.length" class="w-full p-0 m-0">
    <li
      v-for="notification in notifications"
      :key="notification.data"
      class="cursor-pointer flex flex-wrap justify-between w-full pb-3 mb-5 list-none relative last:pb-0 last:mb-0 last:border-none border-b-[#8d8d8d33] border-b-[1px]"
      @click="emits('onClickofItem', notification)"
    >
      <div class="flex-1">
        <p
          class="mb-2.5 text-sm"
          :class="[notification.read ? 'font-normal' : 'font-bold']"
        >
          {{ notification.data }}
        </p>
        <p class="text-xs font-normal text-[#8d8d8d]">
          {{ getNotificationsTime(notification.time) }}
        </p>
      </div>
      <div class="w-[10%] flex flex-col items-center justify-center">
        <span
          v-if="!notification.read"
          class="w-2.5 h-2.5 bg-[#000] rounded-full"
        ></span>
      </div>
    </li>
  </ul>
  <div v-else class="p-2.5">
    <p class="w-full text-center">No Notifications</p>
  </div>
</template>
