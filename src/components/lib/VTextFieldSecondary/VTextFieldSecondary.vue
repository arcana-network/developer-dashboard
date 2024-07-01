<script lang="ts" setup>
import { computed, useAttrs, ref } from 'vue'

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
const isFocused = ref(false)

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
    <div class="text-field" :class="{ icon: !!icon, focused: isFocused }">
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
        @focus="isFocused = true"
        @blur="isFocused = false"
      />
      <img
        v-if="icon"
        :src="icon"
        :class="{
          'icon-clickable': clickableIcon,
          'input-icon': true,
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
  margin-bottom: 0.5rem;
  margin-left: 0.5rem;
  font-size: 0.8rem;
  font-weight: 400;
  line-height: 1.5rem;
  color: var(--text-grey);
}

div.text-field {
  display: flex;
  background: #ededec;
  border-radius: 10px;
}

.text-field.focused {
  outline: 1px solid var(--color-blue);
}

.message {
  margin: 5px 20px;
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
  padding: 0 1.25rem;
  margin: 0.8rem;
  font-size: 1rem;
  line-height: 1.5;
  color: black;
  background: transparent;
  border: none;
  outline: none;
  box-shadow: none;

  --webkit-outline: none;
}

input::placeholder {
  font-size: 0.9rem;
  line-height: 1.5;
  color: #393939;
}

.form-group[data-disabled='true'],
input:disabled {
  cursor: not-allowed;
}

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  box-shadow: 0 0 0 1000px #181818 inset;
  -webkit-text-fill-color: var(--text-black);
}

div.text-field.icon input {
  margin-right: 0.5rem;
}

input.strong {
  margin: 5px 20px;
  font-size: 1.4em;
  font-weight: 400;
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

.input-icon {
  margin: auto 1.25rem auto 0;
  cursor: pointer !important;
}

@media only screen and (max-width: 1023px) {
  label {
    margin-bottom: 0.1rem;
    margin-left: 0.7rem;
    font-size: 8px;
    font-weight: 400;
    line-height: 1rem;
    color: var(--text-grey);
  }

  input {
    width: 100%;
    padding: 0;
    margin: 0.5rem 1rem;
    font-size: 11px;
    line-height: 1;
    color: black;
    background: transparent;
    border: none;
    outline: none;
    box-shadow: none;

    --webkit-outline: none;
  }

  input::placeholder {
    font-size: 11px;
    line-height: 1;
    color: #393939;
  }
}
</style>
