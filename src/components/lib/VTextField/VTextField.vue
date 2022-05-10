<script lang="ts" setup>
import { computed, useAttrs } from 'vue'

import utils from '@/components/lib/utils'

const props = defineProps({
  labelStyle: {
    type: [String, Object],
    default: '',
  },
  messageStyle: {
    type: [String, Object],
    default: '',
  },
  placeholderStyle: {
    type: [String, Object],
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  message: {
    type: String,
    default: '',
  },
  id: {
    type: String,
    default: utils.getRandomId(),
  },
  validation: {
    type: Function,
    default: void 0,
  },
  modelValue: {
    type: [String, Number],
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  messageType: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  strong: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: [String, Object],
    default: '',
  },
  clickableIcon: {
    type: Boolean,
    default: false,
  },
  inputStyle: {
    type: [String, Object],
    default: '',
  },
  noMessage: {
    type: Boolean,
    default: false,
  },
  style: {
    type: [String, Object, Array],
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'icon-clicked'])
const attrs = useAttrs()
let componentId = props.id?.trim()

let inputType = computed(() => {
  return props.type?.trim().toLowerCase()
})

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
  <div
    class="form-group"
    aria-label="Form group"
    :style="style"
    :data-disabled="disabled"
  >
    <label v-if="label" :style="[labelStyle]" :for="componentId">
      {{ label }}
    </label>
    <div class="text-field" :class="{ icon: !!icon }">
      <input
        :id="componentId"
        :disabled="props.disabled"
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
  margin: 1.25rem 2rem;
  font-family: var(--font-body);
  font-size: 1rem;
  line-height: 1.5;
  color: var(--text-white);
  background: transparent;
  border: none;
  outline: none;
  box-shadow: none;

  --webkit-outline: none;
}

input::placeholder {
  margin: 10px 20px 10px 0;
  font-family: var(--font-body);
  font-size: 1.1em;
  line-height: 1.5em;
  color: var(--text-grey);
}

.form-group[data-disabled='true'],
input:disabled {
  cursor: not-allowed;
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
