<script lang="ts" setup>
import { ref, computed } from 'vue'
import Vue3CircleProgress from 'vue3-circle-progress'

import VButton from '@/components/lib/VButton/VButton.vue'

const emit = defineEmits(['cancel', 'delete'])

const timer = ref(59)
let timerProgress = 59000
const initialProgressPercentage = (timerProgress / 60000) * 100
const timerProgressPercentage = ref(initialProgressPercentage)

const timerDisplay = computed(() => {
  return `00:${timer.value.toString().padStart(2, '0')}`
})

const timerInterval = setInterval(() => {
  --timer.value
}, 1000)

const progressInterval = setInterval(() => {
  timerProgress = timerProgress - 10
  timerProgressPercentage.value = (timerProgress / 60000) * 100
  if (timerProgress === 0) {
    proceedDelete()
  }
}, 10)

function clearTimer() {
  clearInterval(timerInterval)
  clearInterval(progressInterval)
}

function handleCancelDelete() {
  clearTimer()
  emit('cancel')
}

function proceedDelete() {
  clearTimer()
  emit('delete')
}
</script>

<template>
  <header class="sub-heading-1 flex-grow">Deleting App...</header>
  <div class="flex outer-clock">
    <Vue3CircleProgress
      :percent="timerProgressPercentage"
      :border-width="5"
      :border-bg-width="5"
      fill-color="#13A3FD"
      empty-color="transparent"
      :size="200"
    />
    <div class="flex inner-clock">
      <span class="sub-heading-2">{{ timerDisplay }}</span>
    </div>
  </div>
  <footer class="flex sm-column flex-grow">
    <VButton
      v-wave
      variant="secondary"
      label="CANCEL"
      @click.stop="handleCancelDelete"
    />
    <VButton
      v-wave
      variant="primary"
      label="CONFIRM"
      @click.stop="proceedDelete"
    />
  </footer>
</template>

<style scoped>
header {
  display: flex;
  justify-content: center;
}

footer {
  gap: 2vh;
  align-items: center;
  justify-content: center;
}

.outer-clock {
  position: relative;
  align-items: center;
  align-self: center;
  justify-content: center;
  width: 200px;
  height: 200px;
  margin: 3em 0;
  background: #000;
  border-radius: 50%;
  box-shadow: inset 0 -13px 33px -10px rgb(255 255 255 / 15%),
    inset 0 10px 53px 72px #090909;
}

.inner-clock {
  position: absolute;
  z-index: 1;
  align-items: center;
  justify-content: center;
  width: 94%;
  height: 94%;
  background: linear-gradient(
    45.51deg,
    #000 -78.45%,
    rgb(31 31 31 / 29%) 88.21%
  );
  border-radius: 50%;
  box-shadow: 5px 5px 10px rgb(0 0 0 / 18%),
    10px 10px 17px -4px rgb(10 10 10 / 50%),
    -8px -8px 20px -2px rgb(255 255 255 / 6%),
    inset 5px 5px 30px 8px rgb(32 32 32 / 6%);
}
</style>
