<script setup>
import { ref, computed } from 'vue'

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
  '#F7F7F7',
  '#000000',
])

const fontColors = ['#F7F7F7', '#BBCCD6', '#829299', '#000000']
const backgroundColor = ref('#F7F7F7')
const selectedBackgroundColor = ref('#F7F7F7') // Holds the color selected from the color picker

const primaryFontColor = ref(fontColors[3])
const secondaryFontColor = ref(fontColors[3])

const selectedPrimaryFont = ref('Nohemi')
const selectedSecondaryFont = ref('Inter')

const primaryfonts = ['Nohemi', 'Syne', 'Nunito']
const secondaryfonts = ['Inter', 'Onest', 'PT Sans']

const setAccentColor = (selectedColor) => {
  backgroundColor.value = selectedColor
}

const addBackgroundColor = (event) => {
  setAccentColor(event.target.value)
  selectedBackgroundColor.value = event.target.value
}

const onColorPickerClick = () => {
  document.getElementById('color-picker').click()
}

const colorButtonClass = (color) => {
  return color === backgroundColor.value
    ? 'w-8 h-8 rounded-full border-2 border-black cursor-pointer'
    : 'w-8 h-8 rounded-full cursor-pointer'
}

// Computed styles for preview
const previewStyle = computed(() => ({
  backgroundColor: backgroundColor.value,
  color: primaryFontColor.value,
  fontFamily: selectedPrimaryFont.value,
}))

const previewSecondaryStyle = computed(() => ({
  color: secondaryFontColor.value,
  fontFamily: selectedSecondaryFont.value,
}))

// Logo Upload Methods
const logoFile = ref(null)

const updateLogo = (type, event) => {
  const file = event.target.files[0]
  if (file && file.type.startsWith('image/')) {
    logoFile.value = URL.createObjectURL(file)
  } else {
    alert('Please upload a valid image file.')
  }
}

const clickLogoUpload = () => {
  document.getElementById('logo').click()
}
</script>

