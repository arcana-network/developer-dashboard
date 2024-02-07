<script setup lang="ts">
import { computed, ref } from 'vue'

import AuthProviderInput from '@/components/app-configure/auth/AuthProviderInput.vue'
import AuthProviderList from '@/components/app-configure/auth/AuthProviderList.vue'
import ConfigureActionButtons from '@/components/app-configure/ConfigureActionButtons.vue'
import { useToast } from '@/components/lib/VToast'
import { useAppsStore } from '@/stores/apps.store'
import { useLoaderStore } from '@/stores/loader.store'
import { useSocialAuthStore } from '@/stores/socialAuth.store'
import { useAppId } from '@/use/getAppId'
import {
  IAM_Providers,
  EMPTY_STRING,
  DOCS_URL,
  GLOBAL_KEYSPACE,
  isProductionDashboard,
} from '@/utils/constants'
import { content, errors } from '@/utils/content'

const appsStore = useAppsStore()
const loaderStore = useLoaderStore()
const toast = useToast()
const appId = useAppId()
const app = appsStore.app(appId)
const socialAuthStore = useSocialAuthStore()
const AUTH_TYPE_IAM = 'iam'
const LEARN_MORE_LINK = `${DOCS_URL}/howto/config-idm/`
const DEFAULT_SELECTED_AUTH_PROVIDER_VERIFIER = IAM_Providers[0].verifier
const keyspace = app.keyspace
const network = app.network

const disableMainnetNetwork = network === 'mainnet' && !isProductionDashboard

const selectedAuthProviderVerifier = ref(
  DEFAULT_SELECTED_AUTH_PROVIDER_VERIFIER
)

setIamAuth()

function setIamAuth() {
  const authProviders = IAM_Providers.map((login) => {
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

  socialAuthStore.setIAMAuthProviders(authProviders)
}

const selectedAuthProvider = computed(() => {
  return socialAuthStore.IAMAuthProviders.find(
    (authProvider) =>
      authProvider.verifier === selectedAuthProviderVerifier.value
  )!
})

function handleInput1(value: string) {
  socialAuthStore.setClientId(
    AUTH_TYPE_IAM,
    selectedAuthProviderVerifier.value,
    value
  )
}

function handleInput2(value: string) {
  socialAuthStore.setClientSecret(
    AUTH_TYPE_IAM,
    selectedAuthProviderVerifier.value,
    value
  )
}

async function handleSubmit() {
  if (keyspace === GLOBAL_KEYSPACE && disableMainnetNetwork) {
    toast.error(errors.GLOBAL_KEYSPACE_ERROR)
    return
  }
  try {
    loaderStore.showLoader(content.IAM.SAVING_INFO)
    await socialAuthStore.updateSocialAuthProviders(appId, AUTH_TYPE_IAM, app)
    await appsStore.fetchAndStoreAppConfig(appId, app.network)
    setIamAuth()
    toast.success(content.IAM.SUCCESS)
  } catch (e) {
    console.log(e)
    toast.error(errors.IAM.ERROR)
  } finally {
    loaderStore.hideLoader()
  }
}

function handleCancel() {
  const authInStore = app.auth.social.find(
    (el) => el.verifier === selectedAuthProviderVerifier.value
  )
  socialAuthStore.setClientId(
    AUTH_TYPE_IAM,
    selectedAuthProviderVerifier.value,
    authInStore?.clientId || EMPTY_STRING
  )
  socialAuthStore.setClientSecret(
    AUTH_TYPE_IAM,
    selectedAuthProviderVerifier.value,
    authInStore?.clientSecret || EMPTY_STRING
  )
}

const isEdited = computed(() => {
  return socialAuthStore.IAMAuthProviders.some((authProvider) => {
    const { clientId, clientSecret, verifier } = authProvider
    const { clientId: inputClientId, clientSecret: inputClientSecret } =
      socialAuthStore.authCredentialsInput[AUTH_TYPE_IAM][verifier]
    return clientId !== inputClientId || clientSecret !== inputClientSecret
  })
})

const areRequiredFieldsFilled = computed(() => {
  const { hasClientSecret, clientId, clientSecret } = selectedAuthProvider.value

  const verifier = selectedAuthProviderVerifier.value
  const { authCredentialsInput } = socialAuthStore
  const { clientId: inputClientId, clientSecret: inputClientSecret } =
    authCredentialsInput[AUTH_TYPE_IAM][verifier]

  if (!!clientId || !!clientSecret) {
    return hasClientSecret
      ? (!!inputClientId.length && !!inputClientSecret.length) ||
          (clientId !== inputClientId && clientSecret !== inputClientSecret)
      : clientId !== inputClientId || clientSecret !== inputClientSecret
  } else {
    return hasClientSecret
      ? inputClientId.length > 0 && inputClientSecret.length > 0
      : inputClientId.length > 0
  }
})
</script>

<template>
  <div class="border-2 border-[#363636] bg-[#1F1F1F] rounded-xl space-y-7">
    <div>
      <h2 class="text-sm uppercase font-bold p-3.5 border-b-2 border-[#363636]">
        Identity Access Managers
      </h2>
      <p class="text-[#8D8D8D] text-sm font-normal p-3.5">
        Increase adoption of your app by enabling this option. Arcana will take
        care of issuing public and prviate keys to each user through our
        Decentralised Key Generation (DKG) mechanism and keep them secure.
        <a
          :href="LEARN_MORE_LINK"
          target="_blank"
          class="no-underline uppercase text-white text-sm font-bold"
          >Learn More</a
        >
      </p>
      <p class="text-[#13a3fd] text-sm font-normal px-3.5 animate-pulse">
        {{ selectedAuthProvider.note }}
      </p>
    </div>
    <form
      class="h-64 px-3.5 pb-3.5 flex space-x-10"
      @submit.prevent="handleSubmit"
    >
      <AuthProviderList
        :providers="socialAuthStore.IAMAuthProviders"
        :auth-type="AUTH_TYPE_IAM"
        :selected-provider-verifier="selectedAuthProviderVerifier"
        @select-provider="selectedAuthProviderVerifier = $event"
      />
      <div class="flex flex-col flex-wrap justify-between w-full">
        <div class="flex-1">
          <AuthProviderInput
            :auth-provider="selectedAuthProvider"
            :auth-type="AUTH_TYPE_IAM"
            @input1="handleInput1"
            @input2="handleInput2"
          />
        </div>
        <div class="space-x-5 flex justify-end">
          <ConfigureActionButtons
            :save-disabled="!isEdited || !areRequiredFieldsFilled"
            :cancel-disabled="!isEdited"
            @cancel="handleCancel"
          />
        </div>
      </div>
    </form>
  </div>
</template>
