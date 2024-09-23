<script setup>
import { onMounted, ref, watchEffect, computed, watch } from 'vue'

import { useToast } from '@/components/lib/VToast'
import { updateApp } from '@/services/gateway.service'
import { useAppsStore } from '@/stores/apps.store'
import { useAppId } from '@/use/getAppId'
import { content, errors } from '@/utils/content'

const accentColors = ref([
  '#FFFFFF',
  '#1862E8',
  '#55B893',
  '#5F9DBA',
  '#521AD3',
  '#BA2CE1',
  '#D73390',
  '#D73226',
  '#DEA13B',
  '#000000',
])
const fontColors = [
  '#F7F7F7',
  '#BBCCD6',
  '#74919C',
  '#829299',
  '#4C626E',
  '#1D2A31',
]
const primaryfonts = ['Nohemi', 'Syne', 'Nunito']
const secondaryfonts = ['Inter', 'Onest', 'PT Sans']

const bannerImage = ref('')
const selectedAccentColor = ref('#F7F7F7')
const primaryFontColor = ref('#1D2A31')
const secondaryFontColor = ref('#1D2A31')
const selectedPrimaryFont = ref('Nohemi')
const selectedSecondaryFont = ref('Inter')

const appsStore = useAppsStore()
const appId = useAppId()
const currentApp = appsStore.app(appId)
const toast = useToast()

const accentColorClass = (color) => {
  return color === selectedAccentColor.value
    ? 'border-2 border-[#FF4E9F]'
    : 'border-2 border-transparent hover:border-black'
}

function addAccentColor() {
  if (!accentColors.value.includes(selectedAccentColor.value)) {
    accentColors.value.push(selectedAccentColor.value)
  }
}

const onColorPickerClick = () => {
  document.getElementById('color-picker').click()
}

const saveConfiguration = async () => {
  try {
    const email_branding = {
      image_url: bannerImage.value,
      background: selectedAccentColor.value,
      primary_font: selectedPrimaryFont.value,
      primary_color: primaryFontColor.value,
      secondary_font: selectedSecondaryFont.value,
      secondary_color: secondaryFontColor.value,
    }

    await updateApp(appId, { email_branding }, currentApp.network)
    toast.success(content.BRANDING.SAVED)
    currentApp.email_branding = email_branding
  } catch (e) {
    console.error(e)
    toast.error(errors.BRANDING.ERROR)
  }
}

const cancelConfiguration = () => {
  bannerImage.value = currentApp.email_branding.image_url
  selectedAccentColor.value = currentApp.email_branding.background
  selectedPrimaryFont.value = currentApp.email_branding.primary_font
  primaryFontColor.value = currentApp.email_branding.primary_color
  selectedSecondaryFont.value = currentApp.email_branding.secondary_font
  secondaryFontColor.value = currentApp.email_branding.secondary_color
}

function resetToDefault() {
  bannerImage.value = ''
  selectedPrimaryFont.value = 'Nohemi'
  selectedSecondaryFont.value = 'Inter'
  primaryFontColor.value = '#1D2A31'
  secondaryFontColor.value = '#1D2A31'
  selectedAccentColor.value = '#F7F7F7'
}

const handleBannerInput = (event) => {
  bannerImage.value = event.target.value
}

onMounted(() => {
  const { email_branding } = currentApp

  bannerImage.value = email_branding.image_url
  selectedAccentColor.value = email_branding.background
  selectedPrimaryFont.value = email_branding.primary_font
  primaryFontColor.value = email_branding.primary_color
  selectedSecondaryFont.value = email_branding.secondary_font
  secondaryfonts.value = email_branding.secondary_color

  addAccentColor()
})
</script>

