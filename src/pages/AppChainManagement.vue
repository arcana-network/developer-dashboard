<script setup lang="ts">
import PlusIcon from '@/assets/iconography/plus.svg'
import ChainList from '@/components/AppChainManagementList.vue'
import SearchBar from '@/components/SearchBar.vue'
</script>

<template>
  <div class="space-y-10">
    <div class="space-y-[15px]">
      <h1 class="font-title text-[32px] leading-[150%] font-[700]">
        Chain Management
      </h1>
      <p class="font-body text-[14px] text-[#8D8D8D] leading-[150%]">
        Allow your users to use any of the chains that your application will
        support. Choose from the available chains or add custom chains that will
        be automatically added to your user’s wallets.
      </p>
    </div>
    <div class="flex flex-col space-y-5">
      <div class="flex items-baseline w-full justify-end space-x-5">
        <button class="text-white flex items-center space-x-1.5">
          <img :src="PlusIcon" alt="Add Chain" class="w-3" />
          <span>Add Chain</span>
        </button>
        <SearchBar />
      </div>
      <ChainList />
    </div>
  </div>
</template>
