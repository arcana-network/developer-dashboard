<template>
  <div v-if="title" class="tooltip-wrapper">
    <slot></slot>
    <span class="tooltip body-2" role="tooltip" aria-hidden="true">{{
      title
    }}</span>
  </div>
  <slot v-else></slot>
</template>

<style scoped>
div.tooltip-wrapper {
  position: relative;
  display: inline-block;
}
span.tooltip {
  position: absolute;
  z-index: 999;
  top: calc(100% + 5px);
  padding: 1em;
  left: 0;
  min-height: 1.25em;
  min-width: 11.25em;
  max-width: 30em;
  background: radial-gradient(
    252.43% 1769.19% at -86.03% 38.38%,
    #1e1e1e 0%,
    #353535 100%
  );
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.6);
  border-radius: 10px;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.4s;
}
.tooltip-wrapper:hover > span.tooltip {
  visibility: visible;
  opacity: 1;
}
</style>

<script>
export default {
  name: "VTooltip",
  props: {
    title: String,
  },
  setup() {},
};
</script>