<template>
  <button
    v-if="variant !== 'link'"
    :style="[buttonStyle]"
    :class="classes"
    @click.stop="handleClick"
    :disabled="disabled"
    :aria-label="label"
    v-bind="args"
  >
    {{ label }}
    <v-circular-progress
      v-if="loading"
      :color="loadingColor"
      style="left: calc(50% - 1.5em); transform: translate(-50%, -50%); top: 5%"
    />
  </button>
  <a
    v-else
    :style="[buttonStyle]"
    :class="classes"
    @click.stop="handleClick"
    :disabled="disabled"
    :aria-label="label"
    v-bind="args"
    v-wave
  >
    {{ label }}
  </a>
</template>

<style lang="css" scoped>
button,
a {
  position: relative;
  cursor: pointer;
  font-family: var(--font-body);
  font-size: 1.125em;
  font-weight: 600;
  padding: 0.8em 1em;
  border: none;
  line-height: 1.5;
  text-align: center;
  min-width: 9em;
  border-radius: 10px;
  background: none;
  transition: opacity 0.3s;
}
button.primary {
  background: linear-gradient(to bottom, #0085ff, #29c8fa);
  color: var(--text-white);
}
button.primary:hover:not(:disabled) {
  opacity: 0.8;
  /* box-shadow: inset 0px 25px 47px rgba(0, 52, 101, 0.71); */
}
button.primary:disabled {
  background: linear-gradient(to bottom, #4e4e4e, #2b2b2b);
  color: var(--text-grey);
  cursor: not-allowed;
}
button.secondary {
  border: 3px solid transparent;
  background-clip: padding-box;
  background-color: var(--dark-theme-bg);
  box-sizing: border-box;
  color: var(--text-white);
  min-width: calc(9em - 3px);
  padding: calc(0.8em - 3px) calc(1em - 3px);
}
button.secondary::before {
  position: absolute;
  top: -3px;
  bottom: -3px;
  left: -3px;
  right: -3px;
  background: linear-gradient(to bottom, #0085ff, #29c8fa);
  content: "";
  z-index: -1;
  border-radius: 10px;
}
button.secondary:hover:not(:disabled) {
  color: #28c6fa;
}
button.secondary:disabled {
  color: #8d8d8d;
  cursor: not-allowed;
  border: 3px solid #8d8d8d;
}
button.secondary:disabled::before {
  all: unset;
}
a.link {
  padding: 0;
  color: var(--primary);
  min-width: 0;
  text-decoration: none;
}
a:not([disabled="true"]):hover {
  color: #00519c;
}
a:not([disabled="true"]):active {
  transform: scale(90%);
}
a[disabled="true"] {
  cursor: not-allowed;
  color: #8d8d8d;
}
button.loading-state {
  color: transparent;
}
progress {
  position: absolute;
  margin: auto;
  left: 0;
}
@media only screen and (max-width: 1023px) {
  button,
  a {
    font-size: 0.9em;
    font-weight: 600;
    padding: 0.6em 0.8em;
    border: none;
    line-height: 1.5;
    text-align: center;
    min-width: 8em;
    border-radius: 10px;
    background: none;
  }
}
</style>

<script>
import { reactive } from "@vue/reactivity";
import { computed } from "@vue/runtime-core";
import VCircularProgress from "../VCircularProgress/VCircularProgress.vue";
export default {
  name: "VButton",
  components: { VCircularProgress },
  props: {
    label: String,
    action: Function,
    buttonStyle: [Object, String],
    disabled: Boolean,
    variant: String,
    loading: Boolean,
  },
  setup(props, { emit, args }) {
    props = reactive(props);

    const classes = computed(() => {
      const classNames = {
        primary: false,
        secondary: false,
        link: false,
        "loading-state": props.loading,
      };
      const variant = props.variant?.trim().toLowerCase();
      if (variant in classNames) {
        classNames[variant] = true;
      } else classNames.primary = true;
      return classNames;
    });

    function handleClick(e) {
      if (!props.disabled) {
        if (props.action) {
          props.action.call();
        }
        // return emit("click", e);
      }
    }

    const loadingColor = computed(() => {
      if (!props.variant || props.variant === "primary") {
        return "white";
      }
      return "#28c6fa";
    });

    return {
      classes,
      loadingColor,
      args,
      handleClick,
    };
  },
};
</script>
