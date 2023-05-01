<script lang="ts" setup>
import VCard from '@/components/lib/VCard/VCard.vue'
import VSeperator from '@/components/lib/VSeperator/VSeperator.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import { useToast } from '@/components/lib/VToast'
import { useAppsStore } from '@/stores/apps.store'
import { useAppId } from '@/use/getAppId'
import copyToClipboard from '@/utils/copyToClipboard'

const toast = useToast()
const appsStore = useAppsStore()
const appId = useAppId()

const redirectUri = appsStore.app(appId).auth.redirectUri

async function copyRedirectUri() {
  try {
    await copyToClipboard(redirectUri)
    toast.success('Copied Redirect URI to clipboard')
  } catch (e) {
    toast.error('Unable to copy. Please try again or contact support')
  }
}
</script>

<template>
  <section name="redirect-uri">
    <VCard variant="elevated" class="redirect-uri-info__container">
      <VStack gap="2rem" direction="column" class="redirect-uri-info__stack">
        <VStack
          justify="space-between"
          align="center"
          class="flex-wrap justify-between"
          gap="1rem"
        >
          <h3 class="uppercase">Redirect URI</h3>
          <VCard variant="depressed" class="redirect-uri-card">
            <VStack
              align="center"
              justify="space-between"
              class="flex-1 w-full"
            >
              <span
                class="text-lg font-normal text-ellipsis redirect-uri overflow-hidden"
                :title="redirectUri"
                >{{ redirectUri }}</span
              >
              <img
                src="@/assets/iconography/copy.svg"
                class="cursor-pointer copy-icon"
                @click.stop="copyRedirectUri"
              />
            </VStack>
          </VCard>
        </VStack>
        <VSeperator class="full-bleed" />
        <p class="text-lg font-normal redirect-uri-info__description">
          Arcana automatically generates this URL for every registered app. Use
          this value to setup the callbacks in the developer console for each
          social provider that you want to support in your app.
        </p>
      </VStack>
    </VCard>
  </section>
</template>

<style scoped>
.redirect-uri-card {
  width: 20rem;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
}

.full-bleed {
  width: calc(100% + 3rem);
  margin-inline: -1.5rem;
}

.redirect-uri {
  width: 100%;
}

.redirect-uri-info__container {
  padding: 2rem 1.5rem;
}

.redirect-uri-info__stack {
  width: 100%;
}

.redirect-uri-info__description {
  color: var(--text-grey);
}

.redirect-url-info__value {
  flex-wrap: wrap;
}

@media only screen and (max-width: 1023px) {
  .redirect-uri-card {
    width: 100%;
  }
}
</style>
