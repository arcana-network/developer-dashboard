<script lang="ts" setup>
import VCircularProgress from '@/components/lib/VCircularProgress/VCircularProgress.vue'
import VOverlay from '@/components/lib/VOverlay/VOverlay.vue'

defineProps({
  message: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <v-overlay>
    <div class="flex flex-col items-center justify-center w-full h-full">
      >
      <v-circular-progress size="6" />
      <h4 class="mt-4 text-white">
        {{ message }}
      </h4>
    </div>
  </v-overlay>
</template>
