<script setup lang="ts">
import bytes from 'bytes'
import { onMounted, ref, watchEffect } from 'vue'

import googleIcon from '@/assets/google-sso.svg'
import arcanaLogoDark from '@/assets/iconography/wallet-ui/dark/arcana-logo.svg'
import ArrowDownIconDark from '@/assets/iconography/wallet-ui/dark/arrow-down.svg'
import arrowIconDark from '@/assets/iconography/wallet-ui/dark/arrow-icon.svg'
import buyIconDark from '@/assets/iconography/wallet-ui/dark/buy-icon.svg'
import copyIconDark from '@/assets/iconography/wallet-ui/dark/copy.svg'
import dotsHorizontalDark from '@/assets/iconography/wallet-ui/dark/dots-horizontal.svg'
import nftsIconDark from '@/assets/iconography/wallet-ui/dark/nfts-icon.svg'
import notificationsIconDark from '@/assets/iconography/wallet-ui/dark/notifications-icon.svg'
import plusIconDark from '@/assets/iconography/wallet-ui/dark/plus.svg'
import profileIconDark from '@/assets/iconography/wallet-ui/dark/profile-icon.svg'
import qrCodeIconDark from '@/assets/iconography/wallet-ui/dark/qr-code.svg'
import sendIconDark from '@/assets/iconography/wallet-ui/dark/send-icon.svg'
import tokensIconDark from '@/assets/iconography/wallet-ui/dark/tokens-icon-selected.svg'
import placeholderLogo from '@/assets/iconography/wallet-ui/fallback-logo.png'
import arcanaLogoLight from '@/assets/iconography/wallet-ui/light/arcana-logo.svg'
import ArrowDownIconLight from '@/assets/iconography/wallet-ui/light/arrow-down.svg'
import arrowIconLight from '@/assets/iconography/wallet-ui/light/arrow-icon.svg'
import buyIconLight from '@/assets/iconography/wallet-ui/light/buy-icon.svg'
import copyIconLight from '@/assets/iconography/wallet-ui/light/copy.svg'
import dotsHorizontalLight from '@/assets/iconography/wallet-ui/light/dots-horizontal.svg'
import nftsIconLight from '@/assets/iconography/wallet-ui/light/nfts-icon.svg'
import notificationsIconLight from '@/assets/iconography/wallet-ui/light/notifications-icon.svg'
import plusIconLight from '@/assets/iconography/wallet-ui/light/plus.svg'
import profileIconLight from '@/assets/iconography/wallet-ui/light/profile-icon.svg'
import qrCodeIconLight from '@/assets/iconography/wallet-ui/light/qr-code.svg'
import sellIconLight from '@/assets/iconography/wallet-ui/light/sell.svg'
import sendIconLight from '@/assets/iconography/wallet-ui/light/send-icon.svg'
import tokensIconLight from '@/assets/iconography/wallet-ui/light/tokens-icon-selected.svg'
import redditIcon from '@/assets/reddit-sso.svg'
import twitchIcon from '@/assets/twitch-sso.svg'
import twitterIcon from '@/assets/twitter-sso.svg'
import { useToast } from '@/components/lib/VToast'
import {
  uploadThemeLogo,
  updateApp,
  removeThemeLogo,
} from '@/services/gateway.service'
import { useAppsStore } from '@/stores/apps.store'
import { useAppId } from '@/use/getAppId'
import { api } from '@/utils/constants'
import { content, errors } from '@/utils/content'
import getEnvApi from '@/utils/get-env-api'

const selectedTheme = ref('black-haze')
const selectedAccentColor = ref('#1862E8')
const selectedFontPairing = ref('Nohemi + Inter')
const selectedFontSize = ref(1)
const selectedFontColor = ref('#F7F7F7')
const selectedRadius = ref('M')
const showPreviewOf = ref('wallet')

const primaryFontClass = ref('nohemi')
const secondaryFontClass = ref('inter')

const appsStore = useAppsStore()
const appId = useAppId()
const currentApp = appsStore.app(appId)
const toast = useToast()

