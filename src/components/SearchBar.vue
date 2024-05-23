<script setup lang="ts">
import SearchIcon from '@/assets/iconography/search.svg'

const emits = defineEmits(['search'])
</script>

<template>
  <div
    class="flex space-x-3 bg-liquidlight items-center w-[200px] p-2 rounded-md border border-black"
  >
    <img :src="SearchIcon" alt="search" class="h-[18px] w-[18px]" />
    <input
      type="text"
      class="bg-transparent flex-1 w-full border-none outline-none text-black"
      placeholder="Search a Chain"
      @input="(event) => emits('search', event.target.value)"
    />
  </div>
</template>
