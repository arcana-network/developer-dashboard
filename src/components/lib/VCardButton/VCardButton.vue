<script lang="ts" setup>
defineProps({
  label: {
    type: String,
    default: '',
  },
  active: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <button class="card-button" :disabled="disabled" :class="{ active }">
    <span v-if="label">{{ label }}</span>
    <slot v-else></slot>
  </button>
</template>

<style scoped>
.card-button {
  padding: 0.8em 1.6em;
  font-family: var(--font-body);
  font-size: 1em;
  font-weight: 400;
  color: #8d8d8d;
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: 10px;
  box-shadow: unset;
}

.card-button:not(:disabled):hover {
  color: #13a3fd;
}

.card-button:not(:disabled):active,
.card-button.active:not(:disabled) {
  color: #13a3fd;
}
</style>