const themeLogos = ref({
  dark: {
    vertical: {
      logo: currentApp.logos.dark.vertical,
      isLoading: false,
      hasError: false,
    },
    horizontal: {
      logo: currentApp.logos.dark.horizontal,
      isLoading: false,
      hasError: false,
    },
  },
  light: {
    vertical: {
      logo: currentApp.logos.light.vertical,
      isLoading: false,
      hasError: false,
    },
    horizontal: {
      logo: currentApp.logos.light.horizontal,
      isLoading: false,
      hasError: false,
    },
  },
})

const footerIcons = {
  'black-haze': {
    tokens: tokensIconDark,
    nft: nftsIconDark,
    profile: profileIconDark,
    activity: notificationsIconDark,
  },
  'white-mist': {
    tokens: tokensIconLight,
    nft: nftsIconLight,
    profile: profileIconLight,
    activity: notificationsIconLight,
  },
}

const buttonIcons = {
  'black-haze': {
    send: sendIconDark,
    buy: buyIconDark,
    sell: buyIconDark,
  },
  'white-mist': {
    send: sendIconLight,
    buy: buyIconLight,
    sell: sellIconLight,
  },
}

const addIcon = {
  'black-haze': plusIconDark,
  'white-mist': plusIconLight,
}

const qrCodeIcon = {
  'black-haze': qrCodeIconDark,
  'white-mist': qrCodeIconLight,
}

const arcanaLogo = {
  'black-haze': arcanaLogoDark,
  'white-mist': arcanaLogoLight,
}

const arrowIcon = {
  'black-haze': arrowIconDark,
  'white-mist': arrowIconLight,
}

const dotsHorizontal = {
  'black-haze': dotsHorizontalDark,
  'white-mist': dotsHorizontalLight,
}

const arrowDownIcon = {
  'black-haze': ArrowDownIconDark,
  'white-mist': ArrowDownIconLight,
}

const copyIcon = {
  'black-haze': copyIconDark,
  'white-mist': copyIconLight,
}

const socialIcon = [googleIcon, twitterIcon, redditIcon, twitchIcon]

const buttons = ['Send', 'Buy', 'Sell']

const accentColors = ref([
  '#1862E8',
  '#55B893',
  '#5F9DBA',
  '#521AD3',
  '#BA2CE1',
  '#D73390',
  '#FFFFFF',
  '#000000',
])
const radii = ['-', 'S', 'M', 'L', 'XL']
const fontSize = [1, 2, 3]
const fontColors = {
  'black-haze': ['#F7F7F7', '#BBCCD6', '#829299'],
  'white-mist': ['#1D2A31', '#74919C', '#4C626E'],
}
const fonts = ['Nohemi + Inter', 'Syne + Onest', 'Nunito + PT Sans']

const navMenu = ['Tokens', 'NFT', 'Profile', 'Activity']

const themeClass = (theme: string) =>
  theme === selectedTheme.value
    ? 'border-2 border-[#FF4E9F]'
    : 'border-2 border-transparent'

const fontSizeClass = (size: number) =>
  size === selectedFontSize.value ? 'text-[#FF4E9F]' : 'text-[#1D2A31]'

const radiusClass = (radius: string) =>
  radius === selectedRadius.value
    ? 'border-2 border-[#FF4E9F]'
    : 'border-2 border-transparent'

const accentColorClass = (color: string) =>
  color === selectedAccentColor.value
    ? 'border-2 border-[#FF4E9F]'
    : 'border-[1.5px] border-transparent'

const updateLogo = (type: string, event: any) => {
  const file = event.target.files[0]
  console.log(`Updating ${type}:`, file)
  const theme = selectedTheme.value === 'black-haze' ? 'dark' : 'light'
  handleFileChange(
    theme,
    type === 'horizonatalLogo' ? 'horizontal' : 'vertical',
    [file]
  )
}

const deleteLogo = (type: string) => {
  const theme = selectedTheme.value === 'black-haze' ? 'dark' : 'light'
  handleFileRemove(
    theme,
    type === 'horizonatalLogo' ? 'horizontal' : 'vertical'
  )
}

