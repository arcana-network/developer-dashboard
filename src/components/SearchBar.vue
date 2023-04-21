<script setup lang="ts">
import SearchIcon from '@/assets/iconography/search.svg'
</script>

<template>
  <div
    class="flex space-x-3 bg-[#313131] items-center w-[200px] p-2 rounded-md"
  >
    <img :src="SearchIcon" alt="search" class="h-[18px] w-[18px]" />
    <input
      type="text"
      class="bg-transparent flex-1 w-full border-none outline-none text-[#FFFFFF]"
      placeholder="Search a Chain"
    />
  </div>
</template>
