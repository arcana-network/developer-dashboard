<script setup lang="ts">
import VOverlay from '@/components/lib/VOverlay/VOverlay.vue'
</script>

<template>
  <VOverlay>
    <div class="h-full flex overflow-y-auto py-2">
      <div
        class="flex flex-column border-[1px] border-[#363636] rounded-lg min-h-[330px] max-h-[600px] w-[630px] text-white p-4 space-y-5 bg-[#1F1F1F] m-auto"
      >
        <div class="space-y-[10px]">
          <p class="text-sm">Add Smart Contracts</p>
          <p class="text-sm text-[#8D8D8D] leading-4">
            Specify the details of a contract to add it to the whitelist
          </p>
        </div>
        <div class="flex space-x-3">
          <form class="w-1/2 space-y-3">
            <div class="flex flex-col space-y-2">
              <label for="network-name" class="text-xs text-[#8D8D8D]"
                >Contract Name</label
              >
              <input
                type="text"
                class="text-sm bg-[#313131] p-[10px] w-full border-none outline-none"
                name="network-name"
              />
            </div>
            <div class="flex flex-col space-y-2">
              <label for="network-name" class="text-xs text-[#8D8D8D]"
                >Smart Contract Address</label
              >
              <input
                type="text"
                class="text-sm bg-[#313131] p-[10px] w-full border-none outline-none"
                name="network-name"
              />
            </div>
            <div class="flex flex-col space-y-2">
              <label for="network-name" class="text-xs text-[#8D8D8D]"
                >Application Binary Interface (ABI)</label
              >
              <input
                type="text"
                class="text-sm bg-[#313131] p-[10px] w-full border-none outline-none"
                name="network-name"
              />
            </div>
          </form>
          <div class="w-1/2 flex flex-column space-y-2">
            <span class="text-xs text-[#8D8D8D]"
              >Functions to Sponsor Gas Fees</span
            >
            <div class="flex-1 bg-black"></div>
          </div>
        </div>
        <div class="space-x-2.5 flex justify-end">
          <button
            class="border-[1.5px] border-[#F7F7F7] w-[100px] p-2 rounded-md"
          >
            Cancel
          </button>
          <button
            class="bg-[#FFFFFF] text-black w-[100px] p-2 rounded-md transition-opacity duration-500"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </VOverlay>
</template>
