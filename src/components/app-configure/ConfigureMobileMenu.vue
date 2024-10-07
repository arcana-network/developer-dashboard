<script lang="ts" setup>
const emit = defineEmits(['close'])

type MobileMenuProps = {
  showMobileMenu: boolean
}

const props = defineProps<MobileMenuProps>()
</script>

<template>
  <div
    class="absolute z-mid-overlayTop w-80 h-full bg-system-light_shadow transform transition-transform duration-300"
    :class="[
      'transform',
      {
        'translate-x-0': props.showMobileMenu,
        '-translate-x-80': !props.showMobileMenu,
      },
    ]"
  >
    <button
      class="absolute top-px34 right-px10 cursor-pointer bg-transparent border-none outline-none"
      @click="emit('close')"
    >
      <img src="@/assets/iconography/close.svg" alt="close icon" />
    </button>
    <slot />
  </div>
</template>
