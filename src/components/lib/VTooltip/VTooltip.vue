<script lang="ts" setup>
import { useAttrs } from 'vue'

defineProps({
  title: {
    type: String,
    default: '',
  },
  delay: {
    type: String,
    default: '',
  },
  tooltipStyle: {
    type: [String, Object],
    default: '',
  },
})

const attrs = useAttrs()

const positionClass = {
  bottom: false,
  right: false,
}
</script>

<template>
  <div v-if="title" class="tooltip-wrapper" v-bind="attrs">
    <slot></slot>
    <span
      class="tooltip body-3"
      :class="positionClass"
      role="tooltip"
      aria-hidden="true"
      style="transition-delay: 500ms"
      :style="tooltipStyle"
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
  left: 0;
  z-index: 100000;
  width: max-content;
  min-width: 6em;
  max-width: 26em;
  min-height: 1.25em;
  padding: 1em;
  text-align: center;
  visibility: hidden;
  background: radial-gradient(
    252.43% 1769.19% at -86.03% 38.38%,
    #1e1e1e 0%,
    #353535 100%
  );
  border-radius: 10px;
  box-shadow: 5px 5px 5px rgb(0 0 0 / 60%);
  opacity: 0;
  transition: opacity 0.4s;
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
