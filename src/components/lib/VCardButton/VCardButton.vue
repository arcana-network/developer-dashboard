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
  font-size: 1em;
  font-weight: 400;
  color: #8d8d8d;
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: 25px;
  box-shadow: unset;
}

.card-button:not(:disabled):hover {
  color: var(--secondary);
}

.card-button.active:not(:disabled) {
  color: var(--primary-light);
  background: linear-gradient(141.48deg, #161616 -4.56%, #151515 135.63%);
  box-shadow: inset 5px 5px 10px rgb(11 11 11 / 50%),
    inset -50px 49px 29px 22px rgb(28 28 28 / 84%);
}
</style>
