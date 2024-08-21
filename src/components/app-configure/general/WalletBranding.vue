<script setup lang="ts">
import bytes from 'bytes'
import { onMounted, ref, watchEffect } from 'vue'

import googleIcon from '@/assets/google-sso.svg'
import buyIconDark from '@/assets/iconography/wallet-ui/dark/buy-icon.svg'
import nftsIconDark from '@/assets/iconography/wallet-ui/dark/nfts-icon.svg'
import notificationsIconDark from '@/assets/iconography/wallet-ui/dark/notifications-icon.svg'
import plusIconDark from '@/assets/iconography/wallet-ui/dark/plus.svg'
import profileIconDark from '@/assets/iconography/wallet-ui/dark/profile-icon.svg'
import qrCodeIconDark from '@/assets/iconography/wallet-ui/dark/qr-code.svg'
import sellIconDark from '@/assets/iconography/wallet-ui/dark/sell.svg'
import sendIconDark from '@/assets/iconography/wallet-ui/dark/send-icon.svg'
import tokensIconDark from '@/assets/iconography/wallet-ui/dark/tokens-icon-selected.svg'
import placeholderLogo from '@/assets/iconography/wallet-ui/fallback-logo.png'
import buyIconLight from '@/assets/iconography/wallet-ui/light/buy-icon.svg'
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
const selectedColor = ref('#1862E8')
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

const socialIcon = [redditIcon, twitterIcon, googleIcon, twitchIcon]

const buttons = ['Send', 'Buy', 'Sell']

