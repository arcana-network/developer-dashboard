<script lang="ts" setup>
import type { PropType } from 'vue'
import { computed } from 'vue'

import { useToast } from '@/components/lib/VToast'
import { useAppsStore } from '@/stores/apps.store'
import { useAppId } from '@/use/getAppId'
import {
  api,
  isProductionDashboard,
  type SocialAuthOption,
} from '@/utils/constants'
import { content, errors } from '@/utils/content'
import copyToClipboard from '@/utils/copyToClipboard'

const toast = useToast()
const appsStore = useAppsStore()
const appId = useAppId()

const redirectUri = computed(() => {
  if (props.authProvider.isApple) {
    const app = appsStore.app(appId)
    const base = isProductionDashboard
      ? app.network === 'mainnet'
        ? api.appleRedirct.mainnet
        : api.appleRedirct.testnet
      : app.network === 'mainnet'
      ? api.appleRedirct.testnet
      : api.appleRedirct.dev
    return `${base}/auth/apple/redirect/${appsStore.app(appId).address}`
  }
  return appsStore.app(appId).auth.redirectUri
})

async function copyRedirectUri() {
  try {
    await copyToClipboard(redirectUri.value)
    toast.success(content.REDIRECT_URI.COPIED)
  } catch (e) {
    toast.error(errors.REDIRECT_URI.ERROR)
  }
}

const props = defineProps({
  authProvider: {
    type: Object as PropType<SocialAuthOption>,
    required: true,
  },
  authType: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div
    class="flex pt-5 space-x-4 max-px1080:flex-col max-px1080:space-x-0 max-px1080:space-y-4"
  >
    <VStack class="flex flex-1 flex-col space-y-2">
      <div class="flex justify-between">
        <span class="text-xs">Redirect URL</span>
      </div>
      <div
        class="flex items-center justify-between text-black_solid-default bg-whitemist-default p-2 rounded-md outline-none"
      >
        <span
          class="text-md font-normal text-ellipsis redirect-uri overflow-hidden"
          :title="redirectUri"
          >{{ redirectUri }}</span
        >
        <img
          src="@/assets/iconography/copy.svg"
          class="cursor-pointer w-px24 h-px24"
          @click.stop="copyRedirectUri"
        />
      </div>
    </VStack>
  </div>
</template>
