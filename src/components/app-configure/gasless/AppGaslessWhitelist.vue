<script setup lang="ts">
import { ref } from 'vue'

import VOverlay from '@/components/lib/VOverlay/VOverlay.vue'

const showTable = ref(false)
const emits = defineEmits(['add-contract', 'cancel'])
</script>

<template>
  <VOverlay>
    <div class="h-full flex overflow-y-auto py-2">
      <div
        class="flex flex-column border-[1px] border-[#363636] rounded-lg min-h-[330px] max-h-[600px] w-[630px] text-white p-4 space-y-5 bg-[#1F1F1F] m-auto"
      >
        <div class="space-y-[10px]">
          <p class="text-sm">Whitelist Smart Contracts</p>
          <p class="text-sm text-[#8D8D8D] leading-4">
            The following is a list of contracts that are whitelisted for the
            sponsorship of gas fees.
          </p>
        </div>
        <div class="flex flex-column items-end space-y-2 flex-1">
          <button class="text-sm" @click.stop="emits('add-contract')">
            Add Contract
          </button>
          <div class="rounded-md border-[1px] border-[#363636] w-full">
            <table
              v-if="showTable"
              class="table-fixed text-white block overflow-x-auto border-collapse w-full"
            >
              <thead class="border-b-[1px] border-b-[#363636]">
                <tr class="text-[#8d8d8d] text-xs">
                  <th class="w-[15%]">Contract Name</th>
                  <th class="w-[20%]">Functions Enabled</th>
                  <th class="w-[10%]">Date Added</th>
                </tr>
              </thead>
              <tbody>
                <tr class="hover:bg-[#363636]"></tr>
              </tbody>
            </table>
            <div v-else class="h-40 flex justify-center items-center">
              <p class="text-[#8D8D8D]">
                Begin by adding a Contract for which you'd like to Sponsor the
                Gas Fees
              </p>
            </div>
          </div>
        </div>
        <div class="space-x-2.5 flex justify-end">
          <button
            class="border-[1.5px] border-[#F7F7F7] w-[100px] p-2 rounded-md"
            @click.stop="emits('cancel')"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </VOverlay>
</template>

<style scoped>
th,
td {
  padding: 15px;
  text-align: left;
}

th {
  font-size: 12px;
  font-weight: 400;
}

td {
  font-size: 14px;
  font-weight: 500;
  text-overflow: ellipsis;
}
</style>
