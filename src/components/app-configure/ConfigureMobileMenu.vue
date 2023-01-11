<script lang="ts" setup>
const emit = defineEmits(['close'])
</script>

<template>
  <div class="position-absolute configure-mobile--container">
    <button class="configure-mobile__close-btn" @click="emit('close')">
      <img src="@/assets/iconography/close.svg" alt="close icon" />
    </button>
    <slot />
  </div>
</template>

<style scoped>
.configure-mobile--container {
  z-index: 1000;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  background-color: #262626;
}

.configure-mobile__close-btn {
  position: absolute;
  top: 34px;
  right: 10px;
  box-sizing: border-box;
  cursor: pointer;
  background-color: transparent;
  border: none;
  outline: none;
}
</style>