const saveConfiguration = async () => {
  try {
    const { auth } = currentApp
    auth.wallet.selectedTheme =
      selectedTheme.value === 'black-haze' ? 'dark' : 'light'
    const theme_settings = {
      accent_color: selectedAccentColor.value,
      font_pairing: selectedFontPairing.value,
      font_size: String(selectedFontSize.value),
      font_color: selectedFontColor.value,
      radius: selectedRadius.value,
    }
    await updateApp(appId, { auth, theme_settings }, currentApp.network)
    toast.success(content.WALLET.THEME.SUCCESS)
    currentApp.auth.wallet.selectedTheme = auth.wallet.selectedTheme
    currentApp.theme_settings = theme_settings
  } catch (e) {
    console.error(e)
    toast.error(errors.WALLET.THEME.ERROR)
  }
}

const cancelConfiguration = () => {
  selectedTheme.value =
    currentApp.auth.wallet.theme === 'dark' ? 'black-haze' : 'white-mist'
  selectedAccentColor.value = currentApp.theme_settings.accent_color
  selectedFontPairing.value = currentApp.theme_settings.font_pairing
  selectedFontSize.value = Number(currentApp.theme_settings.font_size)
  selectedFontColor.value = currentApp.theme_settings.font_color
  selectedRadius.value = currentApp.theme_settings.radius
}

const clickLogoUpload = (id: string) => {
  document.getElementById(id).click()
}

const onColorPickerClick = () => {
  document.getElementById('color-picker').click()
}

const fontSizeStyle = (font: number) => {
  switch (font) {
    case 1:
      return 'text-xs'
    case 2:
      return 'text-sm'
    case 3:
      return 'text-base'
    default:
      return 'text-sm'
  }
}

