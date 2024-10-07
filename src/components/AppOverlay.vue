<template>
  <div
    class="fixed inset-0 before:content-{''} before:absolute before:inset-0 z-system-light_black before:z-system-light_black before:bg-black before:opacity-75 h-screen flex justify-center items-center backdrop-blur-xar-sm"
  >
    <div class="relative z-overlayTop">
      <slot></slot>
    </div>
  </div>
</template>
