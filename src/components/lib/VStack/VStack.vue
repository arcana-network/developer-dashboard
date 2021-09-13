<template>
  <div class="flex" :class="classes" :style="styles">
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
    smGap: String,
    smDirection: {
      type: String,
      validator: (value) => ["row", "column"].indexOf(value) !== -1,
    },
    smJustify: {
      type: String,
      validator: (value) =>
        ["space-between", "space-around", "space-evenly", "center"].indexOf(
          value
        ) !== -1,
    },
    smAlign: {
      type: String,
      validator: (value) =>
        ["start", "end", "stretch", "center"].indexOf(value) !== -1,
    },
    smWrap: Boolean,
    mdGap: String,
    mdDirection: {
      type: String,
      validator: (value) => ["row", "column"].indexOf(value) !== -1,
    },
    mdJustify: {
      type: String,
      validator: (value) =>
        ["space-between", "space-around", "space-evenly", "center"].indexOf(
          value
        ) !== -1,
    },
    mdAlign: {
      type: String,
      validator: (value) =>
        ["start", "end", "stretch", "center"].indexOf(value) !== -1,
    },
    mdWrap: Boolean,
  },
  setup(props) {
    function checkFlexGap() {
      // create flex container with row-gap set
      var flex = document.createElement("div");
      flex.style.display = "flex";
      flex.style.flexDirection = "column";
      flex.style.rowGap = "1px";

      // create two, elements inside it
      flex.appendChild(document.createElement("div"));
      flex.appendChild(document.createElement("div"));

      // append to the DOM (needed to obtain scrollHeight)
      document.body.appendChild(flex);
      var isSupported = flex.scrollHeight === 1; // flex container should be 1px high from the row-gap
      flex.parentNode.removeChild(flex);

      return isSupported;
    }
    const isSupported = checkFlexGap();
    const classes = computed(() => {
      const gapWorkAround = {};
      if (!isSupported) {
        gapWorkAround = {
          "row-gap": props.direction === "row" && props.gap ? props.gap : false,
          "column-gap":
            props.direction === "column" && props.gap ? props.gap : false,
          "sm-row-gap":
            props.smDirection === "row" && (props.gap || props.smGap)
              ? props.gap || props.smGap
              : false,
          "sm-column-gap":
            props.smDirection === "column" && (props.gap || props.smGap)
              ? props.gap || props.smGap
              : false,
          "md-row-gap":
            props.mdDirection === "row" && (props.gap || props.mdGap)
              ? props.gap || props.mdGap
              : false,
          "md-column-gap":
            props.mdDirection === "column" && (props.gap || props.mdGap)
              ? props.gap || props.mdGap
              : false,
        };
      }

      return {
        "flex-row": props.direction === "row",
        "flex-column": props.direction === "column",
        "flex-wrap": !!props.wrap,
        "flex-start": props.align === "start",
        "flex-stretch": props.align === "stretch",
        "flex-end": props.align === "end",
        "flex-center": props.align === "center",
        "justify-space-between": props.justify === "space-between",
        "justify-space-around": props.justify === "space-around",
        "justify-space-evenly": props.justify === "space-evenly",
        "justify-center": props.justify === "center",

        "sm-flex-row": props.smDirection === "row",
        "sm-flex-column": props.smDirection === "column",
        "sm-flex-wrap": !!props.smWrap,
        "sm-flex-start": props.smAlign === "start",
        "sm-flex-stretch": props.smAlign === "stretch",
        "sm-flex-end": props.smAlign === "end",
        "sm-flex-center": props.smAlign === "center",
        "sm-justify-space-between": props.smJustify === "space-between",
        "sm-justify-space-around": props.smJustify === "space-around",
        "sm-justify-space-evenly": props.smJustify === "space-evenly",
        "sm-justify-center": props.smJustify === "center",

        "md-flex-row": props.mdDirection === "row",
        "md-flex-column": props.mdDirection === "column",
        "md-flex-wrap": !!props.mdWrap,
        "md-flex-start": props.mdAlign === "start",
        "md-flex-stretch": props.mdAlign === "stretch",
        "md-flex-end": props.mdAlign === "end",
        "md-flex-center": props.mdAlign === "center",
        "md-justify-space-between": props.mdJustify === "space-between",
        "md-justify-space-around": props.mdJustify === "space-around",
        "md-justify-space-evenly": props.mdJustify === "space-evenly",
        "md-justify-center": props.mdJustify === "center",
        ...gapWorkAround,
      };
    });

    const styles = computed(() => {
      const __styles = {};
      if (props.direction === "row") {
        __styles["--flex-row-gap"] = props.gap;
        __styles["--flex-column-gap"] = 0;
      }
      if (props.direction === "column") {
        __styles["--flex-column-gap"] = props.gap;
        __styles["--flex-row-gap"] = 0;
      }
      __styles.gap = props.gap;

      return __styles;
    });

    return {
      classes,
      styles,
    };
  },
};
</script>