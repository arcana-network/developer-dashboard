<script setup lang="ts">
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue'
import { ChevronDownIcon, CheckIcon } from '@heroicons/vue/20/solid'
import { computed } from 'vue'

import { chainTypes } from '@/utils/chainTypes'

type ChainTypeSelectionProps = {
  selectedChainTypeCurve: string
  disabled?: boolean
}
const props = defineProps<ChainTypeSelectionProps>()
const emit = defineEmits(['update:selectedChainTypeCurve'])

const selectedChainType = computed(() => {
  return chainTypes.find(
    (chainType) => chainType.type === props.selectedChainTypeCurve
  )
})

function handleModelValueUpdate(event: string) {
  emit('update:selectedChainTypeCurve', event)
}
</script>

<template>
  <div class="relative w-32">
    <Listbox
      v-slot="{ open }"
      :model-value="selectedChainType"
      :disabled="props.disabled"
      @update:model-value="handleModelValueUpdate"
    >
      <div class="relative">
        <ListboxButton
          class="relative w-full cursor-default rounded-md bg-whitemist-default border border-solid border-system-light_gray py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 disabled:opacity-50 disabled:cursor-not-allowed"
          :class="{
            'opacity-50 cursor-not-allowed': props.disabled,
          }"
        >
          <span class="block truncate">{{ selectedChainType?.name }}</span>
          <span
            class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
          >
            <ChevronDownIcon
              class="h-5 w-5 text-gray-400 transition ease-in-out duration-300"
              :class="{ '-rotate-180': open, 'rotate-0': !open }"
              aria-hidden="true"
            />
          </span>
        </ListboxButton>

        <transition
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <ListboxOptions
            class="absolute bg-[#0f0f0f] border border-solid border-[#363636] mt-1 max-h-60 w-full overflow-auto rounded-md py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none"
          >
            <ListboxOption
              v-for="chainType in chainTypes"
              v-slot="{ active, selected }"
              :key="`${chainType.name}_${chainType.curve}`"
              :value="chainType.type"
              as="template"
            >
              <li
                :class="[
                  active ? 'bg-[#f7f7f7] text-[#1f1f1f]' : 'text-[#f7f7f7]',
                  'relative cursor-default select-none py-2 px-4 cursor-pointer',
                ]"
              >
                <span
                  :class="[
                    selected ? 'font-medium' : 'font-normal',
                    'block truncate',
                  ]"
                  >{{ chainType.name }}</span
                >
                <span
                  v-if="selected"
                  class="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600"
                >
                  <CheckIcon class="h-5 w-5" aria-hidden="true" />
                </span>
              </li>
            </ListboxOption>
          </ListboxOptions>
        </transition>
      </div>
    </Listbox>
  </div>
</template>
