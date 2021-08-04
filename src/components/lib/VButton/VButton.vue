<template>
  <button
    v-if="variant !== 'link'"
    :style="[buttonStyle]"
    :class="classes"
    @click.stop="handleClick"
    :disabled="disabled"
    :aria-label="label"
  >
    {{ label }}
  </button>
  <a
    v-else
    :style="[buttonStyle]"
    :class="classes"
    @click.stop="handleClick"
    :disabled="disabled"
    :aria-label="label"
  >
    {{ label }}
  </a>
</template>

<style lang="css" scoped>
button,
a {
  cursor: pointer;
  font-family: var(--font-body);
  font-size: 1.125em;
  font-weight: 600;
  padding: 0.5em 1em;
  border: none;
  line-height: 1.5;
  text-align: center;
  min-width: 12em;
  border-radius: 10px;
  background: none;
}
button.primary {
  background: linear-gradient(to bottom, #0085ff, #29c8fa);
  color: var(--text-white);
}
button.primary:hover:not(:disabled) {
  background: linear-gradient(to bottom, #00519c, #0088b2);
  box-shadow: inset 0px 25px 47px rgba(0, 52, 101, 0.71);
}
button.primary:disabled {
  background: linear-gradient(to bottom, #4e4e4e, #2b2b2b);
  color: var(--text-grey);
  cursor: not-allowed;
}
button.secondary {
  position: relative;
  border: 3px solid transparent;
  background-clip: padding-box;
  background-color: var(--dark-theme-bg);
  box-sizing: border-box;
  color: var(--text-white);
  min-width: calc(12em - 3px);
  padding: calc(0.5em - 3px) calc(1em - 3px);
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
a.link {
  padding: 0;
  color: var(--primary);
  min-width: 0;
  text-decoration: none;
}
</style>

<script>
import { reactive } from "@vue/reactivity";
import { computed } from "@vue/runtime-core";
export default {
  name: "VButton",
  props: {
    label: String,
    action: Function,
    buttonStyle: [Object, String],
    disabled: Boolean,
    variant: String,
  },
  setup(props, { emit }) {
    props = reactive(props);

    const classes = computed(() => {
      const classNames = { primary: true };
      if (props.variant?.trim()) {
        const variant = props.variant.toLowerCase();
        const __builtInVariants = ["primary", "secondary", "link"];
        __builtInVariants.forEach((builtInVariant) => {
          if (variant === builtInVariant) {
            classNames[variant] = true;
          } else {
            classNames[builtInVariant] = false;
          }
        });
      }
      return classNames;
    });

    function handleClick(e) {
      console.log(classes);
      if (props.action) {
        return props.action.call();
      } else {
        return emit("click", e);
      }
    }

    return {
      classes,
      handleClick,
    };
  },
};
</script>
