<script lang="ts" setup>
import { ref, computed, useAttrs } from 'vue'

import utils from '@/components/lib/utils'

const props = defineProps({
  labelStyle: [String, Object],
  messageStyle: [String, Object],
  placeholderStyle: [String, Object],
  label: String,
  message: String,
  id: String,
  validation: Function,
  modelValue: [String, Number],
  type: String,
  messageType: String,
  placeholder: String,
  strong: Boolean,
  icon: [String, Object],
  clickableIcon: Boolean,
  inputStyle: [String, Object],
  noMessage: Boolean,
  style: [String, Object, Array],
})

const emit = defineEmits(['update:modelValue', 'icon-clicked'])
const attrs = useAttrs()
let componentId = props.id?.trim() ?? utils.getRandomId()
let iconClicked = ref(false)

let inputType = computed(() => {
  return props.type?.trim().toLowerCase()
})

function validate(ev) {
  if ('validation' in props && 'call' in props.validation) {
    props.validation.call(ev.target?.value)
  }
}

function onInput(ev) {
  emit('update:modelValue', ev.target?.value)
}

function onIconClicked(ev) {
  if (props.clickableIcon) {
    emit('icon-clicked', ev)
  }
}
</script>

<template>
  <div class="form-group" aria-label="Form group" :style="style">
    <label v-if="label" :style="[labelStyle]" :for="componentId">
      {{ label }}
    </label>
    <div class="text-field" :class="{ icon: !!icon }">
      <input
        :id="componentId"
        :type="inputType"
        :value="modelValue"
        v-bind="attrs"
        :placeholder="placeholder"
        :class="{ strong }"
        :style="inputStyle"
        @input="onInput"
      />
      <img
        v-if="icon"
        :src="icon"
        :class="{
          'icon-clickable': clickableIcon,
          height: '1.1em',
        }"
        @click.stop="onIconClicked"
      />
    </div>
    <span v-if="!noMessage" class="message" :class="messageType">
      {{ message || 'Some message' }}
    </span>
  </div>
</template>

<style scoped>
div.form-group {
  display: inline-flex;
  flex-direction: column;
}

label {
  margin: 10px 20px;
  font-family: var(--font-body);
  font-size: 1.125em;
  font-weight: 400;
  line-height: 1.5em;
  color: var(--text-grey);
}

div.text-field {
  display: flex;
  background: linear-gradient(141.48deg, #1a1a1a -4.56%, #151515 135.63%);
  border-radius: 10px;
  box-shadow: inset -2px -2px 4px rgb(57 57 57 / 44%),
    inset 5px 5px 10px rgb(11 11 11 / 50%);
}

.message {
  margin: 5px 20px;
  font-family: var(--font-body);
  font-size: 0.94em;
  font-weight: 400;
  line-height: 1.5em;
  visibility: hidden;
}

.message.success {
  color: #8fff00;
  visibility: visible;
}

.message.error {
  color: #ee193f;
  visibility: visible;
}

.loading-state {
  color: transparent;
}

input {
  width: 100%;
  padding: 0;
  margin: 15px 20px;
  font-family: var(--font-body);
  font-size: 1.1em;
  line-height: 1.5em;
  color: var(--text-white);
  background: transparent;
  border: none;
  outline: none;
  box-shadow: none;

  --webkit-outline: none;
}

input::placeholder {
  margin: 10px 20px;
  font-family: var(--font-body);
  font-size: 1.1em;
  line-height: 1.5em;
  color: var(--text-grey);
}

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  box-shadow: 0 0 0 1000px #181818 inset;
  -webkit-text-fill-color: var(--text-white);
}

div.text-field.icon input {
  width: calc(100% - 80px);
}

input.strong {
  margin: 5px 20px;
  font-size: 1.4em;
  font-weight: 600;
  line-height: 1.65em;
}

img.icon-clickable {
  cursor: pointer;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  appearance: none;
  margin: 0;
}

input[type='number'] {
  appearance: textfield;
}
</style>
