<script setup lang="ts">
import { reactive, ref } from 'vue'

import AuthProviderInput from '@/components/app-configure/auth/AuthProviderInput.vue'
import AuthProviderList from '@/components/app-configure/auth/AuthProviderList.vue'
import ConfigureActionButtons from '@/components/app-configure/ConfigureActionButtons.vue'
import { useAppsStore } from '@/stores/apps.store'
import { useAppId } from '@/use/getAppId'
import { IAM_Providers, type SocialAuthOption } from '@/utils/constants'

const appsStore = useAppsStore()
const appId = useAppId()
const app = appsStore.app(appId)

const providers = reactive(
  IAM_Providers.map((authProvider) => {
    const auth = app.auth.social.find(
      (el) => el.verifier === authProvider.verifier
    )
    if (auth) {
      return {
        ...authProvider,
        ...auth,
        error: '',
      }
    }
    return { ...authProvider, error: '' }
  })
)

const LearnMoreLink = 'https://docs.arcana.network/howto/config-idm/'

const DEFAULT_SELECTED_PROVIDER_VERIFIER = providers[0].verifier
const selectedProviderVerifier = ref(DEFAULT_SELECTED_PROVIDER_VERIFIER)

type InputType = 'input1' | 'input2'

function getSelectedProvider() {
  return providers.find(
    (provider) => provider.verifier === selectedProviderVerifier.value
  )!
}

function handleInput(type: InputType, value: string) {
  const selectedProvider = providers.find(
    (provider) => provider.verifier === selectedProviderVerifier.value
  )!
  if (type === 'input1') selectedProvider.clientId = value
  if (type === 'input2') selectedProvider.clientSecret = value
}

function hasSameValuesInStore(): boolean {
  const selectedProvider = providers.find(
    (provider) => provider.verifier === selectedProviderVerifier.value
  )!
  const authInStore = app.auth.social.find(
    (el) => el.verifier === selectedProvider.verifier
  )
  return !authInStore && selectedProvider.clientId === ''
}
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
          :href="LearnMoreLink"
          target="_blank"
          class="no-underline uppercase text-white text-sm font-bold"
          >Learn More</a
        >
      </p>
    </div>
    <div class="h-64 px-3.5 pb-3.5 flex space-x-10">
      <AuthProviderList
        :providers="providers"
        :selected-provider="selectedProviderVerifier"
        @select-provider="selectedProviderVerifier = $event"
      />
      <div class="flex flex-col flex-wrap justify-between w-full">
        <div class="flex-1">
          <AuthProviderInput
            :provider="getSelectedProvider()"
            @input1="(value) => handleInput('input1', value)"
            @input2="(value) => handleInput('input2', value)"
          />
        </div>
        <div class="space-x-5 flex justify-end">
          <ConfigureActionButtons
            :save-disabled="true"
            :cancel-disabled="hasSameValuesInStore()"
            @cancel="() => {}"
            @save="() => {}"
          />
        </div>
      </div>
    </div>
  </div>
</template>
