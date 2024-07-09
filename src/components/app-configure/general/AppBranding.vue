<script lang="ts" setup>
import bytes from 'bytes'
import { reactive } from 'vue'

import WalletTheme from '@/components/app-configure/general/WalletTheme.vue'
import SettingCard from '@/components/app-configure/SettingCard.vue'
import VFileUpload from '@/components/lib/VFileUpload/VFileUpload.vue'
import VSeperator from '@/components/lib/VSeperator/VSeperator.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import { useToast } from '@/components/lib/VToast'
import { uploadThemeLogo, removeThemeLogo } from '@/services/gateway.service'
import { useAppsStore } from '@/stores/apps.store'
import { useAppId } from '@/use/getAppId'
import { api } from '@/utils/constants'
import getEnvApi from '@/utils/get-env-api'

const appsStore = useAppsStore()
const toast = useToast()
const appId = useAppId()
const currentApp = appsStore.app(appId)

type OrientationOption = {
  logo?: string
  isLoading: boolean
  hasError: boolean
}

type ThemeLogoOption = {
  vertical: OrientationOption
  horizontal: OrientationOption
}

type ThemeLogo = {
  dark: ThemeLogoOption
  light: ThemeLogoOption
}

const themeLogos: ThemeLogo = reactive({
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

async function handleFileChange(
  mode: 'light' | 'dark',
  orientation: 'vertical' | 'horizontal',
  files: File[]
) {
  if (files[0].size > bytes('1 MB')) {
    return (themeLogos[mode][orientation].hasError = true)
  }
  themeLogos[mode][orientation].hasError = false
  themeLogos[mode][orientation].isLoading = true
  try {
    const app = appsStore.app(appId)
    await uploadThemeLogo(appId, files[0], mode, app.network, orientation)
    toast.success('Logo uploaded successfully')
    const logoUrl = `${api.gateway[app.network]}${getEnvApi(
      'v2'
    )}/app/${appId}/logo/?type=${mode}&orientation=${orientation}`
    themeLogos[mode][orientation].logo = logoUrl
    currentApp.logos[mode][orientation] = logoUrl
    appsStore.updateApp(appId, currentApp, currentApp.network)
  } catch (e) {
    console.error(e)
    toast.error("Couldn't upload logo. Please try again or contact support")
  } finally {
    themeLogos[mode][orientation].isLoading = false
  }
}

async function handleFileRemove(
  mode: 'light' | 'dark',
  orientation: 'vertical' | 'horizontal'
) {
  themeLogos[mode][orientation].isLoading = true
  try {
    const app = appsStore.app(appId)
    await removeThemeLogo(appId, mode, app.network, orientation)
    toast.success('Logo removed successfully')
    themeLogos[mode][orientation].logo = ''
  } catch (e) {
    console.error(e)
    toast.error("Couldn't remove logo. Please try again or contact support")
  } finally {
    themeLogos[mode][orientation].isLoading = false
  }
}
</script>

<template>
  <section name="app-branding">
    <SettingCard class="app-branding-card w-full">
      <template #title>Branding</template>
      <VStack direction="column" gap="2rem" class="w-full">
        <VStack direction="column" gap="0.5rem">
          <h3>Wallet Logo</h3>
          <VStack direction="column" gap="0.5rem" class="body-2">
            <p class="body-2 description">
              Use a wide rectangular live area to best view the horizontal logo
              on the Arcana wallet screen. The shape of the logo can vary.
            </p>
            <VStack gap="1rem">
              <p class="flex justify-center items-center example__logo-mark">
                <span class="description">Logo Mark Example:</span>
                <img
                  src="@/assets/google-logo-mark.png"
                  alt="google logo mark"
                  class="example-logo"
                />
              </p>
              <p
                class="flex justify-center items-center example__logo-horizontal"
              >
                <span class="description">Horizontal Logo Example:</span>
                <img
                  src="@/assets/google-horizontal-logo.png"
                  alt="google horizontal logo"
                  class="example-logo"
                />
              </p>
            </VStack>
          </VStack>
        </VStack>
        <VStack direction="column" gap="0.5rem">
          <h4 class="font-bold">Light Mode</h4>
          <div
            class="flex space-x-4 max-[1200px]:flex-col max-[1200px]:space-x-0 max-[1200px]:space-y-4 w-full"
          >
            <VStack direction="column" gap="0.375rem" class="flex-1">
              <label for="light-logo">Logo Mark</label>
              <VFileUpload
                id="light-logo"
                placeholder="Upload .png or .svg"
                allowed-file-type=".png,.svg"
                :value="themeLogos.light.vertical.logo"
                :is-loading="themeLogos.light.vertical.isLoading"
                @change-file="handleFileChange('light', 'vertical', $event)"
                @remove-file="handleFileRemove('light', 'vertical')"
              />
              <span
                class="body-3 font-light file-upload-hint"
                :class="{ error: themeLogos.light.vertical.hasError }"
                >Maximum image size: 1MB</span
              >
            </VStack>
            <VStack direction="column" gap="0.375rem" class="flex-1">
              <label for="light-horizontal-logo">Horizontal Logo</label>
              <VFileUpload
                id="light-horizontal-logo"
                :value="themeLogos.light.horizontal.logo"
                :is-loading="themeLogos.light.horizontal.isLoading"
                placeholder="Upload .png,or .svg"
                allowed-file-type=".png,.svg"
                @change-file="handleFileChange('light', 'horizontal', $event)"
                @remove-file="handleFileRemove('light', 'horizontal')"
              />
              <span
                class="body-3 font-light file-upload-hint"
                :class="{ error: themeLogos.light.horizontal.hasError }"
                >Maximum image size: 1MB</span
              >
            </VStack>
          </div>
        </VStack>
        <VStack direction="column" gap="0.5rem" class="w-full">
          <h4>Dark Mode</h4>
          <div
            class="flex space-x-4 max-[1200px]:flex-col max-[1200px]:space-x-0 max-[1200px]:space-y-4 w-full"
          >
            <VStack direction="column" gap="0.375rem" class="flex-1 w-full">
              <label for="dark-logo">Logo Mark</label>
              <VFileUpload
                id="dark-logo"
                :value="themeLogos.dark.vertical.logo"
                :is-loading="themeLogos.dark.vertical.isLoading"
                placeholder="Upload .png or .svg"
                allowed-file-type=".png,.svg"
                @change-file="handleFileChange('dark', 'vertical', $event)"
                @remove-file="handleFileRemove('dark', 'vertical')"
              />
              <span
                class="body-3 font-light file-upload-hint"
                :class="{ error: themeLogos.dark.vertical.hasError }"
                >Maximum image size: 1MB</span
              >
            </VStack>
            <VStack direction="column" gap="0.375rem" class="flex-1">
              <label for="dark-horizontal-logo">Horizontal Logo</label>
              <VFileUpload
                id="dark-horizontal-log"
                :value="themeLogos.dark.horizontal.logo"
                :is-loading="themeLogos.dark.horizontal.isLoading"
                placeholder="Upload .png or .svg"
                allowed-file-type=".png,.svg"
                @change-file="handleFileChange('dark', 'horizontal', $event)"
                @remove-file="handleFileRemove('dark', 'horizontal')"
              />
              <span
                class="body-3 font-light file-upload-hint"
                :class="{ error: themeLogos.dark.horizontal.hasError }"
                >Maximum image size: 1MB</span
              >
            </VStack>
          </div>
        </VStack>
      </VStack>
      <VSeperator />
      <WalletTheme />
    </SettingCard>
  </section>
</template>

<style scoped>
label,
.description {
  color: var(--text-grey);
}

h3 {
  font-size: 1.125rem;
}

.example__logo-mark {
  margin-right: 10px;
}

.example__logo-horizontal {
  margin-left: 10px;
}

.example-logo {
  height: 16px;
  margin-left: 5px;
}

.file-upload-hint {
  font-size: 0.75rem;
  color: var(--text-grey);
}

.file-upload-hint.error {
  color: #ee193f;
}
</style>
