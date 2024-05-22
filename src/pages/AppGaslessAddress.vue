<script lang="ts" setup>
import VSwitch from '@/components/lib/VSwitch/VSwitch.vue'
</script>

<template>
  <div class="space-y-10">
    <div class="space-y-3.5">
      <h1>Address</h1>
      <p class="text-liquiddark text-sm">
        Lorem ipsum dolor sit amet consectetur. Donec quis tellus amet sit
        lacus. Congue egestas blandit massa arcu amet. Erat sit faucibus
        lobortis porttitor nec sed consectetur. A suspendisse donec faucibus
        orci lorem nam praesent quis amet. Fringilla quis eu erat sed volutpat
        faucibus vestibulum.
      </p>
    </div>
    <div
      class="divide-y-[1px] divide-[#363636] border-[1px] border-[#363636] rounded-md w-3/5 max-[1550px]:w-full"
    >
      <h2 class="text-sm uppercase p-3.5">Accounts Management</h2>
      <div class="p-3.5 space-y-7">
        <p class="text-liquiddark text-sm">
          Arcana Wallets provide your users two kinds of addresses -- the
          regularly available Externally Owned Addresses addresses and the Smart
          Contract Wallet. If you choose to provide Gasless transaction features
          to your dApp users, SCW addresses will be automatically enabled even
          for existing users.
        </p>
        <div class="flex items-baseline space-x-5">
          <span>Address Type</span>
          <div class="flex justify-center space-x-3 text-liquiddark">
            <span>EOA</span>
            <VSwitch :model-value="true" />
            <span>SCW</span>
          </div>
        </div>
        <div
          class="p-2 inline-flex items-center space-x-1 bg-[#313131] rounded-md"
        >
          <img src="@/assets/iconography/info-circle-outline.svg" />
          <span class="text-xs text-liquiddark"
            >Switching from SCWs to EOAs not possible on certain chains.</span
          >
        </div>
        <div class="flex justify-end">
          <button class="bg-white text-black text-sm rounded-md w-28 h-9">
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
