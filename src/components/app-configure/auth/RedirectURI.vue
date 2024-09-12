<script lang="ts" setup>
import type { PropType } from 'vue'
import { computed } from 'vue'

import { useToast } from '@/components/lib/VToast'
import { useAppsStore } from '@/stores/apps.store'
import { useAppId } from '@/use/getAppId'
import type { SocialAuthOption } from '@/utils/constants'
import { content, errors } from '@/utils/content'
import copyToClipboard from '@/utils/copyToClipboard'

const toast = useToast()
const appsStore = useAppsStore()
const appId = useAppId()

const redirectUri = computed(() => {
  if (props.authProvider.isApple) {
    return `https://oauth.arcana.network/auth/apple/redirect/${
      appsStore.app(appId).address
    }`
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
    class="flex pt-5 space-x-4 max-[1080px]:flex-col max-[1080px]:space-x-0 max-[1080px]:space-y-4"
  >
    <VStack class="flex flex-1 flex-col space-y-2">
      <div class="flex justify-between">
        <span class="text-xs">Redirect URL</span>
      </div>
      <div
        class="flex items-center justify-between text-black bg-liquidlight p-2 rounded-md outline-none"
      >
        <span
          class="text-md font-normal text-ellipsis redirect-uri overflow-hidden"
          :title="redirectUri"
          >{{ redirectUri }}</span
        >
        <img
          src="@/assets/iconography/copy.svg"
          class="cursor-pointer copy-icon"
          @click.stop="copyRedirectUri"
        />
      </div>
    </VStack>
  </div>
</template>

<style scoped>
.redirect-uri-info__container {
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: var(--background-color);
  border: 1px solid var(--border-color);
  border-radius: 10px;
}

.redirect-uri-input {
  padding: 1rem;
  font-size: 1rem;
  color: var(--text-color);
  cursor: not-allowed;
  border: none;
  border-radius: 10px;
}

.copy-icon {
  width: 24px;
  height: 24px;
}

.redirect-uri-info__description {
  margin-top: 1rem;
  color: var(--text-grey);
}
</style>
