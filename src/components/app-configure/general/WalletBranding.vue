<script setup>
import { ref } from 'vue'

const selectedTheme = ref('black-haze')
const selectedColor = ref('#1D2A31')
const selectedFontPairing = ref('Nohemi + Inter')
const selectedFontSize = ref(14)
const selectedFontColor = ref('#F7F7F7')
const selectedRadius = ref('M')
const showPreviewOf = ref('wallet')

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
const fontColors = ['#F7F7F7', '#1D2A31']
const fonts = ['Nohemi + Inter', 'Syne + Onest', 'Nunito + PT Sans']

const navMenu = ['Tokens', 'NFT', 'Profile', 'Activity']

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

const onColorPickerClick = () => {
  document.getElementById('color-picker').click()
}

const getRadius = (radius) => {
  switch (radius) {
    case 'S':
      return '4px'
    case 'M':
      return '8px'
    case 'L':
      return '12px'
    case 'XL':
      return '16px'
    default:
      return '0px'
  }
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
              class="w-8 h-8 rounded-full cursor-pointer border-[1px] border-[#DCDCDC]"
              @click="selectedColor = color"
            ></div>
            <div
              class="relative flex items-center space-x-4 border-1 border-red-700"
            >
              <button
                class="flex items-center justify-center w-8 h-8 border-[1.5px] border-[#1D2A31] rounded-full"
                @click="onColorPickerClick"
              >
                <img src="@/assets/iconography/plus.svg" alt="add" />
              </button>
              <input
                id="color-picker"
                v-model="selectedColor"
                hidden
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
              class="cursor-pointer p-2 w-10 h-10 text-center rounded-full font-normal text-lg border bg-[#EFEFEF] flex items-center justify-center"
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
        <div class="flex-1 flex justify-center items-center">
          <div
            v-if="showPreviewOf === 'wallet'"
            class="rounded border flex flex-col justify-between w-[372px] h-[560px]"
            :style="{
              backgroundColor:
                selectedTheme === 'black-haze' ? '#13171A' : '#EFEFEF',
              color: selectedFontColor,
              fontSize: `${selectedFontSize}px`,
              borderRadius: `${getRadius(selectedRadius)}`,
            }"
          >
            <div class="p-4 flex flex-col justify-between flex-1">
              <div class="flex justify-center">
                <img src="@/assets/arrow-shrink.svg" alt="shrink" />
              </div>
              <div class="flex justify-between items-center mb-4">
                <div class="flex items-center gap-2">
                  <img src="@/assets/placeholder-logo.svg" alt="logo" />
                  <span class="text-base font-nohemi font-normal"
                    >xyz company</span
                  >
                </div>
                <div class="flex items-center gap-2">
                  <img src="@/assets/eth_logo.svg" alt="eth-logo" />

                  <img
                    src="@/assets/iconography/qr-code-icon.svg"
                    alt="qr-code"
                  />
                </div>
              </div>
              <div
                class="mb-4 h-48 p-4 rounded-xl flex flex-col justify-between"
                :style="{
                  backgroundColor:
                    selectedTheme === 'black-haze' ? '#1D2A31' : '#F7F7F7',
                }"
              >
                <div class="flex gap-1">
                  <img src="@/assets/chain_logo_placeholder.svg" alt="chain" />
                  <span>0xdw...9dg5</span>
                </div>
                <div class="flex flex-col mb-2">
                  <span class="text-xs">Total Balance:</span>
                  <span class="text-2xl font-normal">552156560.642827 ETH</span>
                </div>
                <div class="flex space-x-2">
                  <button
                    class="flex-1 px-4 py-2 rounded-full h-12 bg-[#DFECEE]"
                  >
                    SEND
                  </button>
                  <button
                    class="flex-1 px-4 py-2 rounded-full h-12 bg-[#DFECEE]"
                  >
                    BUY
                  </button>
                </div>
              </div>
              <div>
                <h2
                  class="font-light font-nohemi mb-2 flex justify-between items-baseline"
                >
                  <span class="text-base">Assets</span>
                  <span class="text-xs font-thin">Sort by Value</span>
                </h2>
                <div
                  class="h-28 flex flex-col rounded-xl"
                  :style="{
                    backgroundColor:
                      selectedTheme === 'black-haze' ? '#1D2A31' : '#F7F7F7',
                  }"
                >
                  <div class="flex-1 p-4">
                    <div class="flex items-center justify-between mb-2">
                      <span>XAR</span>
                      <span>0 ETH</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span>Ethereum</span>
                      <span>552156560.642827 ETH</span>
                    </div>
                  </div>
                  <div
                    class="flex justify-center items-center h-8 rounded-b-xl"
                    :style="{
                      backgroundColor: selectedColor,
                    }"
                  >
                    <span>New</span>
                  </div>
                </div>
              </div>
              <div class="flex flex-row items-center justify-center">
                <a
                  class="text-xs font-light no-underline"
                  :style="{ color: selectedFontColor }"
                >
                  Powered By
                </a>
                <img
                  src="@/assets/arcana-logo.webp"
                  alt="Arcana Logo"
                  class="ml-1 h-3 align-middle"
                />
              </div>
            </div>
            <div
              class="h-16 flex justify-center items-center"
              :style="{
                backgroundColor:
                  selectedTheme === 'black-haze' ? '#1D2A31' : '#F7F7F7',
                borderRadius: `0 ${getRadius(selectedRadius)}`,
              }"
            >
              <div class="w-[270px] flex justify-between items-center">
                <div v-for="menu in navMenu" :key="menu">
                  <span class="font-inter text-xs font-light">{{ menu }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Login Modal -->
          <div
            v-if="showPreviewOf === 'login'"
            class="flex items-center justify-center"
          >
            <div
              class="bg-white p-8 rounded shadow-lg relative w-96"
              :style="{
                backgroundColor:
                  selectedTheme === 'black-haze' ? '#1D2A31' : '#FFFFFF',
                color: selectedFontColor,
                fontSize: `${selectedFontSize}px`,
                borderRadius: `${getRadius(selectedRadius)}`,
              }"
            >
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
