<script lang="ts" setup>
import { ref, computed } from 'vue'
import Vue3CircleProgress from 'vue3-circle-progress'

import VButton from '@/components/lib/VButton/VButton.vue'
import { useAppsStore } from '@/stores/apps.store'

type DeleteProp = {
  appId?: number
}

const props = defineProps<DeleteProp>()
const emit = defineEmits(['cancel', 'delete'])

const appsStore = useAppsStore()

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
    handleProceedDeletion()
  }
}, 10)

function clearTimer() {
  clearInterval(timerInterval)
  clearInterval(progressInterval)
}

function handleCancelDeletion() {
  clearTimer()
  emit('cancel')
}

function handleProceedDeletion() {
  clearTimer()
  emit('delete')
}
</script>

<template>
  <div class="flex flex-col space-y-10">
    <header
      class="lg:text-[2rem] md:text-[1.25rem] max-[768px]:text-[1.125rem] font-bold flex-1 flex justify-center"
    >
      <div
        class="text-ellipsis overflow-hidden"
        style="max-width: 100%"
        :title="`Delete app - ${appsStore.app(props.appId as number).name}`"
      >
        Deleting App - {{ appsStore.app(props.appId as number).name }}...
      </div>
    </header>
    <div
      class="outer-clock | flex relative items-center self-center justify-center w-[200px] h-[200px] mx-[3em] bg-black rounded-full"
    >
      <Vue3CircleProgress
        :percent="timerProgressPercentage"
        fill-color="var(--primary)"
        empty-color="var(--primary-liquid)"
        :size="200"
      />
      <div
        class="inner-clock | flex absolute z-[1] items-center justify-center w-[94%] h-[94%] rounded-full"
      >
        <span class="lg:text-2xl max-[768px]:text-xl">{{ timerDisplay }}</span>
      </div>
    </div>
    <footer class="flex flex-row items-center justify-center gap-[2vh] flex-1">
      <VButton
        v-wave
        variant="secondary"
        label="CANCEL"
        @click.stop="handleCancelDeletion"
      />
      <VButton
        v-wave
        variant="primary"
        label="CONFIRM"
        @click.stop="handleProceedDeletion"
      />
    </footer>
  </div>
</template>

<style scoped>
.outer-clock {
  background: #000;
}

.inner-clock {
  background: #fff;
}
</style>
