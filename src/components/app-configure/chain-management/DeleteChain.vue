<script setup lang="ts">
import VOverlay from '@/components/lib/VOverlay/VOverlay.vue'

const emits = defineEmits(['cancel', 'delete'])
</script>

<template>
  <VOverlay>
    <div class="h-full flex justify-center items-center">
      <div
        class="w-[330px] h-44 bg-[#1F1F1F] p-4 rounded-[10px] text-[#FFFFFF] space-y-10"
      >
        <div class="space-y-2.5">
          <h3>Delete a Chain</h3>
          <p class="text-[#8D8D8D] leading-4">
            Please confirm the deletion of the chain by clicking ‘Delete’ below.
          </p>
        </div>
        <div class="space-x-2.5 flex justify-end text-sm">
          <button
            class="border-[1.5px] border-[#F7F7F7] w-[100px] p-2 rounded-md"
            @click="emits('cancel')"
          >
            Cancel
          </button>
          <button
            class="bg-[#FFFFFF] text-black w-[100px] p-2 rounded-md"
            @click.stop="emits('delete')"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </VOverlay>
</template>
