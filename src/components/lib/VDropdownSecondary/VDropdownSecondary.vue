<script lang="ts" setup>
import { ref, onBeforeUnmount, onMounted, watch, computed } from 'vue'

import arrowIcon from '@/assets/iconography/arrow.svg'

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
  showTooltip: {
    type: Boolean,
    default: false,
  },
})

const computedOptions = computed(() => props.options)

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
      <span
        v-if="(!displayField && value) || value[displayField]"
        class="custom-select-value"
      >
        <span v-if="displayField">
          {{ value[displayField] }}
        </span>
        <span v-else>
          {{ value }}
        </span>
      </span>
      <span v-else class="placeholder">{{ placeholder }}</span>
      <img
        :src="arrowIcon"
        alt="arrow-icon"
        class="arrow-icon"
        :class="{
          'arrow-icon--active': isOpen,
        }"
      />
    </div>
    <div class="custom-options" role="listbox" tabindex="-1">
      <span
        v-for="option in computedOptions"
        :key="option"
        role="option"
        :data-value="option"
        :aria-selected="option === value"
        class="custom-option"
        @click.stop="onChange(option, $event)"
      >
        <span
          v-if="displayField"
          :title="props.showTooltip ? option[displayField] : ''"
        >
          {{ option[displayField] }}
        </span>
        <span v-else :title="props.showTooltip ? option : ''">
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
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: var(--primary-black);
  cursor: pointer;
  background: var(--primary-light);
  border-radius: 10px;
}

.custom-select__trigger .placeholder {
  color: #393939;
}

.custom-options {
  position: absolute;
  top: 100%;
  right: 0;
  left: 0;
  z-index: 9999;
  display: block;
  max-height: 10rem;
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
  padding: 0.875rem 2rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: var(--primary-black);
  cursor: pointer;
  background: var(--primary-light);
  transition: all 0.2s;
}

.custom-option:hover {
  color: var(--secondary);
}

.custom-option.selected {
  color: var(--secondary);
}

.arrow-icon {
  width: 18px;
  height: 18px;
  margin-left: 4px;
  opacity: 0.5;
  transition: ease 0.5s;
}

.arrow-icon--active {
  opacity: 1;
  transition: ease 0.5s;
  transform: rotate(-180deg);
}

.custom-select.disabled .custom-select__trigger {
  cursor: not-allowed;
}

.custom-select.disabled .custom-select-value,
.custom-select.disabled .arrow-icon {
  opacity: 0.4;
}
</style>
