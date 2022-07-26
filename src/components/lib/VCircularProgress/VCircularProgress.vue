<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps({
  color: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: '3rem',
  },
  stroke: {
    type: String,
    default: '1rem',
  },
})

const styles = computed(() => {
  return {
    color: props.color || 'var(--primary)',
    width: props.size,
    height: props.size,
    fontSize: props.stroke,
  }
})
</script>

<template>
  <progress :style="styles" />
</template>

<style scoped>
progress {
  box-sizing: border-box;
  width: 3em;
  height: 3em;
  padding: 0.25em;
  overflow: hidden;
  font-size: 8px;
  background-color: transparent;
  border: none;
  border-radius: 50%;
  appearance: none;
}

progress::-webkit-progress-bar {
  background-color: transparent;
}

progress:indeterminate {
  mask-image: linear-gradient(transparent 50%, black 50%),
    linear-gradient(to right, transparent 50%, black 50%);
  animation: pure-material-progress-circular 6s infinite
    cubic-bezier(0.3, 0.6, 1, 1);
}

progress:indeterminate::before,
progress:indeterminate::-webkit-progress-value {
  box-sizing: border-box;
  display: block;
  width: 100% !important;
  height: 100%;
  margin-bottom: 0.25em;
  content: '';
  background-color: transparent;
  border: solid 0.25em transparent;
  border-top-color: currentcolor;
  border-radius: 50%;
  animation: pure-material-progress-circular-pseudo 0.75s infinite linear
    alternate;
}

progress:indeterminate::-moz-progress-bar {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  background-color: transparent;
  border: solid 0.25em transparent;
  border-top-color: currentcolor;
  border-radius: 50%;
  animation: pure-material-progress-circular-pseudo 0.75s infinite linear
    alternate;
}

progress:indeterminate::-ms-fill {
  animation-name: -ms-ring;
}

@keyframes pure-material-progress-circular {
  0% {
    transform: rotate(0deg);
  }

  12.5% {
    transform: rotate(180deg);
    animation-timing-function: linear;
  }

  25% {
    transform: rotate(630deg);
  }

  37.5% {
    transform: rotate(810deg);
    animation-timing-function: linear;
  }

  50% {
    transform: rotate(1260deg);
  }

  62.5% {
    transform: rotate(1440deg);
    animation-timing-function: linear;
  }

  75% {
    transform: rotate(1890deg);
  }

  87.5% {
    transform: rotate(2070deg);
    animation-timing-function: linear;
  }

  100% {
    transform: rotate(2520deg);
  }
}

@keyframes pure-material-progress-circular-pseudo {
  0% {
    transform: rotate(-30deg);
  }

  29.4% {
    border-left-color: transparent;
  }

  29.41% {
    border-left-color: currentcolor;
  }

  64.7% {
    border-bottom-color: transparent;
  }

  64.71% {
    border-bottom-color: currentcolor;
  }

  100% {
    border-bottom-color: currentcolor;
    border-left-color: currentcolor;
    transform: rotate(225deg);
  }
}
</style>
