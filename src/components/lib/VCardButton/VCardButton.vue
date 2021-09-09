<template>
  <button class="card-button" :class="{ active }">
    <span v-if="label">{{ label }}</span>
    <slot v-else></slot>
  </button>
</template>

<style scoped>
.card-button {
  background: transparent;
  box-shadow: unset;
  border: none;
  padding: 0.8em 1.6em;
  cursor: pointer;
  color: #8d8d8d;
  font-weight: 400;
  font-size: 1em;
  border-radius: 10px;
  font-family: var(--font-body);
}
.card-button:hover {
  background: linear-gradient(
    44.81deg,
    #000000 -147.88%,
    rgba(31, 31, 31, 0.29) 105.51%
  );
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.18),
    10px 10px 17px -4px rgba(10, 10, 10, 0.5),
    -8px -8px 20px -2px rgba(255, 255, 255, 0.06),
    inset 44px 25px 7px 8px rgba(32, 32, 32, 0.4);
  color: #13a3fd;
}
.card-button:active,
.card-button.active {
  background: linear-gradient(141.48deg, #161616 -4.56%, #151515 135.63%);
  box-shadow: inset -2px -2px 4px rgba(57, 57, 57, 0.44),
    inset 5px 5px 10px rgba(11, 11, 11, 0.5);
  color: #13a3fd;
}
</style>

<script>
export default {
  name: "VCardButton",
  props: {
    label: String,
    active: Boolean,
  },
  setup() {},
};
</script>