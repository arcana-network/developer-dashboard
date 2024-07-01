<script lang="ts" setup>
import { computed, defineAsyncComponent, ref } from 'vue'

import VButton from '@/components/lib/VButton/VButton.vue'
import { useLoaderStore } from '@/stores/loader.store'
import useArcanaAuth from '@/use/arcanaAuth'

const AppOverlay = defineAsyncComponent(
  () => import('@/components/AppOverlay.vue')
)

const emit = defineEmits<{
  (e: 'dismiss'): void
  (e: 'resend'): void
  (e: 'success'): void
}>()

const otpLength = 6
const attemptsUsed = ref(0)
const totalAttemptsAllowed = 3
const resendCounter = ref(30)

const otp = ref('')
const otpInputs = ref<HTMLInputElement[]>([])
const arcanaAuth = useArcanaAuth()
const loader = useLoaderStore()
const hasOTPError = ref(false)
startOTPCounterTimer()

function startOTPCounterTimer() {
  resendCounter.value = 30
  const interval = setInterval(() => {
    --resendCounter.value
    if (resendCounter.value === 0) {
      clearInterval(interval)
    }
  }, 1000)
}

function handlePaste(event: ClipboardEvent) {
  hasOTPError.value = false
  if (!event.clipboardData) return
  const paste = event.clipboardData.getData('text/plain')
  if (paste.startsWith('0x') || isNaN(Number(paste))) return
  if (paste.length === otpLength) {
    otp.value = paste
  }
}

function focusInput(index: number) {
  otpInputs.value[index]?.focus()
}

const isValidOTP = computed(
  () => otp.value.length === otpLength && !isNaN(Number(otp.value))
)

function handleKeyDown(event: KeyboardEvent, index: number) {
  hasOTPError.value = false
  if ([event.code, event.key].includes('Backspace')) {
    event.preventDefault()
    otp.value = otp.value.slice(0, index) + otp.value.slice(index + 1)
    focusInput(index - 1)
  } else if (event.code === 'Delete') {
    event.preventDefault()
    otp.value = otp.value.slice(0, index) + otp.value.slice(index + 1)
  } else if (event.code === 'ArrowLeft') {
    event.preventDefault()
    if (index !== 0) focusInput(index - 1)
  } else if (event.code === 'ArrowRight') {
    event.preventDefault()
    if (index !== 5) focusInput(index + 1)
  } else if (
    event.code === 'Spacebar' ||
    event.code === 'Space' ||
    event.code === 'ArrowUp' ||
    event.code === 'ArrowDown'
  ) {
    event.preventDefault()
  } else if (!isNaN(Number(event.key))) {
    event.preventDefault()
    otp.value =
      otp.value.slice(0, index) + event.key + otp.value.slice(index + 1)
    focusInput(index + 1)
  }
}

async function submitOTP() {
  hasOTPError.value = false
  try {
    loader.showLoader('Verifying the OTP...')
    await arcanaAuth.getAuthInstance().loginWithOTPComplete(otp.value)
    emit('success')
    emit('dismiss')
  } catch (error) {
    console.error(error)
    hasOTPError.value = true
  } finally {
    loader.hideLoader()
  }
}

async function resendOTP() {
  emit('resend')
  startOTPCounterTimer()
}
</script>

<template>
  <AppOverlay>
    <div
      class="max-w-sd w-screen bg-white rounded-lg border border-jet flex flex-col relative p-7 gap-4"
      role="dialog"
    >
      <button class="absolute right-4 top-4" @click="emit('dismiss')">
        <img src="@/assets/iconography/close.svg" alt="Close" />
      </button>
      <div class="flex flex-col items-center justify-center gap-3 text-center">
        <h2 class="text-rem2 font-bold">Verification</h2>
        <span class="text-sm text-secondary"
          >Please enter the OTP that was sent to your email address</span
        >
      </div>
      <form
        class="relative isolate flex w-full flex-col gap-4"
        @submit.prevent="submitOTP"
      >
        <div
          class="relative z-10 flex gap-2 w-full items-center justify-between"
        >
          <input
            v-for="i in otpLength"
            :key="`otp-input-${i}`"
            ref="otpInputs"
            v-model="otp[i - 1]"
            type="number"
            step="1"
            min="0"
            max="9"
            pattern="\d*"
            maxlength="1"
            autocomplete="off"
            class="outline-none border-none rounded-md p-2 bg-firefly placeholder:text-whitemist-400 flex flex-grow justify-center items-center text-center overflow-x-scroll"
            @input="void 0"
            @keydown="handleKeyDown($event, i - 1)"
            @paste.prevent="handlePaste"
          />
        </div>
        <span
          :class="[
            'relative z-surface -mt-3 ml-2 text-start text-xs text-tertiary-500 transition-all duration-200 ease-in-out',
            hasOTPError
              ? 'translate-y-0 opacity-100'
              : '-translate-y-8 opacity-0',
          ]"
          >{{
            attemptsUsed === totalAttemptsAllowed
              ? 'The OTP attempts have been exceeded.'
              : 'The entered OTP is either invalid or already used.'
          }}</span
        >
        <VButton
          :disabled="!isValidOTP"
          :title="!isValidOTP ? 'Please enter a valid OTP' : ''"
          variant="secondary"
          label="VERIFY OTP"
        />
        <div class="flex items-center justify-center">
          <button
            v-if="resendCounter === 0"
            class="text-sm font-normal"
            type="button"
            @click.stop="resendOTP"
          >
            Resend OTP
          </button>
          <span v-else class="text-sm">{{
            `Resend OTP in ${resendCounter} seconds`
          }}</span>
        </div>
      </form>
    </div>
  </AppOverlay>
</template>

<style scoped>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  appearance: none;
  margin: 0;
}
</style>
