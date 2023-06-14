<script lang="ts" setup>
import GaslessStep1Icon from '@/assets/iconography/gasless-step-1-icon.svg'
import GaslessStep2Icon from '@/assets/iconography/gasless-step-2-icon.svg'
import GaslessStep3Icon from '@/assets/iconography/gasless-step-3-icon.svg'
import GaslessStep4Icon from '@/assets/iconography/gasless-step-4-icon.svg'

const steps = [
  {
    indexLabel: '01',
    icon: GaslessStep1Icon,
    label: 'Setup Gas Tanks',
  },
  {
    indexLabel: '02',
    icon: GaslessStep2Icon,
    label: 'Deposit Crypto to your Gas Tanks',
  },
  {
    indexLabel: '03',
    icon: GaslessStep3Icon,
    label: 'Setup Whitelists',
  },
  {
    indexLabel: '04',
    icon: GaslessStep4Icon,
    label: 'Enable the Gas Tanks',
  },
]
</script>

<template>
  <h1>Gasless Transactions</h1>
  <p>
    Use this interface to setup gas tanks that will sponsor the gas fees for
    transactions performed by users of your dApp. You may also sponsor all
    transactions or only specific functions within your app's contracts by
    setting up the whitelists. Please note that a new client ID will be created
    if you enable this feature. The client ID will remain even if you decide to
    stop supporting gasless transactions in the future.
  </p>
  <div
    class="flex max-[1350px]:flex-col justify-between bg-[#1F1F1F] border-[1px] border-[#363636] p-4 rounded-[10px] max-[1350px]:w-[300px]"
  >
    <div
      v-for="(step, index) in steps"
      :key="step.indexLabel"
      after="''"
      class="flex flex-column items-start space-y-2 flex-1 max-[1350px]:min-h-[150px]"
    >
      <div
        :class="[
          index < 3
            ? 'relative flex w-full after:w-4/5 after:content-normal after:left-[15%] after:top-[50%] max-[1350px]:after:left-5 max-[1350px]:after:top-[370%] max-[1350px]:after:h-[70px] max-[1350px]:after:w-[1px] after:border-dashed after:border-[1px] after:absolute'
            : '',
        ]"
      >
        <span class="text-[#8D8D8D] text-sm ml-[10px]">
          {{ step.indexLabel }}
        </span>
      </div>
      <div class="flex items-center space-x-2 w-2/3">
        <img :src="step.icon" class="w-10 h-10" />
        <span class="text-sm">{{ step.label }}</span>
      </div>
    </div>
  </div>
</template>
