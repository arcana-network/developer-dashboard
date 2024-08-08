<script setup>
import { ref } from 'vue'

const selectedTheme = ref('black-haze')
const selectedColor = ref('#1D2A31')
const selectedFontPairing = ref('Nohemi + Inter')
const selectedFontSize = ref(14)
const selectedFontColor = ref('#1D2A31')
const selectedRadius = ref('M')
const showPreviewOf = ref('wallet')
const showColorPicker = ref(false)

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
const radii = ['-', 'S', 'M', 'L', 'XL']
const fontColors = ['#1D2A31', '#464646', '#151515']
const fonts = ['Nohemi + Inter', 'Syne + Onest', 'Nunito + PT Sans']

const themeClass = (theme) =>
  theme === selectedTheme.value
    ? 'border-2 border-[#FF4E9F]'
    : 'border-2 border-transparent'

const fontSizeClass = (size) =>
  size === selectedFontSize.value ? 'text-[#FF4E9F]' : 'text-[#1D2A31]'

const radiusClass = (radius) =>
  radius === selectedRadius.value
    ? 'border-2 border-[#FF4E9F]'
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

const clickLogoUpload = (id) => {
  document.getElementById(id).click()
}
</script>

<template>
  <div class="flex gap-3">
    <!-- Configuration Panel -->
    <div class="w-1/2 p-4 bg-[#F7F7F7] rounded-[10px]">
      <h1 class="text-[22px] font-nohemi font-light mb-4 text-[#1D2A31]">
        Configuration
      </h1>

      <div class="flex flex-col gap-2 p-2">
        <!-- Theme -->
        <div class="flex flex-col gap-2">
          <h2
            class="font-medium font-inter text-base mb-2 text-[#989898] uppercase"
          >
            Theme
          </h2>
          <div class="flex space-x-4 mb-4 gap-6">
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
        <div class="flex flex-col gap-2">
          <h2
            class="font-medium font-inter text-base mb-2 text-[#989898] uppercase"
          >
            Accent Color
          </h2>
          <div class="flex space-x-2 mb-4">
            <div
              v-for="color in accentColors"
              :key="color"
              :style="{ backgroundColor: color }"
              class="w-8 h-8 rounded-full cursor-pointer"
              @click="selectedColor = color"
            ></div>
            <div class="relative flex items-center space-x-4">
              <button
                class="flex items-center justify-center w-10 h-10 text-white bg-blue-500 rounded-full hover:bg-blue-700"
                @click="showColorPicker = !showColorPicker"
              >
                +
              </button>
              <input
                v-if="showColorPicker"
                v-model="selectedColor"
                type="color"
                class="absolute left-0 w-16 h-16 p-0 mt-12 border-none outline-none"
              />
            </div>
          </div>
        </div>

        <!-- Fonts -->
        <div class="flex flex-col gap-2">
          <h2
            class="font-medium font-inter text-base mb-2 text-[#989898] uppercase"
          >
            Fonts
          </h2>
          <div class="flex justify-between">
            <div class="mb-2">
              <label
                for="font-pairing"
                class="block mb-1 font-normal text-sm text-[#1D2A31]"
                >Font pairing</label
              >

              <div class="relative inline-block w-44 h-14">
                <select
                  v-model="selectedFontPairing"
                  class="block appearance-none w-full bg-[#EFEFEF] border border-[#DCDCDC] text-[#1D2A31] py-3 px-4 pr-8 rounded-lg leading-tight outline-none"
                >
                  <option v-for="font in fonts" :key="font" :value="font">
                    {{ font }}
                  </option>
                </select>
                <img
                  src="@/assets/iconography/arrow-down.svg"
                  alt="select"
                  class="h-5 w-5 absolute top-3 right-2"
                />
              </div>
            </div>
            <div class="mb-4 flex flex-col gap-2">
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
              <label
                for="font-color"
                class="block mb-1 font-normal text-sm text-[#1D2A31]"
                >Color</label
              >
              <div class="relative inline-block w-32 h-14">
                <select
                  v-model="selectedFontColor"
                  class="block appearance-none w-full bg-[#EFEFEF] border border-[#DCDCDC] text-[#1D2A31] py-3 px-4 pr-8 rounded-lg leading-tight outline-none"
                >
                  <option
                    v-for="color in fontColors"
                    :key="color"
                    :value="color"
                  >
                    {{ color }}
                  </option>
                </select>
                <img
                  src="@/assets/iconography/arrow-down.svg"
                  alt="select"
                  class="h-5 w-5 absolute top-3 right-2"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Radius -->
        <div class="flex flex-col gap-2">
          <h2
            class="font-medium font-inter text-base mb-2 text-[#989898] uppercase"
          >
            Radius
          </h2>
          <div class="flex space-x-2 mb-4 gap-8">
            <div
              v-for="radius in radii"
              :key="radius"
              :class="radiusClass(radius)"
              class="cursor-pointer p-2 w-10 h-10 text-center rounded-full font-normal text-lg border bg-[#EFEFEF]"
              @click="selectedRadius = radius"
            >
              {{ radius }}
            </div>
          </div>
        </div>

        <!-- Update Logos -->
        <div class="flex flex-col gap-2">
          <h2
            class="font-medium font-inter text-base mb-2 text-[#989898] uppercase"
          >
            Update Logos
          </h2>
          <div class="flex gap-8">
            <div class="mb-2">
              <label
                for="logo"
                class="block mb-1 font-normal text-sm text-[#1D2A31]"
                >Logo</label
              >
              <input
                id="logo"
                type="file"
                hidden
                class="w-full p-2 border rounded"
                @change="updateLogo('logo', $event)"
              />
              <button
                class="bg-[#EFEFEF] border-[1px] border-[#DCDCDC] w-40 h-14 rounded-[14px] flex justify-center items-center gap-2 text-sm font-normal"
                @click="clickLogoUpload('logo')"
              >
                <img
                  src="@/assets/iconography/upload.svg"
                  alt="plus"
                  class="w-4 h-4"
                />
                <span>Upload Logo</span>
              </button>
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
                hidden
                class="w-full p-2 border rounded"
                @change="updateLogo('logoMark', $event)"
              />
              <button
                class="bg-[#EFEFEF] border-[1px] border-[#DCDCDC] w-14 h-14 rounded-[14px] flex justify-center items-center gap-2 text-sm font-normal"
                @click="clickLogoUpload('logo-mark')"
              >
                <img
                  src="@/assets/iconography/upload.svg"
                  alt="plus"
                  class="w-4 h-4"
                />
              </button>
            </div>
          </div>
        </div>

        <div class="flex justify-end">
          <div class="flex items-center justify-center w-52 gap-3">
            <div
              class="px-4 py-2 rounded-full transition-colors duration-300 flex-1 flex justify-center bg-[#DFECEE] text-[#1D2A31] cursor-pointer"
              @click="cancelConfiguration"
            >
              Cancel
            </div>
            <div
              class="px-4 py-2 rounded-full transition-colors duration-300 flex-1 flex justify-center bg-[#1D2A31] text-[#F7F7F7] cursor-pointer"
              @click="saveConfiguration"
            >
              Save
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview Panel -->
    <div class="w-1/2 p-4 bg-[#F7F7F7] rounded-[10px] flex flex-col">
      <h1 class="text-[22px] font-nohemi font-light mb-4 text-[#1D2A31]">
        Preview
      </h1>

      <!-- Wallet UI -->
      <div class="flex flex-col flex-1 gap-3">
        <div class="flex-1 flex justify-center">
          <div
            v-if="showPreviewOf === 'wallet'"
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

          <!-- Login Modal -->
          <div
            v-if="showPreviewOf === 'login'"
            class="flex items-center justify-center"
          >
            <div class="bg-white p-8 rounded shadow-lg relative w-96">
              <div class="text-center">
                <img
                  src="https://via.placeholder.com/50"
                  alt="Logo"
                  class="mx-auto mb-4"
                />
                <h2 class="text-2xl font-semibold mb-2">Welcome</h2>
                <p class="mb-4">
                  We’ll email you a login link for a password-free sign in.
                </p>
                <input
                  v-model="email"
                  type="email"
                  placeholder="Email"
                  class="w-full px-4 py-2 border rounded mb-4"
                />
                <button
                  class="w-full px-4 py-2 text-white rounded"
                  :style="{ backgroundColor: selectedColor }"
                >
                  Get Link
                </button>
                <p class="mt-4">or continue with</p>
                <div class="flex justify-center space-x-4 mt-2">
                  <button class="bg-gray-200 p-2 rounded-full">
                    <img src="https://via.placeholder.com/20" alt="Google" />
                  </button>
                  <button class="bg-gray-200 p-2 rounded-full">
                    <img src="https://via.placeholder.com/20" alt="Facebook" />
                  </button>
                  <button class="bg-gray-200 p-2 rounded-full">
                    <img src="https://via.placeholder.com/20" alt="Twitter" />
                  </button>
                  <button class="bg-gray-200 p-2 rounded-full">
                    <img src="https://via.placeholder.com/20" alt="Reddit" />
                  </button>
                </div>
                <p class="mt-4">
                  Powered by <span class="font-semibold">arcana</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-center">
          <div class="flex bg-[#EFEFEF] rounded-full p-1 cursor-pointer w-64">
            <div
              :class="{
                'bg-[#1D2A31] text-[#F7F7F7]': showPreviewOf === 'wallet',
                'text-[#989898]': showPreviewOf !== 'wallet',
              }"
              class="px-4 py-2 rounded-full transition-colors duration-300 flex-1 flex justify-center"
              @click="showPreviewOf = 'wallet'"
            >
              Wallet
            </div>
            <div
              :class="{
                'bg-[#1D2A31] text-[#F7F7F7]': showPreviewOf === 'login',
                'text-[#989898]': showPreviewOf !== 'login',
              }"
              class="px-4 py-2 rounded-full transition-colors duration-300 flex-1 flex justify-center"
              @click="showPreviewOf = 'login'"
            >
              Login Modal
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
