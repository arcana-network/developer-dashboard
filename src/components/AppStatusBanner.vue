<script setup lang="ts">
import { useRouter } from 'vue-router'

type StatusBannerProps = {
  status: 'overdue' | 'overlimit'
}

const props = defineProps<StatusBannerProps>()
const router = useRouter()

function getAction() {
  if (props.status === 'overdue') {
    return 'Pay now'
  }
  return 'Add payment details'
}

function handleCta() {
  if (props.status === 'overdue') {
    console.log('Handle Overdue')
  } else {
    return router.push({ name: 'Profile', hash: '#payment-details' })
  }
}
</script>

<template>
  <div
    class="flex gap-5 items-center justify-center w-full h-rem2.5 bg-system-red"
  >
    <span class="text-base leading-6 capitalize text-whitemist-default">{{
      props.status
    }}</span>
    <button
      class="px-4 py-2 text-xs font-semibold cursor-pointer border-none rounded-md shadow-none transition-transform duration-300 transform scale-100 hover:scale-110 text-system-deep_black bg-whitemist-default"
      @click.stop="handleCta"
    >
      {{ getAction() }}
    </button>
  </div>
</template>
