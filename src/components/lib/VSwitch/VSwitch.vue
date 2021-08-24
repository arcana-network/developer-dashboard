<template>
  <div>
    <span
      class="toggle-wrapper"
      role="switch"
      :aria-checked="modelValue"
      tabindex="0"
      @click="toggle"
      v-bind="attrs"
      :class="classes"
    >
      <span class="toggle-background" :class="classes" />
      <span class="toggle-indicator" :class="classes" />
    </span>
  </div>
</template>

<style scoped>
.toggle-wrapper {
  display: inline-block;
  position: relative;
  cursor: pointer;
  width: 44px;
  height: 20px;
  border-radius: 9999px;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.toggle-wrapper.large {
  width: 4.8em;
  height: 2.6em;
}

.toggle-wrapper:focus,
.toggle-wrapper:active {
  outline: 0;
}

.toggle-background {
  display: inline-block;
  border-radius: 9999px;
  height: 100%;
  width: 100%;
  background: linear-gradient(143.36deg, #c6c6c6 -4.7%, #000000 115.05%);
  box-shadow: inset -2px -2px 4px rgba(80, 80, 80, 0.1),
    inset 5px 5px 5px rgba(0, 0, 0, 0.21),
    inset -10px -26px 33px -28px rgba(255, 255, 255, 0.1),
    inset -50px 49px 29px 22px rgba(28, 28, 28, 0.84);
  transition: background-color 0.4s ease;
}

.toggle-indicator {
  position: absolute;
  height: 20px;
  width: 20px;
  left: 0;
  top: 0;
  border-radius: 9999px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.4s ease, background 0.4s ease-in-out;
  transform: translateX(0);
  background: linear-gradient(
    222.06deg,
    #999999 0%,
    rgba(130, 130, 130, 0) 122.2%
  );
}

.toggle-indicator.secondary {
  background: linear-gradient(220.53deg, #ff9330 0%, #ff6b57 76.95%);
}

.toggle-indicator.large {
  height: 2.6em;
  width: 2.6em;
  transform: translateX(0) rotate(270deg);
}

.toggle-indicator.checked {
  transform: translateX(24px) rotate(270deg);
  background: linear-gradient(220.53deg, #9bf763 0%, #26ab5b 76.95%);
}

.toggle-indicator.checked.large {
  transform: translateX(2.2em) rotate(540deg);
}
</style>

<script>
import { computed, reactive } from "@vue/runtime-core";
export default {
  name: "VSwitch",
  props: {
    modelValue: Boolean,
    size: String,
    variant: String,
  },
  setup(props, { emit, attrs }) {
    props = reactive(props);

    let classes = computed(() => {
      return {
        large: props.size?.trim().toLowerCase() === "large",
        secondary: props.variant?.trim().toLowerCase() === "secondary",
        checked: props.modelValue,
      };
    });

    function toggle() {
      emit("update:modelValue", !props.modelValue);
    }

    return {
      classes,
      toggle,
      attrs,
    };
  },
};
</script>