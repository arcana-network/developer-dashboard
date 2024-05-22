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
    <div
      style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
      "
    >
      <v-circular-progress color="var(--primary-light)" size="6em" />
      <h4 style="margin-top: 1em; color: var(--primary-light)">
        {{ message }}
      </h4>
    </div>
  </v-overlay>
</template>
