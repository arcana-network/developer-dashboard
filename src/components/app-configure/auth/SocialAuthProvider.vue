<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import AuthProviderInput from '@/components/app-configure/auth/AuthProviderInput.vue'
import AuthProviderList from '@/components/app-configure/auth/AuthProviderList.vue'
import ConfigureActionButtons from '@/components/app-configure/ConfigureActionButtons.vue'
import { useToast } from '@/components/lib/VToast'
import { useAppsStore } from '@/stores/apps.store'
import { useLoaderStore } from '@/stores/loader.store'
import { useSocialAuthStore } from '@/stores/socialAuth.store'
import { useAppId } from '@/use/getAppId'
import {
  socialLogins as defaultSocialLogins,
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
const socialLogins = defaultSocialLogins.filter((login) => {
  if (isProductionDashboard && app.network === 'mainnet') {
    return login.verifier !== 'apple' && login.verifier !== 'telegram'
  }
  return true
})
const AUTH_TYPE_SOCIAL = 'social'
const LEARN_MORE_LINK = `${DOCS_URL}/howto/config_social/index.html`
const DEFAULT_SELECTED_AUTH_PROVIDER_VERIFIER = socialLogins[0].verifier
const keyspace = app.keyspace
const network = app.network

const disableMainnetNetwork = network === 'mainnet' && !isProductionDashboard

const selectedAuthProviderVerifier = ref(
  DEFAULT_SELECTED_AUTH_PROVIDER_VERIFIER
)

setIamAuth()

function setIamAuth() {
  const authProviders = socialLogins.map((login) => {
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

  socialAuthStore.setSocialAuthProviders(authProviders)
}

const selectedAuthProvider = computed(() => {
  return socialAuthStore.socialAuthProviders.find(
    (authProvider) =>
      authProvider.verifier === selectedAuthProviderVerifier.value
  )!
})

function handleInput1(value: string) {
  socialAuthStore.setClientId(
    AUTH_TYPE_SOCIAL,
    selectedAuthProviderVerifier.value,
    value
  )
}

function handleInput2(value: string) {
  socialAuthStore.setClientSecret(
    AUTH_TYPE_SOCIAL,
    selectedAuthProviderVerifier.value,
    value
  )
}
function handleInput3(value: string) {
  socialAuthStore.setTeamId(
    AUTH_TYPE_SOCIAL,
    selectedAuthProviderVerifier.value,
    value
  )
}

function handleInput4(value: string) {
  socialAuthStore.setKeyId(
    AUTH_TYPE_SOCIAL,
    selectedAuthProviderVerifier.value,
    value
  )
}

function handleInput5(value: string) {
  socialAuthStore.setPrivateKey(
    AUTH_TYPE_SOCIAL,
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
    loaderStore.showLoader(content.SOCIAL_AUTH.SAVING)
    await socialAuthStore.updateSocialAuthProviders(
      appId,
      AUTH_TYPE_SOCIAL,
      app
    )
    console.log('fetching app config', app.auth.social)
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

const isEdited = computed(() => {
  return socialAuthStore.socialAuthProviders.some((authProvider) => {
    const { clientId, clientSecret, verifier } = authProvider
    const { clientId: inputClientId, clientSecret: inputClientSecret } =
      socialAuthStore.authCredentialsInput[AUTH_TYPE_SOCIAL][verifier]
    return clientId !== inputClientId || clientSecret !== inputClientSecret
  })
})

const areRequiredFieldsFilled = computed(() => {
  const { hasClientSecret, clientId, clientSecret } = selectedAuthProvider.value

  const verifier = selectedAuthProviderVerifier.value
  const { clientId: inputClientId, clientSecret: inputClientSecret } =
    socialAuthStore.authCredentialsInput[AUTH_TYPE_SOCIAL][verifier]

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

watch(
  () => selectedAuthProviderVerifier.value,
  () => {
    const verifier = selectedAuthProviderVerifier.value
    if (verifier === 'steam') handleInput1(app.address)
    if (verifier === 'telegram') handleInput1(app.address)
  }
)

socialAuthStore.$subscribe((mutation) => {
  const verifier = selectedAuthProviderVerifier.value
  const key = mutation.events.key
  const newValue = mutation.events.newValue
  if (verifier === 'steam' && key === 'clientSecret') {
    if (newValue === '') handleInput1('')
    if (newValue.length) handleInput1(app.address)
  }
})
</script>

<template>
  <div class="bg-white rounded-xl space-y-7">
    <div>
      <h3 class="p-7 border-b-[1px] border-liquidgrey">Social Auth</h3>
      <p class="text-liquiddark text-sm font-normal p-3.5">
        Increase adoption of your app by enabling this option. Arcana will take
        care of issuing public and prviate keys to each user through our
        Decentralised Key Generation (DKG) mechanism and keep them secure.
        <a
          :href="LEARN_MORE_LINK"
          target="_blank"
          class="no-underline uppercase text-black text-sm font-bold"
          >Learn More</a
        >
      </p>
      <p class="text-liquidaqua text-sm font-normal px-3.5 animate-pulse">
        {{ selectedAuthProvider.note }}
      </p>
    </div>
    <form class="px-3.5 pb-3.5 flex space-x-10" @submit.prevent="handleSubmit">
      <AuthProviderList
        :providers="socialAuthStore.socialAuthProviders"
        :auth-type="AUTH_TYPE_SOCIAL"
        :selected-provider-verifier="selectedAuthProviderVerifier"
        @select-provider="selectedAuthProviderVerifier = $event"
      />
      <div class="flex flex-col flex-wrap justify-between w-full">
        <div class="flex-1">
          <AuthProviderInput
            :auth-provider="selectedAuthProvider"
            :auth-type="AUTH_TYPE_SOCIAL"
            @input1="handleInput1"
            @input2="handleInput2"
            @input3="handleInput3"
            @input4="handleInput4"
            @input5="handleInput5"
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
