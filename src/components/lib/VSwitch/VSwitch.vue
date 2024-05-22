<script lang="ts" setup>
import { computed, ref, useAttrs, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  value: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: '',
  },
  variant: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'checked'])

const attrs = useAttrs()

let switchValue = ref(!!props.value)

watch(
  () => props.value,
  () => {
    switchValue.value = props.value
  }
)

let classes = computed(() => {
  return {
    large: props.size?.trim().toLowerCase() === 'large',
    secondary: props.variant?.trim().toLowerCase() === 'secondary',
    checked: props.modelValue || switchValue.value,
  }
})

function toggle() {
  if (!props.disabled) {
    if (props.modelValue === true || props.modelValue === false) {
      emit('update:modelValue', !props.modelValue)
    } else {
      switchValue.value = !switchValue.value
      emit('checked', { value: switchValue.value })
    }
  }
}
</script>

<template>
  <div>
    <span
      class="toggle-wrapper"
      role="switch"
      :aria-checked="!!modelValue || !!switchValue"
      tabindex="0"
      v-bind="attrs"
      :class="classes"
      :aria-disabled="disabled"
      :disabled="disabled"
      @click.stop="toggle"
    >
      <span class="toggle-background" :class="classes" />
      <span class="toggle-indicator" :class="classes" />
    </span>
  </div>
</template>

<style scoped>
.toggle-wrapper {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 20px;
  cursor: pointer;
  user-select: none;
  background: transparent;
  border-radius: 9999px;
  -webkit-tap-highlight-color: transparent;
  appearance: none;
}

.toggle-wrapper[disabled='true'] {
  cursor: not-allowed;
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
  width: 100%;
  height: 100%;

  /* background: linear-gradient(143.36deg, #c6c6c6 -4.7%, #000 115.05%); */
  background: #fff;
  border: var(--primary-black) solid 2px;
  border-radius: 9999px;
  transition: transform 0.4 ease;
}

.toggle-indicator {
  position: absolute;
  top: 0;
  left: 0;
  width: 20px;
  height: 20px;
  background: var(--primary-black);
  border: var(--primary-black) solid 1px;
  border-radius: 9999px;
  box-shadow: 0 2px 4px rgb(0 0 0 / 10%);
  transition: transform 0.4s ease, background 0.4s ease-in-out;
  transform: translateX(0);
}

.toggle-indicator.secondary {
  background: linear-gradient(220.53deg, #ff9330 0%, #ff6b57 76.95%);
}

.toggle-indicator.large {
  width: 2.6em;
  height: 2.6em;
  transform: translateX(0) rotate(270deg);
}

.toggle-background.checked {
  background: var(--primary-black);
  transform: matrix(-1, 0, 0, 1, 0, 0);
}

.toggle-indicator.checked {
  background: #fff;
  border: var(--primary-black) solid 1px;
  transform: translateX(24px) rotate(270deg);
}

.toggle-indicator.checked.large {
  transform: translateX(2.2em) rotate(540deg);
}
</style>
