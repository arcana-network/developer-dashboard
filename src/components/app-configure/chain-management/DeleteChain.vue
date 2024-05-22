<script setup lang="ts">
import { onMounted, ref } from 'vue'

import VOverlay from '@/components/lib/VOverlay/VOverlay.vue'
import { useGaslessStore } from '@/stores/gasless.store'

const emits = defineEmits(['cancel', 'delete'])

const isGasTankConfigured = ref(false)
const gaslessStore = useGaslessStore()

const props = defineProps({
  deleteChainId: String,
})

onMounted(() => {
  const gastanks = gaslessStore.gastankList
  isGasTankConfigured.value = gastanks.some(
    (gastank) => Number(gastank.chainId) === Number(props.deleteChainId)
  )
})
</script>

<template>
  <VOverlay>
    <div class="h-full flex justify-center items-center">
      <div
        class="w-[330px] h-44 bg-[#1F1F1F] p-4 rounded-[10px] text-white space-y-10"
      >
        <div class="space-y-2.5">
          <h3>Delete a Chain</h3>
          <p v-if="isGasTankConfigured" class="text-liquiddark leading-4">
            Warning: A Gastank is configured for this chain. Deleting this chain
            may disable the Gastank.
          </p>
          <p v-else class="text-liquiddark leading-4">
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
            class="bg-white text-black w-[100px] p-2 rounded-md"
            @click.stop="emits('delete')"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </VOverlay>
</template>
