<script lang="ts" setup>
import { ref, onBeforeUnmount, onMounted, watch } from 'vue'

const props = defineProps({
  options: {
    type: Array,
    default: null,
  },
  displayField: {
    type: String,
    default: '',
  },
  modelValue: {
    type: [String, Object, Boolean],
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  triggerStyle: {
    type: [String, Object, Array],
    default: '',
  },
  triggerClass: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue', 'change'])

let value = ref(props.modelValue)
let isOpen = ref(false)

function toggle() {
  if (!props.disabled) {
    isOpen.value = !isOpen.value
  }
}

function onChange(option, ev) {
  value.value = option
  emit('update:modelValue', option)
  emit('change', ev, option)
  toggle()
}

function clickListener() {
  isOpen.value = false
}

onMounted(() => {
  document.body.addEventListener('click', clickListener)
})

onBeforeUnmount(() => {
  document.body.removeEventListener('click', clickListener)
})

watch(
  () => props.modelValue,
  () => {
    value.value = props.modelValue
  }
)
</script>

<template>
  <div
    class="custom-select"
    :class="{ open: isOpen, disabled }"
    aria-haspopup="listbox"
    :aria-expanded="isOpen"
    :aria-disabled="disabled"
    @click.stop="toggle"
  >
    <div
      class="custom-select__trigger"
      :class="triggerClass"
      :style="triggerStyle"
    >
      <span v-if="value">
        <span v-if="displayField">
          {{ value[displayField] }}
        </span>
        <span v-else>
          {{ value }}
        </span>
      </span>
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
        <span v-if="displayField">
          {{ option[displayField] }}
        </span>
        <span v-else>
          {{ option }}
        </span>
      </span>
    </div>
  </div>
</template>

<style scoped>
.custom-select {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  min-width: 12em;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.custom-select__trigger {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  font-family: var(--font-body);
  font-size: 1.1em;
  font-weight: 400;
  line-height: 1.25em;
  color: var(--text-white);
  cursor: pointer;
  background: linear-gradient(141.48deg, #1a1a1a -4.56%, #151515 135.63%);
  border-radius: 10px;
  box-shadow: inset -2px -2px 4px rgb(57 57 57 / 44%),
    inset 5px 5px 10px rgb(11 11 11 / 50%);
}

.custom-select__trigger .placeholder {
  color: var(--text-grey);
}

.custom-options {
  position: absolute;
  top: 100%;
  right: 0;
  left: 0;
  z-index: 9999;
  display: block;
  max-height: 200px;
  overflow-x: hidden;
  overflow-y: auto;
  pointer-events: none;
  visibility: hidden;
  background: linear-gradient(143.36deg, #0f0f0f -4.7%, #000 115.05%);
  border-top: 0;
  border-radius: 0 0 10px 10px;
  opacity: 0;
  transition: all 0.5s;
}

.custom-select.open .custom-options {
  pointer-events: all;
  visibility: visible;
  opacity: 1;
}

.custom-option {
  position: relative;
  display: block;
  padding: 15px 20px;
  font-family: var(--font-body);
  font-size: 1.1em;
  font-weight: 400;
  line-height: 1.2em;
  color: var(--text-grey);
  cursor: pointer;
  background: linear-gradient(143.36deg, #0f0f0f -4.7%, #000 115.05%);
  transition: all 0.2s;
}

.custom-option:hover {
  color: var(--text-white);
}

.custom-option.selected {
  color: var(--text-white);
}

.arrow {
  position: relative;
  width: 15px;
  height: 15px;
}

.arrow::before,
.arrow::after {
  position: absolute;
  bottom: 0;
  width: 0.15rem;
  height: 100%;
  content: '';
  transition: all 0.5s;
}

.arrow::before {
  left: -5px;
  background-color: #13a3fd;
  transform: rotate(-45deg);
}

.arrow::after {
  left: 5px;
  background-color: #13a3fd;
  transform: rotate(45deg);
}

.open .arrow::before {
  left: -5px;
  transform: rotate(45deg);
}

.open .arrow::after {
  left: 5px;
  transform: rotate(-45deg);
}

.custom-select.disabled .custom-select__trigger {
  cursor: not-allowed;
}
</style>
