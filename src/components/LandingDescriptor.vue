<script lang="ts" setup>
import { onMounted, ref, computed, reactive } from 'vue'
import { useRoute, useRouter, type RouteRecordName } from 'vue-router'

import OTPInput from '@/components/OTPInput.vue'
import { loginUser } from '@/services/gateway.service'
import { addUserToMailchimp } from '@/services/mailchimp.service'
import { useAppsStore } from '@/stores/apps.store'
import { useAuthStore } from '@/stores/auth.store'
import { useLoaderStore } from '@/stores/loader.store'
import useArcanaAuth from '@/use/arcanaAuth'
import { content } from '@/utils/content'
import { generateLoginInfo } from '@/utils/signerUtils'
import { isValidEmail } from '@/utils/validation'

const router = useRouter()
const route = useRoute()
const appsStore = useAppsStore()
const authStore = useAuthStore()
const loaderStore = useLoaderStore()
const arcanaAuth = useArcanaAuth()
const email = ref('')
const hasValidEmail = computed(() => isValidEmail(email.value))

function capitalize(s: string) {
  return s[0].toUpperCase() + s.substring(1)
}
const emailErrors = reactive({
  invalid: false,
  required: false,
})
const isFirstSubmitted = ref(false)
const showOTPInput = ref(false)

function resetEmailErrors() {
  emailErrors.invalid = false
  emailErrors.required = false
}

const hasEmailErrors = computed(() => {
  return emailErrors.invalid || emailErrors.required
})

function validate() {
  resetEmailErrors()
  if (!email.value.trim()) {
    emailErrors.required = true
  }
  if (!isValidEmail(email.value)) {
    emailErrors.invalid = true
  }
}

async function launchLogin(type: string) {
  try {
    if (type === 'passwordless') {
      if (!isFirstSubmitted.value) {
        validate()
        isFirstSubmitted.value = true
      }
      if (hasEmailErrors.value) return
      showOTPInput.value = true
      await loginWithOTP()
    } else {
      loaderStore.showLoader(`Signing with ${capitalize(type)}`)
      await arcanaAuth.loginWithSocial(type)
    }
    await fetchAndStoreDetails()
  } catch (e) {
    console.log(e)
    loaderStore.hideLoader()
  }
}

async function loginWithOTP() {
  try {
    await arcanaAuth.loginWithOTP(email.value.trim().toLowerCase())
  } catch (error) {
    console.log('error', 'loginWithOTP', error)
  }
}

async function fetchAndStoreDetails() {
  try {
    loaderStore.showLoader(content.APP.LOGIN.FETCHING)
    await fetchAndStoreUserInfo()
    await appsStore.fetchAndStoreAllApps('testnet')
    await appsStore.fetchAndStoreAllApps('mainnet')
  } catch (e) {
    console.error({ e })
  } finally {
    if (route.params.redirectTo) {
      await appsStore.fetchNotifications()
      router.push({
        name: route.params.redirectTo as RouteRecordName,
        ...route.params,
      })
    } else {
      router.push({ name: 'ManageApps' })
    }
    loaderStore.hideLoader()
  }
}

async function fetchAndStoreUserInfo() {
  try {
    loaderStore.showLoader(content.GENERIC.SIGNING)
    const userInfo = await arcanaAuth.fetchUserDetails()
    const loginInfoTestnet = await generateLoginInfo('testnet')
    const accessTokenTestnet = await loginUser(
      {
        signature: loginInfoTestnet.signature,
        email: userInfo.id,
        address: loginInfoTestnet.address,
      },
      'testnet'
    )
    authStore.updateAccessToken(accessTokenTestnet.data.token, 'testnet')
    authStore.updateWalletAddress(loginInfoTestnet.address)
    const loginInfoMainnet = await generateLoginInfo('mainnet')
    const accessTokenMainnet = await loginUser(
      {
        signature: loginInfoMainnet.signature,
        email: userInfo.id,
        address: loginInfoMainnet.address,
      },
      'mainnet'
    )
    authStore.updateAccessToken(accessTokenMainnet.data.token, 'mainnet')
    authStore.updateUserInfo(
      (userInfo.name as string) || 'User',
      userInfo.email || userInfo.id
    )

    if (loginInfoTestnet.nonce === 0 || loginInfoMainnet.nonce === 0) {
      addUserToMailchimp(userInfo.id)
    }
  } catch (e) {
    console.log({ e })
  }
}

onMounted(async () => {
  if (await arcanaAuth.isLoggedIn()) {
    loaderStore.showLoader(content.GENERIC.SIGNING)
    arcanaAuth.getProvider().on('connect', async () => {
      loaderStore.showLoader(content.GENERIC.SIGNING)
      await fetchAndStoreDetails()
    })
  }
})
</script>

<template>
  <div
    class="w-[70%] ml-[100px] mt-[50px] space-y-4 flex flex-col justify-center"
  >
    <h1
      style="margin-top: 1vh"
      class="text-[32px] text-black tracking-tight text-center"
    >
      Welcome to the <br />
      Developer Dashboard
    </h1>
    <p class="text-[0.85rem] text-liquiddark font-light text-center">
      Sign-in using any of these methods to get started
    </p>
    <p class="text-[0.75rem] text-liquiddark ml-[97px]">Social Login</p>
    <div class="flex flex-col items-center space-y-3">
      <button
        class="bg-[#1D2A31] hover:bg-pink flex w-[320px] rounded-3xl h-10 justify-center items-center space-x-2"
        @click.stop="launchLogin('google')"
      >
        <img src="@/assets/google-sso.svg" class="w-5" />
        <span class="text-sm font-normal text-white"> Google </span>
      </button>
      <button
        class="bg-[#1D2A31] hover:bg-pink flex w-[320px] rounded-3xl h-10 justify-center items-center space-x-2"
        @click.stop="launchLogin('twitter')"
      >
        <img src="@/assets/twitter-sso.svg" class="w-5" />
        <span class="text-sm font-normal text-white"> Twitter </span>
      </button>
      <button
        class="bg-[#1D2A31] hover:bg-pink flex w-[320px] rounded-3xl h-10 justify-center items-center space-x-2"
        @click.stop="launchLogin('github')"
      >
        <img src="@/assets/github-sso.svg" class="w-5" />
        <span class="text-sm font-normal text-white"> Github </span>
      </button>
    </div>
    <p class="text-[0.9rem] text-liquiddark text-center">Or</p>
    <p class="text-[0.75rem] text-liquiddark ml-[97px]">Email ID</p>
    <form
      class="flex justify-center items-center w-[320px] h-10 ml-[90px] bg-[#1D2A31] px-2.5 rounded-[12px] focus:border-0"
      @submit.prevent="launchLogin('passwordless')"
    >
      <input
        v-model.trim="email"
        type="email"
        class="flex-1 bg-transparent input text-white border-0 focus:outline-none focus:border-transparent"
      />
      <button
        class="flex items-center justify-center"
        :disabled="!hasValidEmail"
      >
        <img src="../assets/iconography/arrow-right-white.svg" alt="arrow" />
      </button>
    </form>
  </div>
  <Transition name="fade" class="z-[1000]">
    <OTPInput
      v-if="showOTPInput"
      @dismiss="showOTPInput = false"
      @resend="loginWithOTP"
    />
  </Transition>
</template>
