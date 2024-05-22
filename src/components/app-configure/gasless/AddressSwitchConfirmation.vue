<script setup lang="ts">
import { ref } from 'vue'

import VOverlay from '@/components/lib/VOverlay/VOverlay.vue'

const props = defineProps({
  info: {
    type: Object,
    required: true,
  },
})

const emits = defineEmits(['close', 'proceed'])

const showEOAswitchWarning = ref(props.info.enabled)
</script>

<template>
  <VOverlay>
    <div class="h-full flex">
      <div
        class="flex flex-col items-center space-y-5 p-5 m-auto h-[300px] w-[420px] border-[1px] border-[#363636] bg-[#FFF] rounded-lg"
      >
        <img
          src="@/assets/iconography/question-red.svg"
          alt="Confirm"
          class="w-10 h-10"
        />
        <p>Confirm Switch</p>
        <div class="text-liquiddark text-sm text-center space-y-2">
          <p v-if="showEOAswitchWarning">
            Disabling Smart Accounts will lead to your users using Externally
            Owned Accounts as the default. Your users will continue to have
            access to both addresses.
          </p>
          <p v-else>
            Enabling Smart Accounts is required to sponsor gas fees, but doing
            so issues new wallet addresses to your dApp users in addition to
            their Externally Owned Accounts.
          </p>
          <p>Please click 'Proceed' if you'd like to go ahead.</p>
        </div>
        <div class="space-x-2 text-sm">
          <button
            class="uppercase border-2 border-black rounded-md w-24 h-9"
            @click.stop="emits('close')"
          >
            Cancel
          </button>
          <button
            class="uppercase rounded-md bg-white border-black border-2 text-black w-24 h-9"
            @click.stop="emits('proceed', props.info)"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  </VOverlay>
</template>
