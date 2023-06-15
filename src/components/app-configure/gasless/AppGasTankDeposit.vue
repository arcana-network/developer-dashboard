<script lang="ts" setup>
import VOverlay from '@/components/lib/VOverlay/VOverlay.vue'

const emits = defineEmits(['cancel', 'proceed'])
</script>

<template>
  <VOverlay>
    <div class="h-full flex overflow-y-auto py-2">
      <div
        class="border-[1px] border-[#363636] rounded-lg max-h-[600px] w-[330px] text-white p-4 space-y-5 bg-[#1F1F1F] m-auto"
      >
        <div class="space-y-[10px]">
          <p class="text-sm">Deposit Crypto to Gas Tank</p>
          <p class="text-sm text-[#8D8D8D] leading-4">
            Declare the owner of the gas tank by signing a message with your
            wallet:
          </p>
        </div>
        <button
          class="uppercase border-2 w-full p-[10px] rounded-md bg-white text-black"
        >
          Connect Wallet
        </button>
        <div class="space-x-2.5 flex justify-end">
          <button
            class="border-[1.5px] border-[#F7F7F7] w-[100px] p-2 rounded-md"
            @click="emits('cancel')"
          >
            Cancel
          </button>
          <button
            class="bg-[#FFFFFF] text-black w-[100px] p-2 rounded-md transition-opacity duration-500"
            @click.prevent="emits('proceed')"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  </VOverlay>
</template>
