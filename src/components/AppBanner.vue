<script setup lang="ts">
import { ref } from 'vue'

import CloseIcon from '@/components/icons/CloseIcon.vue'

const canShowBanner = ref(false)

function onCloseBanner() {
  canShowBanner.value = false
}
</script>

<template>
  <div>
    <div
      v-if="canShowBanner"
      class="relative py-1 px-6 leading-6 text-white text-center bg-white"
    >
      <h5 class="inline-block mr-8 ml-4 text-base font-normal">
        Arcana Testnet undergoing scheduled maintenance. Logins on Testnet may
        be affected.
      </h5>
      <span
        class="absolute right-8 mt-0.5 cursor-pointer"
        role="button"
        @click.stop="onCloseBanner"
      >
        <CloseIcon color="white_solid-default" />
      </span>
    </div>
  </div>
</template>
