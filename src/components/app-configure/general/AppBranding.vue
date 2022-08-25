<script lang="ts" setup>
import bytes from 'bytes'
import { reactive } from 'vue'
import { useRoute } from 'vue-router'

import SettingCard from '@/components/app-configure/SettingCard.vue'
import VFileUpload from '@/components/lib/VFileUpload/VFileUpload.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import { useToast } from '@/components/lib/VToast'
import { uploadThemeLogo, removeThemeLogo } from '@/services/gateway.service'
import { useAppsStore } from '@/stores/apps.store'
import getEnvApi from '@/utils/get-env-api'

const appsStore = useAppsStore()
const toast = useToast()
const route = useRoute()
const appId = Number(route.params.appId)
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
  if (files[0].size > bytes('2 MB')) {
    return (themeLogos[mode][orientation].hasError = true)
  }
  themeLogos[mode][orientation].hasError = false
  themeLogos[mode][orientation].isLoading = true
  try {
    await uploadThemeLogo(appId, files[0], mode, orientation)
    toast.success('Logo uploaded successfully')
    const logoUrl = `${getEnvApi(
      'v2'
    )}/app/${appId}/logo?type=${mode}&orientation=${orientation}`
    themeLogos[mode][orientation].logo = logoUrl
    currentApp.logos[mode][orientation] = logoUrl
    appsStore.updateApp(appId, currentApp)
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
    await removeThemeLogo(appId, mode, orientation)
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
    <SettingCard class="app-branding-card">
      <template #title>Branding</template>
      <VStack direction="column" gap="1.5rem">
        <h3 class="text-uppercase">Upload Logo</h3>
        <VStack direction="column" gap="1rem">
          <h4 class="text-uppercase font-700">Light Mode</h4>
          <VStack gap="4rem" md-gap="2rem" wrap>
            <VStack
              direction="column"
              gap="0.625rem"
              class="file-upload-container"
            >
              <label>Logo Mark</label>
              <VFileUpload
                placeholder="Upload .png, .svg or .gif"
                allowed-file-type=".png,.svg,.gif"
                :value="themeLogos.light.vertical.logo"
                :is-loading="themeLogos.light.vertical.isLoading"
                class="file-upload-input"
                @change-file="handleFileChange('light', 'vertical', $event)"
                @remove-file="handleFileRemove('light', 'vertical')"
              />
              <span
                class="body-3 font-300 file-upload-hint"
                :class="{ error: themeLogos.light.vertical.hasError }"
                >Image size limit 2MB</span
              >
            </VStack>
            <VStack
              direction="column"
              gap="0.625rem"
              class="file-upload-container"
            >
              <label>Horizontal Logo</label>
              <VFileUpload
                :value="themeLogos.light.horizontal.logo"
                :is-loading="themeLogos.light.horizontal.isLoading"
                class="file-upload-input"
                placeholder="Upload .png, .svg or .gif"
                allowed-file-type=".png,.svg,.gif"
                @change-file="handleFileChange('light', 'horizontal', $event)"
                @remove-file="handleFileRemove('light', 'horizontal')"
              />
              <span
                class="body-3 font-300 file-upload-hint"
                :class="{ error: themeLogos.light.horizontal.hasError }"
                >Image size limit 2MB</span
              >
            </VStack>
          </VStack>
        </VStack>
        <VStack direction="column" gap="1rem">
          <h4 class="text-uppercase font-700">Dark Mode</h4>
          <VStack gap="4rem" md-gap="2rem" wrap>
            <VStack
              direction="column"
              gap="0.625rem"
              class="file-upload-container"
            >
              <label>Logo Mark</label>
              <VFileUpload
                :value="themeLogos.dark.vertical.logo"
                :is-loading="themeLogos.dark.vertical.isLoading"
                placeholder="Upload .png, .svg or .gif"
                class="file-upload-input"
                allowed-file-type=".png,.svg,.gif"
                @change-file="handleFileChange('dark', 'vertical', $event)"
                @remove-file="handleFileRemove('dark', 'vertical')"
              />
              <span
                class="body-3 font-300 file-upload-hint"
                :class="{ error: themeLogos.dark.vertical.hasError }"
                >Image size limit 2MB</span
              >
            </VStack>
            <VStack
              direction="column"
              gap="0.625rem"
              class="file-upload-container"
            >
              <label>Horizontal Logo</label>
              <VFileUpload
                :value="themeLogos.dark.horizontal.logo"
                :is-loading="themeLogos.dark.horizontal.isLoading"
                placeholder="Upload .png, .svg or .gif"
                class="file-upload-input"
                allowed-file-type=".png,.svg,.gif"
                @change-file="handleFileChange('dark', 'horizontal', $event)"
                @remove-file="handleFileRemove('dark', 'horizontal')"
              />
              <span
                class="body-3 font-300 file-upload-hint"
                :class="{ error: themeLogos.dark.horizontal.hasError }"
                >Image size limit 2MB</span
              >
            </VStack>
          </VStack>
        </VStack>
      </VStack>
    </SettingCard>
  </section>
</template>

<style scoped>
label {
  color: var(--text-grey);
}

.file-upload-container {
  flex: 0 0 24rem;
}

.file-upload-hint {
  font-size: 0.75rem;
  color: var(--text-grey);
}

.file-upload-hint.error {
  color: #ee193f;
}

.file-upload-input {
  max-width: 20rem;
}
</style>