<template>
  <div class="flex gap-3">
    <!-- Configuration Panel -->
    <div class="w-1/2 p-4 bg-[#F7F7F7] rounded-[10px]">
      <h2 class="text-[22px] font-nohemi font-light mb-6 text-[#1D2A31]">
        Configuration
      </h2>
      <div class="space-y-4">
        <!-- Background Color Section -->
        <label
          class="font-medium font-inter text-base mb-4 text-[#989898] uppercase"
        >
          Background Color
        </label>
        <div class="flex space-x-2 mb-4">
          <span
            v-for="color in colors"
            :key="color"
            :style="{ backgroundColor: color }"
            :class="colorButtonClass(color)"
            @click="setAccentColor(color)"
          ></span>
          <div class="flex items-center space-x-4">
            <button
              class="flex items-center justify-center w-8 h-8 border-[1.5px] border-[#1D2A31] rounded-full"
              @click="onColorPickerClick"
            >
              <img src="@/assets/iconography/plus.svg" alt="add" />
            </button>
            <input
              id="color-picker"
              v-model="selectedBackgroundColor"
              type="color"
              class="w-0 h-0 p-0 border-none outline-none"
              @change="addBackgroundColor"
            />
          </div>
        </div>

        <!-- Fonts Section -->
        <h3
          class="font-medium font-inter text-base mb-4 text-[#989898] uppercase"
        >
          Fonts
        </h3>
        <div class="mb-2 flex flex-row space-x-10">
          <div>
            <label
              for="font-pairing"
              class="block mb-1 font-normal text-sm text-[#1D2A31]"
              >Primary Font</label
            >
            <div class="relative inline-block w-44 h-14">
              <select
                v-model="selectedPrimaryFont"
                class="block appearance-none w-full bg-[#EFEFEF] border border-[#DCDCDC] text-[#1D2A31] py-3 px-4 pr-8 rounded-lg leading-tight outline-none"
              >
                <option v-for="font in primaryfonts" :key="font" :value="font">
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
          <div>
            <label
              for="font-color"
              class="block mb-1 font-normal text-sm text-[#1D2A31]"
              >Primary Color</label
            >
            <div class="relative inline-block w-44 h-14">
              <select
                v-model="primaryFontColor"
                class="block appearance-none w-full bg-[#EFEFEF] border border-[#DCDCDC] text-[#1D2A31] py-3 px-4 pr-8 rounded-lg leading-tight outline-none"
              >
                <option v-for="font in fontColors" :key="font" :value="font">
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
        </div>
        <div class="mb-2 flex flex-row space-x-10">
          <div>
            <label
              for="font-pairing"
              class="block mb-1 font-normal text-sm text-[#1D2A31]"
              >Secondary Font</label
            >
            <div class="relative inline-block w-44 h-14">
              <select
                v-model="selectedSecondaryFont"
                class="block appearance-none w-full bg-[#EFEFEF] border border-[#DCDCDC] text-[#1D2A31] py-3 px-4 pr-8 rounded-lg leading-tight outline-none"
              >
                <option
                  v-for="font in secondaryfonts"
                  :key="font"
                  :value="font"
                >
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
          <div>
            <label
              for="font-color"
              class="block mb-1 font-normal text-sm text-[#1D2A31]"
              >Secondary Color</label
            >
            <div class="relative inline-block w-44 h-14">
              <select
                v-model="secondaryFontColor"
                class="block appearance-none w-full bg-[#EFEFEF] border border-[#DCDCDC] text-[#1D2A31] py-3 px-4 pr-8 rounded-lg leading-tight outline-none"
              >
                <option v-for="font in fontColors" :key="font" :value="font">
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
        </div>

        <!-- Update Logos -->
        <div class="flex flex-col gap-2">
          <h2
            class="font-medium font-inter text-base mb-2 text-[#989898] uppercase"
          >
            Update Logo
          </h2>
          <div class="flex gap-8">
            <div class="mb-2">
              <label
                for="logo"
                class="block mb-1 font-normal text-sm text-[#1D2A31]"
                >Logo</label
              >
              <div v-if="logoFile" class="flex gap-3">
                <div
                  class="bg-[#EFEFEF] border-[1px] border-[#DCDCDC] w-40 h-14 rounded-[14px] flex justify-center items-center gap-2"
                >
                  <img :src="logoFile" alt="logo" class="w-12 h-12" />
                </div>
                <button @click="logoFile = null">
                  <img
                    src="@/assets/iconography/delete-icon-logo.svg"
                    alt="delete"
                    class="w-4 h-4"
                  />
                </button>
              </div>
              <div v-else>
                <input
                  id="logo"
                  type="file"
                  hidden
                  class="w-full p-2 border rounded"
                  @change="updateLogo('logo', $event)"
                />
                <button
                  class="bg-[#EFEFEF] border-[1px] border-[#DCDCDC] w-40 h-14 rounded-[14px] flex justify-center items-center gap-2 text-sm font-normal"
                  @click="clickLogoUpload"
                >
                  <img
                    src="@/assets/iconography/upload.svg"
                    alt="plus"
                    class="w-4 h-4"
                  />
                  <span>Upload Logo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-end pt-96">
          <div class="flex items-center justify-center w-52 gap-3">
            <button
              class="px-4 py-2 rounded-full transition-colors duration-300 flex-1 flex justify-center bg-[#DFECEE] text-[#1D2A31] cursor-pointer"
            >
              Cancel
            </button>
            <button
              class="px-4 py-2 rounded-full transition-colors duration-300 flex-1 flex justify-center bg-[#1D2A31] text-[#F7F7F7] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview Section -->
    <div class="w-1/2 p-4 bg-[#F7F7F7] rounded-[10px] flex flex-col">
      <h2 class="text-[22px] font-nohemi font-light mb-10 text-[#1D2A31]">
        Preview
      </h2>
      <div
        class="bg-[#EFEFEF] rounded-lg shadow-md"
        :style="{ backgroundColor: backgroundColor }"
      >
        <div class="flex justify-between items-center mb-4">
          <img
            v-if="logoFile"
            :src="logoFile"
            alt="Logo"
            class="h-44 w-full rounded-lg rounded-b-none"
          />
          <img
            v-else
            src="@/assets/email-branding.svg"
            alt="Logo"
            class="h-44 w-full rounded-lg rounded-b-none"
          />
        </div>
        <div
          class="mb-60 p-8"
          :style="{ color: primaryFontColor, fontFamily: selectedPrimaryFont }"
        >
          <h2
            class="font-nohemi font-thin mb-5 text-[#1D2A31]"
            :style="{
              color: primaryFontColor,
              fontFamily: selectedPrimaryFont,
            }"
          >
            Authentication
          </h2>
          <p
            class="mb-8 text-sm"
            :style="{
              color: secondaryFontColor,
              fontFamily: selectedSecondaryFont,
            }"
          >
            Use this code to sign up to Arcana’s Developer Dashboard. This code
            will expire in 10 minutes.
          </p>
          <div class="flex justify-center items-center bg-white rounded-lg">
            <h1
              class="pt-2 rounded tracking-widest"
              :style="{
                color: primaryFontColor,
                fontFamily: selectedPrimaryFont,
              }"
            >
              356904
            </h1>
          </div>

          <p
            class="mt-4 text-sm"
            :style="{
              color: secondaryFontColor,
              fontFamily: selectedSecondaryFont,
            }"
          >
            If you did not make this request, don’t worry, your account is safe
            and you can simply ignore this email.
          </p>
        </div>
        <div
          class="bg-white text-[#000102] text-sm mt-4 rounded-lg rounded-t-none text-center flex flex-col items-center align-middle py-4"
        >
          <div class="pb-2">
            <p>Copyright 2022 XYZ Technologies Ltd.</p>
          </div>

          <div class="flex flex-row ml-5">
            <a
              class="text-md font-medium mt-[2px] text-black no-underline"
              href="https://github.com/arcana-network/license/blob/main/PRIVACY.md"
              target="_blank"
            >
              Powered By
            </a>
            <img
              src="@/assets/arcana-logo.webp"
              alt="Arcana Logo"
              class="ml-1 w-24 align-middle"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
