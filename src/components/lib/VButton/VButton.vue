<script lang="ts" setup>
import { computed, useAttrs } from 'vue'

import VCircularProgress from '@/components/lib/VCircularProgress/VCircularProgress.vue'

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  action: {
    type: Function,
    default: void 0,
  },
  buttonStyle: {
    type: [Object, String],
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value: string) =>
      ['primary', 'secondary', 'link'].includes(value),
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const attrs = useAttrs()

const classes = computed(() => {
  const classNames = {
    primary: false,
    secondary: false,
    link: false,
    'loading-state': props.loading,
  }
  const variant = props.variant?.trim().toLowerCase()
  if (variant && variant in classNames) {
    classNames[variant] = true
  } else classNames.primary = true
  return classNames
})

function handleClick() {
  if (!props.disabled && props.action) {
    props.action.call()
  }
}

const loadingColor = computed(() => {
  if (!props.variant || props.variant === 'primary') {
    return 'white'
  }
  return '#28c6fa'
})
</script>

<template>
  <button
    v-if="variant !== 'link'"
    :style="[buttonStyle]"
    :class="classes"
    :disabled="disabled"
    :aria-label="label"
    v-bind="attrs"
    @click.stop="handleClick"
  >
    {{ label }}
    <v-circular-progress
      v-if="loading"
      :color="loadingColor"
      class="absolute top-[5%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 custom-left-offset"
    />
  </button>
  <a
    v-else
    :style="[buttonStyle]"
    :class="classes"
    :disabled="disabled"
    :aria-label="label"
    v-bind="attrs"
    @click.stop="handleClick"
  >
    {{ label }}
  </a>
</template>

<style lang="css" scoped>
button,
a {
  position: relative;
  min-width: 9em;
  padding: 0.625rem;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  text-align: center;
  cursor: pointer;
  background: none;
  border: none;
  border-radius: 25px;
  transition: opacity 0.3s;
}

button.primary {
  color: var(--text-white);
  background: var(--primary-black);
}

button.primary:disabled {
  color: var(--primary-light);
  cursor: not-allowed;
  background: #b7b9bd;
}

button.primary:hover:not(:disabled) {
  background-color: var(--secondary);
}

button.secondary {
  padding: calc(0.625rem - 2px);
  color: var(--primary-black);
  background-color: var(--primary-liquid);
  border: 2px solid transparent;
  border-radius: 25px;
}

button.secondary:disabled {
  color: #808080;
  cursor: not-allowed;
  background: var(--primary-liquid);
}

button.secondary:hover:not(:disabled) {
  color: var(--secondary);
}

button.secondary:disabled::before {
  all: unset;
}

a.link {
  min-width: 0;
  padding: 0;
  color: var(--primary);
}

a:not([disabled='true']):hover {
  color: var(--secondary);
}

a:not([disabled='true']):active {
  transform: scale(90%);
}

a[disabled='true'] {
  color: #8d8d8d;
  cursor: not-allowed;
}

button.loading-state {
  color: transparent;
}

progress {
  position: absolute;
  left: 0;
  margin: auto;
}

.custom-left-offset {
  left: calc(50% - 1.5em);
}

@media only screen and (max-width: 1023px) {
  button,
  a {
    min-width: 8rem;
    padding: 0.6rem 0.8rem;
    font-size: 0.9rem;
    font-weight: 400;
    line-height: 1.5;
    text-align: center;
    background: none;
    border: none;
    border-radius: 25px;
  }
}
</style>
