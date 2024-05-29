<script lang="ts" setup>
import { onMounted, ref, computed, reactive } from 'vue'
import { useRoute, useRouter, type RouteRecordName } from 'vue-router'

import AppBanner from '@/components/AppBanner.vue'
import LoginHeader from '@/components/LoginHeader.vue'
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
      loaderStore.showLoader('Sending OTP...')
      if (!isFirstSubmitted.value) {
        validate()
        isFirstSubmitted.value = true
      }
      if (hasEmailErrors.value) return
      await loginWithOTP()
      showOTPInput.value = true
      loaderStore.hideLoader()
    } else {
      loaderStore.showLoader(`Signing with ${capitalize(type)}`)
      await arcanaAuth.loginWithSocial(type)
      await fetchAndStoreDetails()
    }
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
  <div class="flex flex-col bg-liquidlight">
    <AppBanner />
    <LoginHeader />
    <main
      class="relative z-10 isolate flex max-md:flex-col max-md:gap-8 h-full flex-1"
    >
      <div class="w-full max-md:mt-10 px-4 flex items-center justify-center">
        <div class="w-3/4 gap-4 flex flex-col justify-center items-center">
          <h1 class="text-rem2 max-w-xs text-black tracking-tight text-center">
            Welcome to the Developer Dashboard
          </h1>
          <p class="text-[0.85rem] text-liquiddark font-light text-center">
            Sign-in using any of these methods to get started
          </p>
          <div class="flex flex-col gap-3 flex-grow-0">
            <p class="text-[0.75rem] text-liquiddark ml-3">Social Login</p>
            <div class="flex flex-col items-center gap-3">
              <button
                class="bg-liquiddark-100 hover:bg-pink flex w-80 rounded-3xl h-10 justify-center items-center gap-2"
                @click.stop="launchLogin('google')"
              >
                <img src="@/assets/google-sso.svg" class="w-5" />
                <span class="text-sm font-normal text-white"> Google </span>
              </button>
              <button
                class="bg-liquiddark-100 hover:bg-pink flex w-80 rounded-3xl h-10 justify-center items-center gap-2"
                @click.stop="launchLogin('github')"
              >
                <img src="@/assets/github-sso.svg" class="w-5" />
                <span class="text-sm font-normal text-white"> Github </span>
              </button>
              <button
                class="bg-liquiddark-100 hover:bg-pink flex w-80 rounded-3xl h-10 justify-center items-center gap-2"
                @click.stop="launchLogin('twitch')"
              >
                <img src="@/assets/twitch-sso.svg" class="w-5" />
                <span class="text-sm font-normal text-white"> Twitch </span>
              </button>
              <button
                class="bg-liquiddark-100 hover:bg-pink flex w-80 rounded-3xl h-10 justify-center items-center gap-2"
                @click.stop="launchLogin('discord')"
              >
                <img src="@/assets/discord-sso.svg" class="w-5" />
                <span class="text-sm font-normal text-white"> Discord </span>
              </button>
            </div>
          </div>
          <p class="text-[0.9rem] text-liquiddark text-center">Or</p>
          <form
            class="flex flex-col gap-2"
            @submit.prevent="launchLogin('passwordless')"
          >
            <label
              for="login-email"
              class="text-[0.75rem] font-normal text-liquiddark ml-3"
              >Email ID</label
            >
            <div
              class="flex justify-center items-center w-[320px] h-10 bg-[#1D2A31] px-2.5 rounded-[12px] focus:border-0"
            >
              <input
                id="login-email"
                v-model.trim="email"
                type="email"
                class="flex-1 bg-transparent input text-white border-0 focus:outline-none focus:border-transparent"
              />
              <button
                class="flex items-center justify-center"
                :disabled="!hasValidEmail"
              >
                <img
                  src="../assets/iconography/arrow-right-white.svg"
                  alt="arrow"
                />
              </button>
            </div>
          </form>
        </div>
      </div>
      <div class="w-full p-6">
        <div
          class="max-w-hd flex flex-col gap-3 px-8 pt-8 bg-white rounded-3xl w-full h-full"
        >
          <h2 class="text-rem2 text-black tracking-tight font-normal text-left">
            Boost your dApp's UX
          </h2>
          <p class="text-sm text-liquiddark font-light text-left">
            Configure Auth, Wallet, Gasless and other technologies on the
            dashboard and integrate it in your app in no time.
          </p>
          <img src="@/assets/landing.png" class="mt-4 w-full" />
        </div>
      </div>
      <img
        src="@/assets/login-bg.png"
        class="max-md:hidden absolute -z-10 bottom-0 right-0 mx-auto mt-24"
      />
      <img
        src="@/assets/mobile-login-bg.png"
        class="md:hidden absolute bottom-0 -z-10 mx-auto mt-24"
      />
    </main>
    <Transition name="fade" class="z-[1000]">
      <OTPInput
        v-if="showOTPInput"
        @dismiss="showOTPInput = false"
        @resend="loginWithOTP"
        @success="fetchAndStoreDetails"
      />
    </Transition>
  </div>
</template>
