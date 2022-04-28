<script lang="ts" setup>
defineProps({
  style: [Object, Array, String],
})
</script>

<template>
  <div>
    <div class="overlay"></div>
    <div class="overlay-content" :style="style">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 99999;
  background: rgb(10 10 10 / 72%);
  backdrop-filter: blur(4px);
}

.overlay-content {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 999999;
}

@supports (not (backdrop-filter: blur(3px))) {
  .overlay {
    filter: blur(32px);
  }
}
</style>