const getRadius = (radius: string) => {
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

watchEffect(() => {
  const [primaryFont, secondaryFont] = selectedFontPairing.value.split(' + ')
  primaryFontClass.value = primaryFont?.toLowerCase()
  secondaryFontClass.value = secondaryFont?.toLowerCase()
})

watchEffect(() => {
  selectedFontColor.value = fontColors[selectedTheme.value][0]
})

const getLogo = (type: 'vertical' | 'horizontal', theme: string) => {
  return type === 'horizontal'
    ? themeLogos.value[theme].horizontal.logo
    : themeLogos.value[theme].vertical.logo
}

async function handleFileChange(
  mode: 'light' | 'dark',
  orientation: 'vertical' | 'horizontal',
  files: File[]
) {
  if (files[0].size > bytes('1 MB')) {
    return (themeLogos.value[mode][orientation].hasError = true)
  }
  themeLogos.value[mode][orientation].hasError = false
  themeLogos.value[mode][orientation].isLoading = true
  try {
    const app = appsStore.app(appId)
    await uploadThemeLogo(appId, files[0], mode, app.network, orientation)
    toast.success('Logo uploaded successfully')
    const logoUrl = `${api.gateway[app.network]}${getEnvApi(
      'v2'
    )}/app/${appId}/logo/?type=${mode}&orientation=${orientation}`
    themeLogos.value[mode][orientation].logo = `${logoUrl}&r=${Math.random()}`
    currentApp.logos[mode][orientation] = logoUrl
    appsStore.updateApp(appId, currentApp, currentApp.network)
  } catch (e) {
    console.error(e)
    toast.error("Couldn't upload logo. Please try again or contact support")
  } finally {
    themeLogos.value[mode][orientation].isLoading = false
  }
}

async function handleFileRemove(
  mode: 'light' | 'dark',
  orientation: 'vertical' | 'horizontal'
) {
  themeLogos.value[mode][orientation].isLoading = true
  try {
    const app = appsStore.app(appId)
    await removeThemeLogo(appId, mode, app.network, orientation)
    toast.success('Logo removed successfully')
    themeLogos.value[mode][orientation].logo = ''
  } catch (e) {
    console.error(e)
    toast.error("Couldn't remove logo. Please try again or contact support")
  } finally {
    themeLogos.value[mode][orientation].isLoading = false
  }
}

function onLogoError(e) {
  e.target.src = placeholderLogo
}

function addAccentColor() {
  if (!accentColors.value.includes(selectedAccentColor.value)) {
    accentColors.value.push(selectedAccentColor.value)
  }
}

onMounted(() => {
  const { auth, theme_settings } = currentApp
  console.log(currentApp, 'currentApp')

  const theme =
    auth.wallet.selectedTheme === 'dark' ? 'black-haze' : 'white-mist'
  selectedTheme.value = theme
  selectedAccentColor.value = theme_settings.accent_color
  selectedFontPairing.value = theme_settings.font_pairing
  selectedFontSize.value = Number(theme_settings.font_size)
  selectedFontColor.value = theme_settings.font_color
  selectedRadius.value = theme_settings.radius
  addAccentColor()
})

const disableSave = () => {
  const { auth, theme_settings } = currentApp
  const theme =
    auth.wallet.selectedTheme === 'dark' ? 'black-haze' : 'white-mist'

  return (
    selectedTheme.value === theme &&
    selectedAccentColor.value === theme_settings.accent_color &&
    selectedFontPairing.value === theme_settings.font_pairing &&
    selectedFontSize.value === Number(theme_settings.font_size) &&
    selectedFontColor.value === theme_settings.font_color &&
    selectedRadius.value === theme_settings.radius
  )
}

function switchPreview() {
  showPreviewOf.value = showPreviewOf.value === 'wallet' ? 'login' : 'wallet'
}

function resetToDefault() {
  selectedTheme.value = 'black-haze'
  selectedAccentColor.value = '#1862E8'
  selectedFontPairing.value = 'Nohemi + Inter'
  selectedFontSize.value = 1
  selectedFontColor.value = '#F7F7F7'
  selectedRadius.value = 'M'
}

console.log(selectedAccentColor.value, 'selectedAccentColor')
console.log(selectedTheme.value, 'selectedTheme')
console.log(selectedFontPairing.value, 'selectedFontPairing')
console.log(selectedFontSize.value, 'selectedFontSize')
console.log(selectedFontColor.value, 'selectedFontColor')
console.log(selectedRadius.value, 'selectedRadius')
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

        <!-- Fonts -->
        <div class="flex flex-col gap-2">
          <h2
            class="font-medium font-inter text-base mb-2 text-[#989898] uppercase"
          >
            Fonts
          </h2>
          <div class="flex gap-3">
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
            <div class="mb-4">
              <label
                for="font-color"
                class="block mb-1 font-normal text-sm text-[#1D2A31]"
                >Size</label
              >
              <div class="relative inline-block w-35 h-14 flex">
                <div
                  v-for="(font, index) in fontSize"
                  :key="font"
                  :class="[fontSizeStyle(index + 1), fontSizeClass(font)]"
                  class="cursor-pointer p-2 w-10 h-10 border-none text-center font-normal text-lg border flex items-center justify-center"
                  @click="selectedFontSize = font"
                >
                  AA
                  <!-- {{ font }} -->
                </div>
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
                    v-for="color in fontColors[selectedTheme]"
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
            Update Logo
          </h2>
          <div class="flex gap-8">
            <div class="mb-2">
              <label
                for="horizonatalLogo"
                class="block mb-1 font-normal text-sm text-[#1D2A31]"
                >Logo</label
              >
              <div
                v-if="
                  getLogo(
                    'horizontal',
                    selectedTheme === 'black-haze' ? 'dark' : 'light'
                  )
                "
                class="flex gap-3"
              >
                <div
                  class="bg-[#EFEFEF] border-[1px] border-[#DCDCDC] w-40 h-14 rounded-[14px] flex justify-center items-center gap-2"
                >
                  <img
                    :src="
                      getLogo(
                        'horizontal',
                        selectedTheme === 'black-haze' ? 'dark' : 'light'
                      )
                    "
                    alt="horizonatalLogo"
                    class="w-12 h-12"
                    @error="onLogoError"
                  />
                </div>
                <button @click="deleteLogo()">
                  <img
                    src="@/assets/iconography/delete-icon-logo.svg"
                    alt="delete"
                    class="w-4 h-4"
                  />
                </button>
              </div>
              <div v-else>
                <input
                  id="horizonatalLogo"
                  type="file"
                  hidden
                  class="w-full p-2 border rounded"
                  @change="updateLogo('horizonatalLogo', $event)"
                />
                <button
                  class="bg-[#EFEFEF] border-[1px] border-[#DCDCDC] w-40 h-14 rounded-[14px] flex justify-center items-center gap-2 text-sm font-normal"
                  @click="clickLogoUpload('horizonatalLogo')"
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
            <div class="mb-2">
              <label
                for="verticleLogo"
                class="block mb-1 font-normal text-sm text-[#1D2A31]"
                >Logo Mark</label
              >
              <div
                v-if="
                  getLogo(
                    'vertical',
                    selectedTheme === 'black-haze' ? 'dark' : 'light'
                  )
                "
                class="flex gap-3"
              >
                <div
                  class="bg-[#EFEFEF] border-[1px] border-[#DCDCDC] w-16 h-14 rounded-[14px] flex justify-center items-center gap-2"
                >
                  <img
                    :src="
                      getLogo(
                        'vertical',
                        selectedTheme === 'black-haze' ? 'dark' : 'light'
                      )
                    "
                    alt="verticleLogo"
                    class="w-12 h-12"
                    @error="onLogoError"
                  />
                </div>
                <button @click="deleteLogo()">
                  <img
                    src="@/assets/iconography/delete-icon-logo.svg"
                    alt="delete"
                    class="w-4 h-4"
                  />
                </button>
              </div>
              <div v-else>
                <input
                  id="verticleLogo"
                  type="file"
                  hidden
                  class="w-full p-2 border rounded"
                  @change="updateLogo('verticleLogo', $event)"
                />
                <button
                  class="bg-[#EFEFEF] border-[1px] border-[#DCDCDC] w-16 h-14 rounded-[14px] flex justify-center items-center gap-2 text-sm font-normal"
                  @click="clickLogoUpload('verticleLogo')"
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
        </div>

        <div class="flex justify-end">
          <div class="flex items-center justify-center w-52 gap-3">
            <button
              class="px-4 py-2 rounded-full transition-colors duration-300 flex-1 flex justify-center bg-[#DFECEE] text-[#1D2A31] cursor-pointer"
              @click="cancelConfiguration"
            >
              Cancel
            </button>
            <button
              class="px-4 py-2 rounded-full transition-colors duration-300 flex-1 flex justify-center bg-[#1D2A31] text-[#F7F7F7] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="disableSave()"
              @click="saveConfiguration"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview Panel -->
    <div class="w-1/2 p-4 bg-[#F7F7F7] rounded-[10px] flex flex-col">
      <h1 class="text-[22px] font-nohemi font-light mb-4 text-[#1D2A31]">
        Preview
      </h1>

      <div class="flex flex-col flex-1 gap-3 relative">
        <button v-if="showPreviewOf === 'wallet'" @click="switchPreview">
          <img
            src="@/assets/arrow-next.svg"
            alt="next"
            class="absolute right-3 bottom-1/2"
          />
        </button>
        <button v-if="showPreviewOf === 'login'" @click="switchPreview">
          <img
            src="@/assets/arrow-next.svg"
            alt="next"
            class="absolute left-3 bottom-1/2 rotate-180"
          />
        </button>
        <div class="flex-1 flex justify-center items-center">
          <!-- Wallet UI -->
          <div
            v-if="showPreviewOf === 'wallet'"
            class="rounded border flex flex-col justify-between w-[372px] h-[570px]"
            :style="{
              backgroundColor:
                selectedTheme === 'black-haze' ? '#13171A' : '#F7F7F7',
              color: selectedFontColor,
              borderRadius: `${getRadius(selectedRadius)}`,
              fontFamily: secondaryFontClass,
            }"
          >
            <div class="p-4 flex flex-col justify-between flex-1">
              <div class="flex justify-center">
                <img src="@/assets/arrow-shrink.svg" alt="shrink" />
              </div>
              <div class="flex justify-between items-center mb-4">
                <div class="flex items-center gap-2">
                  <img
                    :src="
                      getLogo(
                        'horizontal',
                        selectedTheme === 'black-haze' ? 'dark' : 'light'
                      )
                    "
                    alt="logo"
                    class="w-6 h-6"
                    @error="onLogoError"
                  />
                  <span
                    class="text-base font-normal"
                    :class="fontSizeStyle(selectedFontSize)"
                    :style="{
                      fontFamily: primaryFontClass,
                    }"
                    >xyz company</span
                  >
                </div>
                <div
                  class="flex items-center gap-2"
                  :style="{ color: selectedAccentColor }"
                >
                  <img src="@/assets/eth_logo.svg" alt="eth-logo" />

                  <img
                    :src="arrowDownIcon[selectedTheme]"
                    alt="qr-code"
                    class="svg-icon"
                    onload="SVGInject(this)"
                  />

                  <img
                    :src="qrCodeIcon[selectedTheme]"
                    alt="qr-code"
                    class="svg-icon"
                    onload="SVGInject(this)"
                  />
                </div>
              </div>
              <div>
                <div
                  class="mb-2 gap-3 h-32 p-4 rounded-xl flex flex-col justify-between"
                  :style="{
                    backgroundColor:
                      selectedTheme === 'black-haze' ? '#1D2A31' : '#E4E9EB',
                  }"
                >
                  <div class="flex gap-1 items-center">
                    <img
                      src="@/assets/iconography/wallet-ui/fallback-logo.png"
                      alt="chain"
                      class="w-6 h-6"
                    />
                    <div class="flex flex-col">
                      <div class="flex">
                        <span
                          :style="{
                            fontFamily: primaryFontClass,
                          }"
                          class="text-sm font-normal block"
                          :class="fontSizeStyle(selectedFontSize)"
                          >0xdw...9dg5</span
                        >
                        <div :style="{ color: selectedAccentColor }">
                          <img
                            :src="copyIcon[selectedTheme]"
                            alt="copy"
                            class="svg-icon"
                            onload="SVGInject(this)"
                          />
                        </div>
                      </div>
                      <span
                        class="block text-[#74919C]"
                        :style="{
                          fontFamily: secondaryFontClass,
                        }"
                        :class="[
                          selectedTheme === 'black-haze'
                            ? 'text-[#829299]'
                            : 'text-[#74919C]',
                          fontSizeStyle(selectedFontSize),
                        ]"
                        >Smart Contract Wallet Address</span
                      >
                    </div>
                  </div>
                  <div class="flex flex-col">
                    <span
                      class="text-[10px] uppercase"
                      :class="
                        selectedTheme === 'black-haze'
                          ? 'text-[#829299]'
                          : 'text-[#74919C]'
                      "
                      >Total Balance:</span
                    >

                    <div class="space-x-2">
                      <span
                        class="font-normal"
                        :class="fontSizeStyle(selectedFontSize)"
                        :style="{
                          fontFamily: primaryFontClass,
                        }"
                        >552.642</span
                      >
                      <span
                        :class="fontSizeStyle(selectedFontSize)"
                        :style="{
                          fontFamily: primaryFontClass,
                        }"
                        >ETH</span
                      >
                    </div>
                  </div>
                </div>
                <div class="flex space-x-2">
                  <button
                    v-for="button in buttons"
                    :key="button"
                    class="flex-1 flex items-center gap-2 px-4 py-2 rounded-full bg-transparent border-[1.5px]"
                    :class="fontSizeStyle(selectedFontSize)"
                    :style="{
                      borderColor: selectedAccentColor,

                      color: selectedAccentColor,
                    }"
                  >
                    <img
                      :src="buttonIcons[selectedTheme][button.toLowerCase()]"
                      alt=""
                      class="svg-icon"
                      onload="SVGInject(this)"
                    />
                    {{ button }}
                  </button>
                </div>
              </div>
              <div class="flex flex-col gap-2">
                <h2
                  class="font-light flex justify-between items-baseline"
                  :class="fontSizeStyle(selectedFontSize)"
                  :style="{
                    fontFamily: primaryFontClass,
                  }"
                >
                  <span
                    class="uppercase"
                    :class="
                      selectedTheme === 'black-haze'
                        ? 'text-[#829299]'
                        : 'text-[#74919C]'
                    "
                    >Assets</span
                  >
                </h2>
                <div
                  class="h-20 flex flex-col rounded-xl"
                  :class="fontSizeStyle(selectedFontSize)"
                  :style="{
                    backgroundColor:
                      selectedTheme === 'black-haze' ? '#1D2A31' : '#E4E9EB',
                  }"
                >
                  <div class="flex-1 p-4">
                    <div class="flex items-center justify-between mb-2">
                      <div class="flex gap-2 items-center">
                        <img
                          src="@/assets/iconography/wallet-ui/fallback-logo.png"
                          alt="chain"
                          class="w-5 h-5"
                        />
                        <span>XAR</span>
                      </div>
                      <span>0 ETH</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <div class="flex gap-2 items-center">
                        <img
                          src="@/assets/eth_logo.svg"
                          alt="chain"
                          class="w-5 h-5"
                        />
                        <span>Ethereum</span>
                      </div>
                      <span>5521.642 ETH</span>
                    </div>
                  </div>
                </div>
                <div
                  class="flex justify-center items-center rounded-b-xl gap-2"
                  :class="fontSizeStyle(selectedFontSize)"
                  :style="{
                    color: selectedAccentColor,
                  }"
                >
                  <img
                    :src="addIcon[selectedTheme]"
                    alt="new"
                    class="svg-icon"
                    onload="SVGInject(this)"
                  />
                  <span
                    :class="fontSizeStyle(selectedFontSize)"
                    :style="{
                      color: selectedAccentColor,
                    }"
                    >New Asset</span
                  >
                </div>
              </div>

              <div class="flex flex-row items-center justify-center">
                <a
                  class="text-xs font-light no-underline"
                  :class="fontSizeStyle(selectedFontSize)"
                  :style="{
                    color: selectedFontColor,
                  }"
                >
                  Powered By
                </a>
                <img
                  :src="arcanaLogo[selectedTheme]"
                  alt="Arcana Logo"
                  class="ml-1 h-[10px] align-middle"
                />
              </div>
            </div>
            <div
              class="h-16 flex justify-center items-center"
              :style="{
                backgroundColor:
                  selectedTheme === 'black-haze' ? '#1D2A31' : '#F7F7F7',
                borderRadius: `0 0 ${getRadius(selectedRadius)} ${getRadius(
                  selectedRadius
                )}`,
              }"
              :class="fontSizeStyle(selectedFontSize)"
            >
              <div class="w-[290px] flex justify-between items-center">
                <div
                  v-for="(menu, index) in navMenu"
                  :key="menu"
                  class="flex flex-col items-center gap-2"
                  :style="{
                    color: selectedAccentColor,
                  }"
                >
                  <img
                    :src="footerIcons[selectedTheme][menu.toLowerCase()]"
                    :alt="menu"
                    class="w-6 h-6"
                    :class="{
                      'svg-icon': index === 0,
                    }"
                    onload="SVGInject(this)"
                  />
                  <span class="font-light">{{ menu }}</span>
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
                borderRadius: `${getRadius(selectedRadius)}`,
                fontFamily: secondaryFontClass,
              }"
            >
              <div class="text-center h-[450px] flex flex-col justify-between">
                <img
                  :src="
                    getLogo(
                      'vertical',
                      selectedTheme === 'black-haze' ? 'dark' : 'light'
                    )
                  "
                  alt="logo"
                  class="mx-auto mb-4 w-12 h-12"
                  @error="onLogoError"
                />
                <h2
                  class="font-semibold mb-2"
                  :class="fontSizeStyle(selectedFontSize)"
                  :style="{
                    fontFamily: primaryFontClass,
                  }"
                >
                  Log in
                </h2>
                <div
                  class="w-full h-11 p-2 rounded mb-4 flex items-center"
                  :style="{
                    backgroundColor:
                      selectedTheme === 'black-haze' ? '#39444a' : '#e4e9eb',
                  }"
                >
                  <input
                    type="email"
                    placeholder="Enter your email"
                    :class="fontSizeStyle(selectedFontSize)"
                    class="w-full h-full p-2 outline-none bg-transparent"
                  />
                  <img
                    :src="arrowIcon[selectedTheme]"
                    alt="submit"
                    class="w-4 h-4"
                  />
                </div>
                <div class="flex items-center gap-2">
                  <span
                    class="flex-1 h-[1px]"
                    :style="{
                      backgroundColor:
                        selectedTheme === 'black-haze' ? '#829299' : '#C8D5D9',
                    }"
                  ></span>
                  <p
                    class="text-xs"
                    :style="{
                      color:
                        selectedTheme === 'black-haze' ? '#829299' : '#74919C',
                    }"
                  >
                    or
                  </p>
                  <span
                    class="flex-1 h-[1px]"
                    :style="{
                      backgroundColor:
                        selectedTheme === 'black-haze' ? '#829299' : '#C8D5D9',
                    }"
                  ></span>
                </div>
                <div class="flex justify-center space-x-4 mt-2">
                  <button
                    v-for="icon in socialIcon"
                    :key="icon"
                    class="p-2 rounded-full"
                    :style="{
                      backgroundColor:
                        selectedTheme === 'black-haze' ? '#39444a' : '#e4e9eb',
                    }"
                  >
                    <img :src="icon" alt="" class="w-8 h-8" />
                  </button>
                  <button
                    class="p-2 rounded-full"
                    :style="{
                      backgroundColor:
                        selectedTheme === 'black-haze' ? '#39444a' : '#e4e9eb',
                    }"
                  >
                    <img
                      :src="dotsHorizontal[selectedTheme]"
                      alt="more"
                      class="w-8 h-8"
                    />
                  </button>
                </div>
                <div class="flex items-center gap-2">
                  <span
                    class="flex-1 h-[1px]"
                    :style="{
                      backgroundColor:
                        selectedTheme === 'black-haze' ? '#829299' : '#C8D5D9',
                    }"
                  ></span>
                  <p
                    class="text-xs"
                    :style="{
                      color:
                        selectedTheme === 'black-haze' ? '#829299' : '#74919C',
                    }"
                  >
                    or
                  </p>
                  <span
                    class="flex-1 h-[1px]"
                    :style="{
                      backgroundColor:
                        selectedTheme === 'black-haze' ? '#829299' : '#C8D5D9',
                    }"
                  ></span>
                </div>
                <button
                  class="w-full h-11 px-4 py-2 text-sm font-normal text-white rounded-full"
                  :style="{
                    backgroundColor: selectedAccentColor,
                  }"
                >
                  Connect with a wallet
                </button>
                <div class="flex flex-row items-center justify-center">
                  <a
                    class="text-xs font-light no-underline"
                    :class="fontSizeStyle(selectedFontSize)"
                    :style="{
                      color: selectedFontColor,
                    }"
                  >
                    Powered By
                  </a>
                  <img
                    :src="arcanaLogo[selectedTheme]"
                    alt="Arcana Logo"
                    class="ml-1 h-[10px] align-middle"
                  />
                </div>
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

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&family=Onest:wght@100..900&family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Syne:wght@400..800&display=swap');

.pt-sans {
  font-family: 'PT Sans', sans-serif;
  font-style: normal;
}

.nunito {
  font-family: 'Nunito Sans', sans-serif;
  font-style: normal;
}

.onest {
  font-family: Onest, sans-serif;
  font-style: normal;
}

.syne {
  font-family: Syne, sans-serif;
  font-style: normal;
}

.inter {
  font-family: Inter, sans-serif;
  font-style: normal;
}

.nohemi {
  font-family: Nohemi, sans-serif;
  font-style: normal;
}

::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}
</style>
