<script setup>
import { ref } from 'vue'

const selectedTheme = ref('black-haze')
const selectedColor = ref('#1D2A31')
const selectedFontPairing = ref('Nohemi + Inter')
const selectedFontSize = ref(14)
const selectedFontColor = ref('#1D2A31')
const selectedRadius = ref('M')

const accentColors = [
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
]
const radii = ['S', 'M', 'L', 'XL']

const themeClass = (theme) =>
  theme === selectedTheme.value
    ? 'border-2 border-[#FF4E9F]'
    : 'border-2 border-transparent'

const fontSizeClass = (size) =>
  size === selectedFontSize.value ? 'text-[#FF4E9F]' : 'text-[#1D2A31]'

const radiusClass = (radius) =>
  radius === selectedRadius.value
    ? 'border-2 border-blue-500'
    : 'border-2 border-transparent'

const updateLogo = (type, event) => {
  const file = event.target.files[0]
  console.log(`Updating ${type}:`, file)
  // Handle file upload here
}

const saveConfiguration = () => {
  console.log('Saving configuration...')
  // Save configuration logic here
}

const cancelConfiguration = () => {
  console.log('Cancelling configuration...')
  // Cancel configuration logic here
}
</script>

<template>
  <div class="flex gap-3">
    <!-- Configuration Panel -->
    <div class="w-1/2 p-4 bg-[#F7F7F7] rounded-[10px]">
      <h1 class="text-[22px] font-nohemi font-normal mb-4 text-[#1D2A31]">
        Configuration
      </h1>

      <!-- Theme -->
      <div>
        <h2 class="font-medium font-inter text-lg mb-2">Theme</h2>
        <div class="flex space-x-4 mb-4">
          <div
            class="cursor-pointer flex flex-col gap-2"
            @click="selectedTheme = 'black-haze'"
          >
            <img
              src="@/assets/black-haze-icon.svg"
              alt="black-haze-icon"
              :class="themeClass('black-haze')"
              class="p-1 rounded-2xl"
            />
            <span class="font-normal text-sm">Black Haze</span>
          </div>
          <div
            class="cursor-pointer flex flex-col gap-2"
            @click="selectedTheme = 'white-mist'"
          >
            <img
              src="@/assets/white-mist-icon.svg"
              alt="black-haze-icon"
              :class="themeClass('white-mist')"
              class="p-1 rounded-2xl"
            />
            <span class="font-normal text-sm">White Mist</span>
          </div>
        </div>
      </div>

      <!-- Accent Color -->
      <div>
        <h2 class="font-medium font-inter text-lg mb-2">Accent Color</h2>
        <div class="flex space-x-2 mb-4">
          <div
            v-for="color in accentColors"
            :key="color"
            :style="{ backgroundColor: color }"
            class="w-8 h-8 rounded-full cursor-pointer"
            @click="selectedColor = color"
          ></div>
        </div>
      </div>

      <!-- Fonts -->
      <div>
        <h2 class="font-medium font-inter text-lg mb-2">Fonts</h2>
        <div class="flex justify-between">
          <div class="mb-2">
            <label
              for="font-pairing"
              class="block mb-1 font-normal text-sm text-[#1D2A31]"
              >Font pairing</label
            >
            <select
              id="font-pairing"
              v-model="selectedFontPairing"
              class="p-2 border rounded"
            >
              <option value="Nohemi + Inter">Nohemi + Inter</option>
              <!-- Add more font pairings here -->
            </select>
          </div>
          <div class="mb-4">
            <label
              for="font-size"
              class="block mb-1 font-normal text-sm text-[#1D2A31]"
              >Size</label
            >
            <div class="flex space-x-4 items-baseline">
              <span
                :class="fontSizeClass(14)"
                class="text-sm cursor-pointer"
                @click="selectedFontSize = 14"
                >AA</span
              >
              <span
                :class="fontSizeClass(18)"
                class="text-lg cursor-pointer"
                @click="selectedFontSize = 18"
                >AA</span
              >
              <span
                :class="fontSizeClass(24)"
                class="text-2xl cursor-pointer"
                @click="selectedFontSize = 24"
                >AA</span
              >
            </div>
          </div>
          <div class="mb-4">
            <select
              id="font-color"
              v-model="selectedFontColor"
              class="p-2 border rounded"
            >
              <option value="#1D2A31">#1D2A31</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Radius -->
      <div>
        <h2 class="font-medium font-inter text-lg mb-2">Radius</h2>
        <div class="flex space-x-2 mb-4">
          <div
            v-for="radius in radii"
            :key="radius"
            :class="radiusClass(radius)"
            class="cursor-pointer p-2 w-10 h-10 text-center rounded-full border bg-[#DCDCDC]"
            @click="selectedRadius = radius"
          >
            {{ radius }}
          </div>
        </div>
      </div>

      <!-- Update Logos -->
      <div>
        <h2 class="font-medium font-inter text-lg mb-2">Update Logos</h2>
        <div class="flex gap-3">
          <div class="mb-2">
            <label
              for="logo"
              class="block mb-1 font-normal text-sm text-[#1D2A31]"
              >Logo</label
            >
            <input
              id="logo"
              type="file"
              class="w-full p-2 border rounded"
              @change="updateLogo('logo', $event)"
            />
          </div>
          <div>
            <label
              for="logo-mark"
              class="block mb-1 font-normal text-sm text-[#1D2A31]"
              >Logo Mark</label
            >
            <input
              id="logo-mark"
              type="file"
              class="w-full p-2 border rounded"
              @change="updateLogo('logoMark', $event)"
            />
          </div>
        </div>
      </div>

      <!-- Save / Cancel -->
      <div class="flex space-x-4 mt-4">
        <button
          class="px-4 py-2 bg-blue-500 text-white rounded"
          @click="saveConfiguration"
        >
          Save
        </button>
        <button
          class="px-4 py-2 bg-gray-500 text-white rounded"
          @click="cancelConfiguration"
        >
          Cancel
        </button>
      </div>
    </div>

    <!-- Preview Panel -->
    <div class="w-1/2 p-4 bg-[#F7F7F7] rounded-[10px]">
      <h1 class="text-xl font-bold mb-4">Preview</h1>
      <div
        class="p-4 rounded border"
        :style="{
          backgroundColor:
            selectedTheme === 'black-haze' ? '#1D2A31' : '#FFFFFF',
          color: selectedTheme === 'black-haze' ? '#FFFFFF' : '#000000',
        }"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-2">
            <span class="text-2xl">xyz company</span>
          </div>
          <div>
            <button
              class="px-2 py-1 rounded"
              :style="{ backgroundColor: selectedColor }"
            >
              Icon
            </button>
          </div>
        </div>
        <div class="mb-4">
          <div class="flex items-center justify-between mb-2">
            <span>Total Balance:</span>
            <span class="text-2xl font-bold">552156560.642827 ETH</span>
          </div>
          <div class="flex space-x-2">
            <button
              class="flex-1 px-4 py-2 rounded"
              :style="{ backgroundColor: selectedColor }"
            >
              SEND
            </button>
            <button
              class="flex-1 px-4 py-2 rounded"
              :style="{ backgroundColor: selectedColor }"
            >
              BUY
            </button>
          </div>
        </div>
        <div>
          <h2 class="font-semibold mb-2">Assets</h2>
          <div class="flex items-center justify-between mb-2">
            <span>XAR</span>
            <span>0 ETH</span>
          </div>
          <div class="flex items-center justify-between">
            <span>Ethereum</span>
            <span>552156560.642827 ETH</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
