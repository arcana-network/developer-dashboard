<script lang="ts" setup>
import type { Orientation } from '@arcana/auth/types/typings'
import bytes from 'bytes'
import { reactive } from 'vue'

import WalletTheme from '@/components/app-configure/general/WalletTheme.vue'
import SettingCard from '@/components/app-configure/SettingCard.vue'
import VFileUpload from '@/components/lib/VFileUpload/VFileUpload.vue'
import VSeperator from '@/components/lib/VSeperator/VSeperator.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import { useToast } from '@/components/lib/VToast'
import { uploadThemeLogo, removeThemeLogo } from '@/services/gateway.service'
import { useAppsStore, type Theme } from '@/stores/apps.store'
import { useLoaderStore } from '@/stores/loader.store'
import { useAppId } from '@/use/getAppId'
import { api } from '@/utils/constants'
import getEnvApi from '@/utils/get-env-api'

const appsStore = useAppsStore()
const loaderStore = useLoaderStore()
const toast = useToast()
const appId = useAppId()
const currentApp = appsStore.app(appId)

type OrientationOption = {
  logo?: string
  hasError: boolean
  selectedFile: File | null
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
      hasError: false,
      selectedFile: null,
    },
    horizontal: {
      logo: currentApp.logos.dark.horizontal,
      hasError: false,
      selectedFile: null,
    },
  },
  light: {
    vertical: {
      logo: currentApp.logos.light.vertical,
      hasError: false,
      selectedFile: null,
    },
    horizontal: {
      logo: currentApp.logos.light.horizontal,
      hasError: false,
      selectedFile: null,
    },
  },
})

async function handleFileChange(
  mode: Theme,
  orientation: Orientation,
  files: File[]
) {
  if (files[0].size > bytes('1 MB')) {
    return (themeLogos[mode][orientation].hasError = true)
  }
  themeLogos[mode][orientation].hasError = false
  themeLogos[mode][orientation].selectedFile = files[0]
}

async function handleFileRemove(mode: Theme, orientation: Orientation) {
  themeLogos[mode][orientation].selectedFile = null
}

async function handleSave(mode: Theme, orientation: Orientation) {
  try {
    loaderStore.showLoader('Uploading...')
    const app = appsStore.app(appId)
    const file = themeLogos[mode][orientation].selectedFile
    await uploadThemeLogo(appId, file, mode, app.network, orientation)
    const logoUrl = `${api.gateway[app.network]}${getEnvApi(
      'v2'
    )}/app/${appId}/logo?type=${mode}&orientation=${orientation}`
    themeLogos[mode][orientation].logo = logoUrl
    themeLogos[mode][orientation].selectedFile = null
    currentApp.logos[mode][orientation] = logoUrl
    appsStore.updateApp(appId, currentApp, currentApp.network)
  } catch (e) {
    toast.error("Couldn't upload logo. Please try again or contact support")
  } finally {
    loaderStore.hideLoader()
  }
}

