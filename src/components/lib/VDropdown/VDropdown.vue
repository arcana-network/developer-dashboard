<template>
  <div
    class="custom-select"
    :class="{ open: isOpen }"
    @click.stop="toggle"
    aria-haspopup="listbox"
    :aria-expanded="isOpen"
  >
    <div class="custom-select__trigger" :style="triggerStyle">
      <span v-if="value">{{ value }}</span>
      <span v-else class="placeholder">{{ placeholder }}</span>
      <div class="arrow"></div>
    </div>
    <div class="custom-options" role="listbox" tabindex="-1">
      <span
        v-for="option in options"
        :key="option"
        role="option"
        :data-value="option"
        :aria-selected="option === value"
        class="custom-option"
        @click.stop="onChange(option, $event)"
      >
        {{ option }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.custom-select {
  position: relative;
  display: inline-flex;
  min-width: 12em;
  flex-direction: column;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}
.custom-select__trigger {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  font-size: 1.1em;
  font-weight: 400;
  font-family: var(--font-body);
  color: var(--text-white);
  line-height: 1.25em;
  background: linear-gradient(141.48deg, #1a1a1a -4.56%, #151515 135.63%);
  box-shadow: inset -2px -2px 4px rgba(57, 57, 57, 0.44),
    inset 5px 5px 10px rgba(11, 11, 11, 0.5);
  border-radius: 10px;
  cursor: pointer;
}
.custom-select__trigger .placeholder {
  color: var(--text-grey);
}
.custom-options {
  position: absolute;
  display: block;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 200px;
  border-top: 0;
  background: linear-gradient(143.36deg, #0f0f0f -4.7%, #000000 115.05%);
  transition: all 0.5s;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  z-index: 9999;
  overflow-x: hidden;
  overflow-y: auto;
  border-radius: 0px 0px 10px 10px;
}
.custom-select.open .custom-options {
  opacity: 1;
  visibility: visible;
  pointer-events: all;
}
.custom-option {
  position: relative;
  display: block;
  padding: 15px 20px;
  font-size: 1.1em;
  font-weight: 400;
  font-family: var(--font-body);
  color: var(--text-grey);
  line-height: 1.2em;
  cursor: pointer;
  transition: all 0.2s;
  background: linear-gradient(143.36deg, #0f0f0f -4.7%, #000000 115.05%);
}
.custom-option:hover {
  color: var(--text-white);
}
.custom-option.selected {
  color: var(--text-white);
}
.arrow {
  position: relative;
  height: 15px;
  width: 15px;
}
.arrow::before,
.arrow::after {
  content: "";
  position: absolute;
  bottom: 0px;
  width: 0.15rem;
  height: 100%;
  transition: all 0.5s;
}
.arrow::before {
  left: -5px;
  transform: rotate(-45deg);
  background-color: #8d8d8d;
}
.arrow::after {
  left: 5px;
  transform: rotate(45deg);
  background-color: #8d8d8d;
}
.open .arrow::before {
  left: -5px;
  transform: rotate(45deg);
}
.open .arrow::after {
  left: 5px;
  transform: rotate(-45deg);
}
</style>

<script>
import { reactive, ref } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";
export default {
  name: "VDropdown",
  props: {
    options: Array,
    modelValue: String,
    placeholder: String,
    triggerStyle: [String, Object, Array],
  },
  setup(props, { emit }) {
    props = reactive(props);
    let value = ref(props.modelValue);
    let isOpen = ref(false);
    function toggle() {
      isOpen.value = !isOpen.value;
    }

    function onChange(option, ev) {
      value.value = option;
      emit("update:modelValue", option);
      emit("change", ev, option);
      toggle();
    }

    watch(
      () => props.modelValue,
      () => {
        value.value = props.modelValue;
      }
    );

    return {
      toggle,
      isOpen,
      onChange,
      value,
    };
  },
};
</script>