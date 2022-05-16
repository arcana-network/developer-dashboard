<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { useStore } from 'vuex'

import SettingCard from '@/components/app-configure/SettingCard.vue'
import VFileUpload from '@/components/lib/VFileUpload/VFileUpload.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import { uploadLogo } from '@/services/gateway.service'

const store = useStore()

onMounted(async () => {
  store.commit('updateAppId', '181')
})

type ThemeLogoOption = {
  logo?: File
  horizontalLogo?: File
}

type ThemeLogo = {
  dark: ThemeLogoOption
  light: ThemeLogoOption
}

const themeLogos: ThemeLogo = reactive({
  dark: {
    logo: undefined,
    horizontalLogo: undefined,
  },
  light: {
    logo: undefined,
    horizontalLogo: undefined,
  },
})

const isLoading = ref(false)

function handleFileChange(
  mode: 'light' | 'dark',
  logoType: 'logo' | 'horizontalLogo',
  files: File[]
) {
  isLoading.value = true
  const orientation = logoType === 'horizontalLogo' ? 'horizontal' : ''
  uploadLogo(files[0], mode, orientation)
}

function handleFileRemove(
  mode: 'light' | 'dark',
  logoType: 'logo' | 'horizontalLogo'
) {
  themeLogos[mode][logoType] = undefined
}
</script>

<template>
  <section name="app-branding">
    <SettingCard class="app-branding-card">
      <template #title>Branding</template>
      <template #description
        >Lorem ipsum dolor sit amet, consectetuer adipiscing elit, Lorem ipsum
        dolor sit amet, consectetuer adipiscing elit.
        <a>LEARN MORE</a></template
      >
      <VStack direction="column" gap="1.5rem">
        <h3 class="text-uppercase" style="margin-top: 2rem">Upload Logo</h3>
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
                :value="themeLogos.light.logo?.name"
                @change-file="handleFileChange('light', 'logo', $event)"
                @remove-file="handleFileRemove('light', 'logo')"
              />
              <span class="body-3 font-300 file-upload-hint"
                >Image size limit 10MB and less than 50 px in height</span
              >
            </VStack>
            <VStack
              direction="column"
              gap="0.625rem"
              class="file-upload-container"
            >
              <label>Horizontal Logo</label>
              <VFileUpload
                :is-loading="isLoading"
                placeholder="Upload .png, .svg or .gif"
                allowed-file-type=".png,.svg,.gif"
                :value="themeLogos.light.horizontalLogo?.name"
                @change-file="
                  handleFileChange('light', 'horizontalLogo', $event)
                "
                @remove-file="handleFileRemove('light', 'horizontalLogo')"
              />
              <span class="body-3 font-300 file-upload-hint"
                >Image size limit 10MB and less than 50 px in height</span
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
                placeholder="Upload .png, .svg or .gif"
                allowed-file-type=".png,.svg,.gif"
                :value="themeLogos.dark.logo?.name"
                @change-file="handleFileChange('dark', 'logo', $event)"
                @remove-file="handleFileRemove('dark', 'logo')"
              />
              <span class="body-3 font-300 file-upload-hint"
                >Image size limit 10MB and less than 50 px in height</span
              >
            </VStack>
            <VStack
              direction="column"
              gap="0.625rem"
              class="file-upload-container"
            >
              <label>Horizontal Logo</label>
              <VFileUpload
                placeholder="Upload .png, .svg or .gif"
                allowed-file-type=".png,.svg,.gif"
                :value="themeLogos.dark.horizontalLogo?.name"
                @change-file="
                  handleFileChange('dark', 'horizontalLogo', $event)
                "
                @remove-file="handleFileRemove('dark', 'horizontalLogo')"
              />
              <span class="body-3 font-300 file-upload-hint"
                >Image size limit 10MB and less than 50 px in height</span
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

.theme-dropdown {
  min-width: 16rem;
}

.file-upload-container {
  flex: 0 0 24rem;
}

.file-upload-hint {
  font-size: 0.75rem;
  color: var(--text-grey);
}
</style>

<style>
.app-branding-card > * {
  z-index: 2 !important;
}
</style>
