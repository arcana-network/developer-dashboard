<template>
  <div class="flex" :class="classes" :style="{ '--flex-gap': gap || '' }">
    <slot></slot>
  </div>
</template>

<script>
import { computed } from "@vue/runtime-core";
export default {
  name: "VStack",
  props: {
    gap: String,
    direction: {
      type: String,
      validator: (value) => ["row", "column"].indexOf(value) !== -1,
    },
    justify: {
      type: String,
      validator: (value) =>
        ["space-between", "space-around", "space-evenly", "center"].indexOf(
          value
        ) !== -1,
    },
    align: {
      type: String,
      validator: (value) =>
        ["start", "end", "stretch", "center"].indexOf(value) !== -1,
    },
    wrap: Boolean,
  },
  setup(props) {
    const classes = computed(() => {
      return {
        row: props.direction === "row",
        column: props.direction === "column",
        "flex-wrap": !!props.wrap,
        "row-gap": props.direction === "row" && props.gap ? props.gap : false,
        "column-gap":
          props.direction === "column" && props.gap ? props.gap : false,
        "flex-start": props.align === "start",
        "flex-stretch": props.align === "stretch",
        "flex-end": props.align === "end",
        "flex-center": props.align === "center",
        "justify-space-between": props.justify === "space-between",
        "justify-space-around": props.justify === "space-around",
        "justify-space-evenly": props.justify === "space-evenly",
        "justify-center": props.justify === "center",
      };
    });

    return {
      classes,
    };
  },
};
</script>