<script lang="ts" setup>
import CancelIcon from '@/assets/iconography/close.svg'

defineProps({
  cancellable: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['cancel'])

function onCancel() {
  emit('cancel')
}
</script>

<template>
  <div class="chip flex">
    <div class="content">
      <slot />
    </div>
    <img
      v-if="cancellable"
      :src="CancelIcon"
      class="cancel-icon"
      @click.stop="onCancel"
    />
  </div>
</template>

<style scoped>
.chip {
  position: relative;
  width: 240px;
  padding: 1em;
  background: radial-gradient(
    134.5% 939.99% at -23.59% -12.9%,
    #262626 0%,
    rgb(26 26 26 / 86.3%) 31.41%,
    rgb(32 32 32 / 49%) 100%
  );
  border-radius: 10px;
  box-shadow: 4px 5px 4px rgb(0 0 0 / 25%);
}

.content {
  width: calc(240px - 2em);
  overflow-x: hidden;
  color: white;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cancel-icon {
  position: absolute;
  top: 1.2em;
  right: 1em;
  margin-left: 2em;
  cursor: pointer;
}
</style>
