<script setup>
import { ref } from 'vue'

// Theme and color options
const themes = ref(['BlackHaze', 'WhiteMist'])
const colors = ref([
  '#1862E8',
  '#55B893',
  '#5F9DBA',
  '#521AD3',
  '#BA2CE1',
  '#D73390',
  '#D73226',
  '#DEA13B',
  '#FFFFFF',
  '#000000',
])
const radii = ['-', 'S', 'M', 'L', 'XL']

// Reactive state variables
const theme = ref('WhiteMist')
const accentColor = ref('#1D2A31')
const fontPairing = ref('Nohemi + Inter')
const fontColor = ref('#1D2A31')
const radius = ref('M')
const emailSubject = ref('Login to DexMex')
const title = ref('Login to DexMex')
const bodyHeader = ref(
  'Click the button below to log in to Arcana Developer Dashboard using "xyz@company.in" as your user ID:'
)
const bodyFooter = ref(
  'If you did not make this request, don’t worry, your account is safe and you can simply ignore this email.'
)
const logoSrc = ref('')

// Functions to update state
const setTheme = (selectedTheme) => {
  theme.value = selectedTheme
}

const setAccentColor = (selectedColor) => {
  accentColor.value = selectedColor
}

const setRadius = (selectedRadius) => {
  radius.value = selectedRadius
}

const uploadLogo = (event) => {
  const file = event.target.files[0]
  console.log(file)
}

// Helper functions to apply classes dynamically
const themeButtonClass = (buttonTheme) => {
  return buttonTheme === theme.value
    ? 'border-2 border-[#FF4E9F]'
    : 'border-2 border-transparent'
}

const colorButtonClass = (color) => {
  return color === accentColor.value
    ? 'w-8 h-8 rounded-full border-2 border-black cursor-pointer'
    : 'w-8 h-8 rounded-full cursor-pointer'
}

const radiusButtonClass = (buttonRadius) => {
  return buttonRadius === radius.value
    ? 'border-2 border-[#FF4E9F]'
    : 'border-2 border-transparent'
}

const radiusClass = () => {
  switch (radius.value) {
    case 'S':
      return 'rounded-sm'
    case 'M':
      return 'rounded'
    case 'L':
      return 'rounded-lg'
    case 'XL':
      return 'rounded-xl'
    default:
      return 'rounded'
  }
}
</script>

<template>
  <div class="flex gap-3">
    <!-- Configuration Panel -->
    <div class="w-1/2 p-4 bg-[#F7F7F7] rounded-[10px]">
      <h2 class="text-[22px] font-nohemi font-light mb-4 text-[#1D2A31]">
        Configuration
      </h2>
      <div>
        <label
          class="font-medium font-inter text-base mb-2 text-[#989898] uppercase"
          >Theme</label
        >
        <div class="flex space-x-2 mb-4">
          <div
            class="cursor-pointer flex flex-col gap-2"
            @click="setTheme('BlackHaze')"
          >
            <img
              src="@/assets/black-haze-icon.svg"
              :class="themeButtonClass('BlackHaze')"
              alt="black-haze-icon"
              class="p-1 rounded-2xl"
            />
            <span class="font-normal text-sm">Black Haze</span>
          </div>
          <div
            class="cursor-pointer flex flex-col gap-2"
            @click="setTheme('WhiteMist')"
          >
            <img
              src="@/assets/white-mist-icon.svg"
              :class="themeButtonClass('WhiteMist')"
              alt="black-haze-icon"
              class="p-1 rounded-2xl"
            />
            <span class="font-normal text-sm">White Mist</span>
          </div>
        </div>

        <label
          class="font-medium font-inter text-base mb-2 text-[#989898] uppercase"
          >Accent Color</label
        >
        <div class="flex space-x-2 mb-4">
          <span
            v-for="color in colors"
            :key="color"
            :style="{ backgroundColor: color }"
            :class="colorButtonClass(color)"
            @click="setAccentColor(color)"
          ></span>
        </div>

        <h3
          class="font-medium font-inter text-base mb-2 text-[#989898] uppercase"
        >
          Fonts
        </h3>
        <label class="block mb-1 font-normal text-sm text-[#1D2A31]"
          >Font Pairing</label
        >
        <input v-model="fontPairing" class="mb-4 p-2 border rounded w-full" />

        <label class="block mb-1 font-normal text-sm text-[#1D2A31]"
          >Font Color</label
        >
        <input v-model="fontColor" type="color" class="mb-4 w-full" />

        <label
          class="font-medium font-inter text-base mb-2 text-[#989898] uppercase"
          >Radius</label
        >
        <div class="flex space-x-2 mb-4 gap-8">
          <div
            v-for="radius in radii"
            :key="radius"
            :class="radiusButtonClass(radius)"
            class="cursor-pointer p-2 w-10 h-10 text-center rounded-full font-normal text-lg border bg-[#EFEFEF]"
            @click="setRadius(radius)"
          >
            {{ radius }}
          </div>
        </div>

        <h3
          class="font-medium font-inter text-base mb-2 text-[#989898] uppercase"
        >
          Update Logo
        </h3>
        <label class="block mb-1 font-normal text-sm text-[#1D2A31]"
          >Logo</label
        >
        <input type="file" class="mb-4 w-full" @change="uploadLogo" />

        <h3
          class="font-medium font-inter text-base mb-2 text-[#989898] uppercase"
        >
          Add Content
        </h3>
        <label class="block mb-1 font-normal text-sm text-[#1D2A31]"
          >Email Subject</label
        >
        <input v-model="emailSubject" class="mb-4 p-2 border rounded w-full" />

        <label class="block mb-1 font-normal text-sm text-[#1D2A31]"
          >Title</label
        >
        <input v-model="title" class="mb-4 p-2 border rounded w-full" />

        <label class="block mb-1 font-normal text-sm text-[#1D2A31]"
          >Body Header</label
        >
        <textarea
          v-model="bodyHeader"
          class="mb-4 p-2 border rounded w-full"
        ></textarea>

        <label class="block mb-1 font-normal text-sm text-[#1D2A31]"
          >Body Footer</label
        >
        <textarea
          v-model="bodyFooter"
          class="mb-4 p-2 border rounded w-full"
        ></textarea>
      </div>
    </div>

    <!-- Preview Panel -->
    <div class="w-1/2 p-4 bg-[#F7F7F7] rounded-[10px] flex flex-col">
      <h2 class="text-[22px] font-nohemi font-light mb-4 text-[#1D2A31]">
        Preview
      </h2>
      <div class="bg-gray-50 p-4 rounded-lg shadow-md" :class="radiusClass">
        <div class="flex justify-between items-center mb-4">
          <img :src="logoSrc" alt="Logo" class="h-12" />
          <span :style="{ color: fontColor }" class="font-semibold">{{
            title
          }}</span>
        </div>
        <div class="mb-4" :style="{ color: fontColor }">
          <p>{{ bodyHeader }}</p>
          <button
            :style="{ backgroundColor: accentColor, color: fontColor }"
            class="px-4 py-2 rounded"
          >
            Click to Log In
          </button>
          <p class="text-gray-500 mt-4">{{ bodyFooter }}</p>
        </div>
        <div class="text-gray-500 text-sm mt-4">
          <p>Copyright 2022 XYZ Technologies Ltd.</p>
          <p>Powered by <span class="text-pink-500">arcana</span></p>
        </div>
      </div>
    </div>
  </div>
</template>
