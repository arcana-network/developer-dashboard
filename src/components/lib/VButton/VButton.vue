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
  background: linear-gradient(180deg, #4e4e4e -4.5%, #3d3d3d 100.1%);
}

button.primary:hover:not(:disabled) {
  opacity: 0.8;
}

button.secondary {
  padding: calc(0.625rem - 2px);
  color: var(--text-white);
  background: linear-gradient(#262626, #262626) padding-box,
    linear-gradient(to bottom, #0085ff, #29c8fa) border-box;
  border: 2px solid transparent;
  border-radius: 10px;
}

button.secondary:disabled {
  color: #808080;
  cursor: not-allowed;
  background: linear-gradient(#262626, #262626) padding-box,
    linear-gradient(180deg, #4e4e4e 0%, #3d3d3d 100%) border-box;
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
    min-width: 8rem;
    padding: 0.6rem 0.8rem;
    font-size: 0.9rem;
    font-weight: 600;
    line-height: 1.5;
    text-align: center;
    background: none;
    border: none;
    border-radius: 10px;
  }
}
</style>
