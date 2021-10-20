<template>
  <div v-if="title" class="tooltip-wrapper">
    <slot></slot>
    <span
      class="tooltip body-3"
      :class="positionClass"
      role="tooltip"
      aria-hidden="true"
      style="transition-delay: 500ms"
      >{{ title }}</span
    >
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
  top: calc(100% + 5px);
  padding: 1em;
  left: 0;
  min-height: 1.25em;
  min-width: 5em;
  width: max-content;
  max-width: 15em;
  text-align: center;
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
  z-index: 100000;
}
.tooltip-wrapper:hover > span.tooltip {
  visibility: visible;
  opacity: 1;
}
.body-3 {
  font-size: 0.84em;
  line-height: 1.68em;
}
</style>

<script>
import { computed, reactive } from "@vue/runtime-core";
export default {
  name: "VTooltip",
  props: {
    title: String,
    delay: String,
  },
  setup(props) {
    props = reactive(props);
    const positionClass = {
      bottom: false,
      right: false,
    };
    const transitionDelay = computed(() =>
      props.delay ? "transition-delay: " + props.delay : ""
    );

    return {
      positionClass,
      transitionDelay,
    };
  },
};
</script>