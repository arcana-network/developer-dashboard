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
      class="lg:text-rem2 md:text-rem1.25 max-md:text-rem1.125 font-bold flex-1 flex justify-center"
    >
      <div
        class="text-ellipsis overflow-hidden max-w-full"
        :title="`Delete app - ${appsStore.app(props.appId as number).name}`"
      >
        Deleting App - {{ appsStore.app(props.appId as number).name }}...
      </div>
    </header>
    <div
      class="flex relative items-center self-center justify-center w-px200 h-px200 mx-3em bg-black_solid-default rounded-full"
    >
      <Vue3CircleProgress
        :percent="timerProgressPercentage"
        fill-color="fairy_dust-default"
        empty-color="firefly-100"
        :size="200"
      />
      <div
        class="flex absolute z-top items-center justify-center w-94% h-94% rounded-full bg-white_solid-default"
      >
        <span class="lg:text-2xl max-md:text-xl">{{ timerDisplay }}</span>
      </div>
    </div>
    <footer class="flex flex-row items-center justify-center gap-2vh flex-1">
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
