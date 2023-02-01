<script lang="ts" setup>
import VOverlay from '@/components/lib/VOverlay/VOverlay.vue'

const emit = defineEmits(['close'])

type MobileMenuProps = {
  showMobileMenu: boolean
}

const props = defineProps<MobileMenuProps>()
</script>

<template>
  <div
    class="position-absolute configure-mobile--container"
    :class="{ show: props.showMobileMenu }"
  >
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
  width: 20rem;
  height: 100%;
  background-color: #262626;
  transition: transform 0.3s;
  transform: translateX(-20.5rem);
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

.show {
  transform: translateX(0);
}
</style>
