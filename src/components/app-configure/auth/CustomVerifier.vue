<script setup lang="ts">
import { ref } from 'vue'

import DeleteIcon from '@/assets/iconography/delete-icon.svg'
import PlusIcon from '@/assets/iconography/plus-icon-cricle-white.svg'
import ConfigureActionButtons from '@/components/app-configure/ConfigureActionButtons.vue'
import { useToast } from '@/components/lib/VToast'
import { DOCS_URL } from '@/utils/constants'

const LEARN_MORE_LINK = `${DOCS_URL}/howto/custom-Verifier`
const toast = useToast()

const validationFields = ref([
  {
    field: '',
    value: '',
  },
])

function addValidationField() {
  const entries = validationFields.value
  const lastEntry = entries[entries.length - 1]
  if (!lastEntry.field || !lastEntry.value) {
    toast.error('Please fill the fields before adding a new one')
    return
  }
  entries.push({
    field: '',
    value: '',
  })
  validationFields.value = [...entries]
}

function removeValidationField(index: string) {
  validationFields.value.splice(index, 1)
}

function showDeleteButton(index: string) {
  return validationFields.value.length > index + 1
}

function onFieldChange(e: Event, index: string) {
  const entries = validationFields.value
  entries[index].field = (e.target as HTMLInputElement).value
  validationFields.value = [...entries]
}

function onValueChange(e: Event, index: string) {
  const entries = validationFields.value
  entries[index].value = (e.target as HTMLInputElement).value
  validationFields.value = [...entries]
}
</script>

<template>
  <div class="border-2 border-[#363636] bg-[#1F1F1F] rounded-xl space-y-5">
    <div>
      <h2 class="text-sm uppercase font-bold p-3.5 border-b-2 border-[#363636]">
        Custom Provider
      </h2>
      <p class="text-[#8D8D8D] text-sm font-normal p-3.5">
        Increase adoption of your app by enabling this option. Arcana will take
        care of issuing public and prviate keys to each user through our
        Decentralised Key Generation (DKG) mechanism and keep them secure.
        <a
          :href="LEARN_MORE_LINK"
          target="_blank"
          class="no-underline uppercase text-white text-sm font-bold"
          >Learn More</a
        >
      </p>
    </div>
    <div class="p-3.5 flex">
      <div class="flex flex-col flex-1 space-y-5">
        <fieldset class="space-y-2">
          <div class="flex justify-between">
            <legend class="text-[#8D8D8D] text-xs font-normal">ID Param</legend>
            <span class="text-xs font-normal">What is ID?</span>
          </div>
          <div class="flex items-baseline space-x-5">
            <div class="space-x-2">
              <input id="sub" type="radio" name="idParam" value="sub" checked />
              <label for="sub">Sub</label>
            </div>
            <div class="space-x-2">
              <input id="email" type="radio" name="idParam" value="email" />
              <label for="email">Email</label>
            </div>
          </div>
        </fieldset>
        <div class="flex flex-col space-y-2">
          <div class="flex w-full justify-between">
            <legend class="text-[#8D8D8D] text-xs font-normal">
              JWK Validation
            </legend>
            <span class="text-xs font-normal">What are Validation fields?</span>
          </div>
          <div
            v-for="(item, idx) in validationFields"
            :key="idx"
            class="flex items-center"
          >
            <div class="flex-1">
              <input
                id="field"
                type="text"
                name="validation"
                :value="item.field"
                :onInput="($event) => onFieldChange($event, idx)"
                class="text-white bg-[#313131] p-2 rounded-md outline-none w-full"
              />
            </div>
            <div class="ml-2 flex-1">
              <input
                id="value"
                type="text"
                name="validation"
                :value="item.value"
                :onInput="($event) => onValueChange($event, idx)"
                class="text-white bg-[#313131] p-2 rounded-md outline-none w-full"
              />
            </div>
            <div class="ml-2">
              <button
                v-if="showDeleteButton(idx)"
                class="text-white flex items-center w-7 h-7"
                @click="removeValidationField(idx)"
              >
                <img :src="DeleteIcon" alt="Add Chain" class="w-7 h-7" />
              </button>
              <button
                v-else
                class="text-white flex items-center w-7 h-7"
                @click="addValidationField"
              >
                <img :src="PlusIcon" alt="Add Chain" class="w-7 h-7" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-1 ml-10 space-y-2">
        <div class="flex w-full justify-between">
          <legend class="text-[#8D8D8D] text-xs font-normal">JWK URL</legend>
          <span class="text-xs font-normal">What is JWK URL?</span>
        </div>
        <div class="w-full">
          <input
            id="value"
            type="text"
            name="validation"
            class="text-white bg-[#313131] p-2 rounded-md outline-none w-full"
          />
        </div>
      </div>
    </div>
    <div class="space-x-5 flex justify-end p-3.5">
      <ConfigureActionButtons />
    </div>
  </div>
</template>
