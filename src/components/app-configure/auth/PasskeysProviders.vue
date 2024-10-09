<script setup lang="ts">
import { computed, ref } from 'vue'

import ConfigureActionButtons from '@/components/app-configure/ConfigureActionButtons.vue'
import { useToast } from '@/components/lib/VToast'
import { useAppsStore } from '@/stores/apps.store'
import { useLoaderStore } from '@/stores/loader.store'
import { useSocialAuthStore } from '@/stores/socialAuth.store'
import { useAppId } from '@/use/getAppId'
import {
  passkeyLogins,
  EMPTY_STRING,
  DOCS_URL,
  GLOBAL_KEYSPACE,
  isProductionDashboard,
} from '@/utils/constants'
import { content, errors } from '@/utils/content'

const appsStore = useAppsStore()
const appId = useAppId()
const loaderStore = useLoaderStore()
const toast = useToast()
const app = appsStore.app(appId)
const socialAuthStore = useSocialAuthStore()

// Constants
const AUTH_TYPE_SOCIAL = 'passkey'
const LEARN_MORE_LINK = `${DOCS_URL}/howto/config_social/index.html`
const DEFAULT_SELECTED_AUTH_PROVIDER_VERIFIER = passkeyLogins[0].verifier
const keyspace = app.keyspace
const network = app.network

const disableMainnetNetwork = network === 'mainnet' && !isProductionDashboard

// Reactive references
const selectedAuthProviderVerifier = ref(
  DEFAULT_SELECTED_AUTH_PROVIDER_VERIFIER
)
const isEdited = ref<boolean>(false)

setIamAuth()

function setIamAuth() {
  const authProviders = passkeyLogins.map((login) => {
    const auth = app.auth.social.find((el) => el.verifier === login.verifier)
    const credentials = {
      clientId: auth?.clientId || '',
      clientSecret: auth?.clientSecret || '',
    }
    return {
      ...login,
      ...credentials,
      error: '',
    }
  })

  socialAuthStore.setPasskeyAuthProviders(authProviders)
}

//Provider Selected
const selectedAuthProvider = computed(() => {
  return socialAuthStore.passkeyAuthProviders.find(
    (authProvider) =>
      authProvider.verifier === selectedAuthProviderVerifier.value
  )!
})

// URL Validation Function
const isUrlValid = (url: string): boolean => {
  //Email Validation Regex
  const urlPattern =
    /^(http:\/\/|https:\/\/)?[a-zA-Z0-9-_]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?([\/\w .-]*)*\/?$/
  return urlPattern.test(url)
}

// Function to Handle Input Change
const handleChange = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  const isEmpty = value.length === 0
  isEdited.value = !isEmpty && isUrlValid(value)

  socialAuthStore.setClientId(
    AUTH_TYPE_SOCIAL,
    selectedAuthProviderVerifier.value,
    String(appId)
  )
  socialAuthStore.setProvider(
    AUTH_TYPE_SOCIAL,
    selectedAuthProviderVerifier.value,
    'passkey'
  )
  socialAuthStore.setClientSecret(
    AUTH_TYPE_SOCIAL,
    selectedAuthProviderVerifier.value,
    value
  )
}

// Submit Logic
const handleSubmit = async () => {
  if (keyspace === GLOBAL_KEYSPACE && disableMainnetNetwork) {
    toast.error(errors.GLOBAL_KEYSPACE_ERROR)
    return
  }
  if (isEdited.value) {
    try {
      loaderStore.showLoader(content.SOCIAL_AUTH.SAVING)
      await socialAuthStore.updateSocialAuthProviders(
        appId,
        AUTH_TYPE_SOCIAL,
        app
      )

      await appsStore.fetchAndStoreAppConfig(appId, app.network)
      setIamAuth()
      toast.success(content.SOCIAL_AUTH.SUCCESS)
    } catch (e) {
      console.log(e)
      toast.error(errors.SOCIAL_AUTH.ERROR)
    } finally {
      loaderStore.hideLoader()
    }
  }
}

// Cancel Logic
function handleCancel() {
  const authInStore = app.auth.social.find(
    (el) => el.verifier === selectedAuthProviderVerifier.value
  )
  socialAuthStore.setClientId(
    AUTH_TYPE_SOCIAL,
    selectedAuthProviderVerifier.value,
    authInStore?.clientId || EMPTY_STRING
  )
  socialAuthStore.setClientSecret(
    AUTH_TYPE_SOCIAL,
    selectedAuthProviderVerifier.value,
    authInStore?.clientSecret || EMPTY_STRING
  )
}
</script>

<template>
  <div class="bg-white rounded-xl space-y-7">
    <div>
      <h3 class="p-7 border-b-[1px] border-liquidgrey">Passkeys</h3>
      <p class="text-liquiddark text-sm font-normal p-3.5">
        Provide your users the convenience of using magic links delivered to
        their email addresses that they can click on to authenticate themselves
        instead of using passwords.
        <a
          :href="LEARN_MORE_LINK"
          target="_blank"
          class="no-underline uppercase text-black text-sm font-bold"
          >Learn More</a
        >
      </p>
    </div>
    <form class="px-3.5 pb-3.5 flex space-x-10" @submit.prevent="handleSubmit">
      <div class="flex flex-col flex-wrap justify-between w-full">
        <div class="flex-1 w-6/12">
          <VStack class="flex flex-1 flex-col space-y-2">
            <div class="flex w-full justify-between">
              <legend class="text-[#8D8D8D] text-xs font-normal">
                <span>{{ selectedAuthProvider.inputLabels.label1 }}</span>
                <span class="text-liquidred text-lg">*</span>
              </legend>
            </div>
            <input
              class="flex-1 text-black bg-liquidlight p-2 rounded-md outline-none"
              :placeholder="selectedAuthProvider.inputLabels.label1"
              :value="
                socialAuthStore.authCredentialsInput[AUTH_TYPE_SOCIAL][
                  selectedAuthProvider.verifier
                ]?.clientSecret
              "
              @input="handleChange"
            />
          </VStack>
        </div>
        <div class="space-x-5 flex justify-end">
          <ConfigureActionButtons
            :save-disabled="!isEdited"
            :cancel-disabled="!isEdited"
            @cancel="handleCancel"
          />
        </div>
      </div>
    </form>
  </div>
</template>