const accentColors = ref([
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
  color === selectedColor.value
    ? 'border-2 border-[#FF4E9F]'
    : 'border-[1.5px] border-transparent'

const updateLogo = (type: string, event: any) => {
  const file = event.target.files[0]
  console.log(`Updating ${type}:`, file)
  const theme = selectedTheme.value === 'black-haze' ? 'dark' : 'light'
  handleFileChange(theme, 'horizontal', [file])
  handleFileChange(theme, 'vertical', [file])
}

const deleteLogo = () => {
  const theme = selectedTheme.value === 'black-haze' ? 'dark' : 'light'
  handleFileRemove(theme, 'horizontal')
  handleFileRemove(theme, 'vertical')
}

const saveConfiguration = async () => {
  try {
    const { auth } = currentApp
    auth.wallet.selectedTheme =
      selectedTheme.value === 'black-haze' ? 'dark' : 'light'
    const theme_settings = {
      accent_color: selectedColor.value,
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
  selectedColor.value = currentApp.theme_settings.accent_color
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
  primaryFontClass.value = primaryFont.toLowerCase()
  secondaryFontClass.value = secondaryFont.toLowerCase()
})

watchEffect(() => {
  selectedFontColor.value = fontColors[selectedTheme.value][0]
})

const getLogo = (theme: string) => {
  return themeLogos.value[theme].horizontal.logo
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
  if (!accentColors.value.includes(selectedColor.value)) {
    accentColors.value.push(selectedColor.value)
  }
}

onMounted(() => {
  const { auth, theme_settings } = currentApp
  const theme =
    auth.wallet.selectedTheme === 'dark' ? 'black-haze' : 'white-mist'
  selectedTheme.value = theme
  selectedColor.value = theme_settings.accent_color
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
    selectedColor.value === theme_settings.accent_color &&
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
  selectedColor.value = '#1862E8'
  selectedFontPairing.value = 'Nohemi + Inter'
  selectedFontSize.value = 1
  selectedFontColor.value = '#F7F7F7'
  selectedRadius.value = 'M'
}
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
              @click="selectedColor = color"
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
                v-model="selectedColor"
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
                  :class="fontSizeClass(1)"
                  class="text-sm cursor-pointer"
                  @click="selectedFontSize = 1"
                  >AA</span
                >
                <span
                  :class="fontSizeClass(1.2)"
                  class="text-lg cursor-pointer"
                  @click="selectedFontSize = 1.2"
                  >AA</span
                >
                <span
                  :class="fontSizeClass(1.4)"
                  class="text-2xl cursor-pointer"
                  @click="selectedFontSize = 1.4"
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
                for="logo"
                class="block mb-1 font-normal text-sm text-[#1D2A31]"
                >Logo</label
              >
              <div
                v-if="
                  getLogo(selectedTheme === 'black-haze' ? 'dark' : 'light')
                "
                class="flex gap-3"
              >
                <div
                  class="bg-[#EFEFEF] border-[1px] border-[#DCDCDC] w-40 h-14 rounded-[14px] flex justify-center items-center gap-2"
                >
                  <img
                    :src="
                      getLogo(selectedTheme === 'black-haze' ? 'dark' : 'light')
                    "
                    alt="logo"
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
        <button @click="switchPreview">
          <img
            src="@/assets/arrow-next.svg"
            alt="next"
            class="absolute right-3 bottom-1/2"
          />
        </button>
        <button @click="switchPreview">
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
                      getLogo(selectedTheme === 'black-haze' ? 'dark' : 'light')
                    "
                    alt="logo"
                    class="w-6 h-6"
                    @error="onLogoError"
                  />
                  <span
                    class="text-base font-normal"
                    :style="{
                      fontFamily: primaryFontClass,
                      fontSize: `${selectedFontSize * 16}px`,
                    }"
                    >xyz company</span
                  >
                </div>
                <div class="flex items-center gap-2">
                  <img src="@/assets/eth_logo.svg" alt="eth-logo" />

                  <img :src="qrCodeIcon[selectedTheme]" alt="qr-code" />
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
                      <span
                        :style="{
                          fontFamily: primaryFontClass,
                          fontSize: `${selectedFontSize * 12}px`,
                        }"
                        class="text-sm font-normal block"
                        >0xdw...9dg5</span
                      >
                      <span
                        class="block text-[#74919C]"
                        :style="{
                          fontFamily: secondaryFontClass,
                          fontSize: `${selectedFontSize * 8}px`,
                        }"
                        :class="
                          selectedTheme === 'black-haze'
                            ? 'text-[#829299]'
                            : 'text-[#74919C]'
                        "
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
                        :style="{
                          fontFamily: primaryFontClass,
                          fontSize: `${selectedFontSize * 24}px`,
                        }"
                        >552.642</span
                      >
                      <span
                        :style="{
                          fontFamily: primaryFontClass,
                          fontSize: `${selectedFontSize * 14}px`,
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
                    :style="{
                      borderColor:
                        selectedTheme === 'black-haze' ? '#F7F7F7' : '#1D2A31',
                      fontSize: `${selectedFontSize * 14}px`,
                    }"
                  >
                    <img
                      :src="buttonIcons[selectedTheme][button.toLowerCase()]"
                      alt=""
                    />
                    {{ button }}
                  </button>
                </div>
              </div>
              <div class="flex flex-col gap-2">
                <h2
                  class="font-light flex justify-between items-baseline"
                  :style="{
                    fontFamily: primaryFontClass,
                    fontSize: `${selectedFontSize * 16}px`,
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
                  :style="{
                    backgroundColor:
                      selectedTheme === 'black-haze' ? '#1D2A31' : '#E4E9EB',
                    fontSize: `${selectedFontSize * 12}px`,
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
                  :style="{
                    fontSize: `${selectedFontSize * 10}px`,
                  }"
                >
                  <img :src="addIcon[selectedTheme]" alt="new" />
                  <span
                    :style="{
                      fontSize: `${selectedFontSize * 14}px`,
                    }"
                    :class="
                      selectedTheme === 'black-haze'
                        ? 'text-[#BBCCD6]'
                        : 'text-[#4C626E]'
                    "
                    >New Asset</span
                  >
                </div>
              </div>

              <div class="flex flex-row items-center justify-center">
                <a
                  class="text-xs font-light no-underline"
                  :style="{
                    color: selectedFontColor,
                    fontSize: `${selectedFontSize * 10}px`,
                  }"
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
                borderRadius: `0 0 ${getRadius(selectedRadius)} ${getRadius(
                  selectedRadius
                )}`,
                fontSize: `${selectedFontSize * 10}px`,
              }"
            >
              <div class="w-[290px] flex justify-between items-center">
                <div
                  v-for="menu in navMenu"
                  :key="menu"
                  class="flex flex-col items-center gap-2"
                >
                  <img
                    :src="footerIcons[selectedTheme][menu.toLowerCase()]"
                    :alt="menu"
                    class="w-6 h-6"
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
              <div class="text-center h-[400px] flex flex-col justify-between">
                <img
                  :src="
                    getLogo(selectedTheme === 'black-haze' ? 'dark' : 'light')
                  "
                  alt="logo"
                  class="mx-auto mb-4 w-12 h-12"
                  @error="onLogoError"
                />
                <h2
                  class="font-semibold mb-2"
                  :style="{
                    fontFamily: primaryFontClass,
                    fontSize: `${selectedFontSize * 20}px`,
                  }"
                >
                  Welcome
                </h2>
                <p
                  class="mb-4"
                  :style="{ fontSize: `${selectedFontSize * 12}px` }"
                >
                  We’ll email you a login link for a password-free sign in.
                </p>
                <input
                  v-model="email"
                  type="email"
                  placeholder="Email"
                  class="w-full px-4 py-2 border rounded mb-4"
                  :style="{ fontSize: `${selectedFontSize * 12}px` }"
                />
                <button
                  class="w-full px-4 py-2 text-white rounded"
                  :style="{
                    backgroundColor: selectedColor,
                    fontSize: `${selectedFontSize * 12}px`,
                  }"
                >
                  Get Link
                </button>
                <p
                  class="mt-4"
                  :style="{ fontSize: `${selectedFontSize * 12}px` }"
                >
                  or continue with
                </p>
                <div
                  class="flex justify-center space-x-4 mt-2"
                  :style="{
                    borderColor:
                      selectedTheme === 'black-haze' ? '#F7F7F7' : '#1D2A31',
                  }"
                >
                  <button
                    v-for="icon in socialIcon"
                    :key="icon"
                    class="p-2 border-[1px] rounded-full"
                  >
                    <img :src="icon" alt="" class="w-8 h-8" />
                  </button>
                </div>
                <div class="flex flex-row items-center justify-center mt-4">
                  <a
                    class="text-xs font-light no-underline"
                    :style="{
                      color: selectedFontColor,
                      fontSize: `${selectedFontSize * 12}px`,
                    }"
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