async function handleDelete(mode: Theme, orientation: Orientation) {
  try {
    loaderStore.showLoader('Uploading...')
    const app = appsStore.app(appId)
    await removeThemeLogo(appId, mode, app.network, orientation)
    themeLogos[mode][orientation].logo = ''
    currentApp.logos[mode][orientation] = ''
    appsStore.updateApp(appId, currentApp, currentApp.network)
  } catch (e) {
    toast.error("Couldn't remove logo. Please try again or contact support")
  } finally {
    loaderStore.hideLoader()
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
              <p class="flex justify-center items-center mr-[10px]">
                <span class="description">Logo Mark Example:</span>
                <img
                  src="@/assets/google-logo-mark.png"
                  alt="google logo mark"
                  class="h-4 ml-[5px]"
                />
              </p>
              <p class="flex justify-center items-center ml-[10px]">
                <span class="description">Horizontal Logo Example:</span>
                <img
                  src="@/assets/google-horizontal-logo.png"
                  alt="google horizontal logo"
                  class="h-4 ml-[5px]"
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
              <div
                v-if="themeLogos.light.vertical.logo"
                class="text-base font-normal flex space-x-2 bg-[#161616] p-4 rounded-[10px]"
              >
                <span>
                  {{ themeLogos.light.vertical.logo }}
                </span>
                <button
                  class="w-6"
                  @click.stop="handleDelete('light', 'vertical')"
                >
                  <img
                    src="@/assets/iconography/delete.svg"
                    alt="close icon"
                    class="w-4"
                  />
                </button>
              </div>
              <div v-else class="space-y-2">
                <VFileUpload
                  id="light-logo"
                  placeholder="Upload .png or .svg"
                  allowed-file-type=".png,.svg"
                  :value="themeLogos.light.vertical.selectedFile?.name"
                  @change-file="handleFileChange('light', 'vertical', $event)"
                  @remove-file="handleFileRemove('light', 'vertical')"
                />
                <div
                  v-if="themeLogos.light.vertical.selectedFile"
                  class="flex justify-end"
                >
                  <button
                    class="text-[#13A3FD] uppercase"
                    @click.stop="handleSave('light', 'vertical')"
                  >
                    Save
                  </button>
                </div>
                <span
                  v-else
                  class="body-3 font-light file-upload-hint"
                  :class="{ error: themeLogos.light.vertical.hasError }"
                  >Maximum image size: 1MB</span
                >
              </div>
            </VStack>
            <VStack direction="column" gap="0.375rem" class="flex-1">
              <label for="light-horizontal-logo">Horizontal Logo</label>
              <div
                v-if="themeLogos.light.horizontal.logo"
                class="text-base font-normal flex space-x-2 bg-[#161616] p-4 rounded-[10px]"
              >
                <span>{{ themeLogos.light.horizontal.logo }}</span>
                <button
                  class="w-6"
                  @click.stop="handleDelete('light', 'horizontal')"
                >
                  <img
                    src="@/assets/iconography/delete.svg"
                    alt="close icon"
                    class="w-4"
                  />
                </button>
              </div>
              <div v-else class="space-y-2">
                <VFileUpload
                  id="light-logo"
                  placeholder="Upload .png or .svg"
                  allowed-file-type=".png,.svg"
                  :value="themeLogos.light.horizontal.selectedFile?.name"
                  @change-file="handleFileChange('light', 'horizontal', $event)"
                  @remove-file="handleFileRemove('light', 'horizontal')"
                />
                <div
                  v-if="themeLogos.light.horizontal.selectedFile"
                  class="flex justify-end"
                >
                  <button
                    class="text-[#13A3FD] uppercase"
                    @click.stop="handleSave('light', 'horizontal')"
                  >
                    Save
                  </button>
                </div>
                <span
                  v-else
                  class="body-3 font-light file-upload-hint"
                  :class="{ error: themeLogos.light.horizontal.hasError }"
                  >Maximum image size: 1MB</span
                >
              </div>
            </VStack>
          </div>
        </VStack>
        <VStack direction="column" gap="0.5rem" class="w-full">
          <h4 class="uppercase font-bold">Dark Mode</h4>
          <div
            class="flex space-x-4 max-[1200px]:flex-col max-[1200px]:space-x-0 max-[1200px]:space-y-4 w-full"
          >
            <VStack direction="column" gap="0.375rem" class="flex-1 w-full">
              <label for="dark-logo">Logo Mark</label>
              <div
                v-if="themeLogos.dark.vertical.logo"
                class="text-base font-normal flex space-x-2 bg-[#161616] p-4 rounded-[10px]"
              >
                <span>{{ themeLogos.dark.vertical.logo }}</span>
                <button
                  class="w-6"
                  @click.stop="handleDelete('dark', 'vertical')"
                >
                  <img
                    src="@/assets/iconography/delete.svg"
                    alt="close icon"
                    class="w-4"
                  />
                </button>
              </div>
              <div v-else class="space-y-2">
                <VFileUpload
                  id="light-logo"
                  placeholder="Upload .png or .svg"
                  allowed-file-type=".png,.svg"
                  :value="themeLogos.dark.vertical.selectedFile?.name"
                  @change-file="handleFileChange('dark', 'vertical', $event)"
                  @remove-file="handleFileRemove('dark', 'vertical')"
                />
                <div
                  v-if="themeLogos.dark.vertical.selectedFile"
                  class="flex justify-end"
                >
                  <button
                    class="text-[#13A3FD] uppercase"
                    @click.stop="handleSave('dark', 'vertical')"
                  >
                    Save
                  </button>
                </div>
                <span
                  v-else
                  class="body-3 font-light file-upload-hint"
                  :class="{ error: themeLogos.dark.vertical.hasError }"
                  >Maximum image size: 1MB</span
                >
              </div>
            </VStack>
            <VStack direction="column" gap="0.375rem" class="flex-1">
              <label for="dark-horizontal-logo">Horizontal Logo</label>
              <div
                v-if="themeLogos.dark.horizontal.logo"
                class="text-base font-normal flex space-x-2 bg-[#161616] p-4 rounded-[10px]"
              >
                <span>{{ themeLogos.dark.horizontal.logo }}</span>
                <button
                  class="w-6"
                  @click.stop="handleDelete('dark', 'horizontal')"
                >
                  <img
                    src="@/assets/iconography/delete.svg"
                    alt="close icon"
                    class="w-4"
                  />
                </button>
              </div>
              <div v-else class="space-y-2">
                <VFileUpload
                  id="light-logo"
                  placeholder="Upload .png or .svg"
                  allowed-file-type=".png,.svg"
                  :value="themeLogos.dark.horizontal.selectedFile?.name"
                  @change-file="handleFileChange('dark', 'horizontal', $event)"
                  @remove-file="handleFileRemove('dark', 'horizontal')"
                />
                <div
                  v-if="themeLogos.dark.horizontal.selectedFile"
                  class="flex justify-end"
                >
                  <button
                    class="text-[#13A3FD] uppercase"
                    @click.stop="handleSave('dark', 'horizontal')"
                  >
                    Save
                  </button>
                </div>
                <span
                  v-else
                  class="body-3 font-light file-upload-hint"
                  :class="{ error: themeLogos.dark.horizontal.hasError }"
                  >Maximum image size: 1MB</span
                >
              </div>
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

.file-upload-hint {
  font-size: 0.75rem;
  color: var(--text-grey);
}

.file-upload-hint.error {
  color: #ee193f;
}
</style>
