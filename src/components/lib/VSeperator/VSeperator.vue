<script lang="ts" setup>
defineProps({
  vertical: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <hr v-if="!vertical" />
  <div v-else class="vr"></div>
</template>

<style scoped>
hr,
.vr {
  filter: blur(1px);
  border: 1px solid #000;
  border-radius: 10px;
  box-shadow: 1px 1px 3px 4px rgb(45 45 45 / 8%),
    inset -10px -10px 20px rgb(0 0 0 / 50%), inset 10px 10px 15px #222;
}
</style>