<template>
  <div class="flex gap-3">
    <!-- Configuration Panel -->
    <div class="w-1/2 p-4 bg-[#F7F7F7] rounded-[10px]">
      <div class="flex justify-between items-baseline">
        <h1 class="text-[22px] font-nohemi font-light mb-4 text-[#1D2A31]">
          Configuration
        </h1>
        <button
          class="flex items-center justify-center gap-2"
          @click="resetToDefault"
        >
          <img
            src="@/assets/iconography/reset-icon.svg"
            alt="next"
            class="w-3 h-3"
          />
          <span class="text-[#4C626E] text-sm font-medium"
            >Reset to Default</span
          >
        </button>
      </div>
      <div class="space-y-4">
        <!-- Background Color Section -->
        <!-- Accent Color -->
        <div class="flex flex-col gap-2">
          <h2
            class="font-medium font-inter text-base mb-2 text-[#989898] uppercase"
          >
            Background Color
          </h2>
          <div class="flex space-x-2 mb-4 overflow-auto">
            <div
              v-for="color in accentColors"
              :key="color"
              class="p-[1px] rounded-full cursor-pointer"
              :class="accentColorClass(color)"
              @click="selectedAccentColor = color"
            >
              <div
                :style="{ backgroundColor: color }"
                class="w-8 h-8 rounded-full"
              ></div>
            </div>
            <div class="flex items-center space-x-4">
              <button
                class="flex items-center justify-center w-8 h-8 border-[1.5px] border-[#1D2A31] rounded-full"
                @click="onColorPickerClick"
              >
                <img src="@/assets/iconography/plus.svg" alt="add" />
              </button>
              <input
                id="color-picker"
                v-model="selectedAccentColor"
                type="color"
                class="w-0 h-0 p-0 border-none outline-none"
                @change="addAccentColor"
              />
            </div>
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
          <h2 class="font-medium font-inter text-base text-[#989898] uppercase">
            Update Email Banner
          </h2>
          <p class="text-sm font-normal mb-2 text-liquidaqua">
            Recommended Resolution: 600x200 or above.
          </p>
          <VStack class="flex flex-1 flex-col space-y-2">
            <input
              v-model="bannerImage"
              type="text"
              placeholder="Enter banner URL"
              class="flex-1 text-black bg-[#EFEFEF] p-2 rounded-md outline-none"
            />
          </VStack>
        </div>
        <div class="flex justify-end pt-96">
          <div class="flex items-center justify-center w-52 gap-3">
            <button
              class="px-4 py-2 rounded-full transition-colors duration-300 flex-1 flex justify-center bg-[#DFECEE] text-[#1D2A31] cursor-pointer"
              @click="cancelConfiguration"
            >
              Cancel
            </button>
            <button
              class="px-4 py-2 rounded-full transition-colors duration-300 flex-1 flex justify-center bg-[#1D2A31] text-[#F7F7F7] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="disableSave"
              @click="saveConfiguration"
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
        :style="{ backgroundColor: selectedAccentColor }"
      >
        <div class="flex justify-between items-center mb-4">
          <img
            v-if="bannerImage"
            :src="bannerImage"
            alt="Logo"
            class="h-full w-full object-cover rounded-lg rounded-b-none"
          />
          <img
            v-else
            src="@/assets/email-branding.svg"
            alt="Logo"
            class="h-full w-full object-cover rounded-lg rounded-b-none"
          />
        </div>
        <div
          class="mb-60 p-8"
          :style="{ color: primaryFontColor, fontFamily: selectedPrimaryFont }"
        >
          <h1
            class="font-nohemi font-thin mb-5 text-[#1D2A31]"
            :style="{
              color: primaryFontColor,
              fontFamily: selectedPrimaryFont,
            }"
          >
            Authentication
          </h1>
          <p
            class="mb-8 text-md"
            :style="{
              color: secondaryFontColor,
              fontFamily: selectedSecondaryFont,
            }"
          >
            Use this code to sign up to Arcana’s Developer Dashboard. This code
            will expire in 10 minutes.
          </p>
          <div class="flex justify-center items-center rounded-lg">
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
            class="mt-4 text-md"
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
