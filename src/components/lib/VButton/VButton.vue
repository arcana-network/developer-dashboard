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
      style="top: 5%; left: calc(50% - 1.5em); transform: translate(-50%, -50%)"
    />
  </button>
  <a
    v-else
    v-wave
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
  padding: 0.8em 1em;
  font-family: var(--font-body);
  font-size: 1.125em;
  font-weight: 600;
  line-height: 1.5;
  text-align: center;
  cursor: pointer;
  background: none;
  border: none;
  border-radius: 10px;
  transition: opacity 0.3s;
}

button.primary {
  color: var(--text-white);
  background: linear-gradient(to bottom, #0085ff, #29c8fa);
}

button.primary:disabled {
  color: var(--text-grey);
  cursor: not-allowed;
  background: linear-gradient(to bottom, #4e4e4e, #2b2b2b);
}

button.primary:hover:not(:disabled) {
  opacity: 0.8;
}

button.secondary {
  box-sizing: border-box;
  min-width: calc(9em - 3px);
  padding: calc(0.8em - 3px) calc(1em - 3px);
  color: var(--text-white);
  background-color: var(--dark-theme-bg);
  background-clip: padding-box;
  border: 3px solid transparent;
}

button.secondary::before {
  position: absolute;
  top: -3px;
  right: -3px;
  bottom: -3px;
  left: -3px;
  z-index: -1;
  content: '';
  background: linear-gradient(to bottom, #0085ff, #29c8fa);
  border-radius: 10px;
}

button.secondary:disabled {
  color: #8d8d8d;
  cursor: not-allowed;
  border: 3px solid #8d8d8d;
}

button.secondary:hover:not(:disabled) {
  color: #28c6fa;
}

button.secondary:disabled::before {
  all: unset;
}

a.link {
  min-width: 0;
  padding: 0;
  color: var(--primary);
  text-decoration: none;
}

a:not([disabled='true']):hover {
  color: #00519c;
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

@media only screen and (max-width: 1023px) {
  button,
  a {
    min-width: 8em;
    padding: 0.6em 0.8em;
    font-size: 0.9em;
    font-weight: 600;
    line-height: 1.5;
    text-align: center;
    background: none;
    border: none;
    border-radius: 10px;
  }
}
</style>
