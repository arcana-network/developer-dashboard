<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter, type RouteRecordName } from 'vue-router'

import AppBanner from '@/components/AppBanner.vue'
import LandingDescriptor from '@/components/LandingDescriptor.vue'
import VButtonSecondary from '@/components/lib/VButtonSecondary/VButtonSecondary.vue'
import VTextFieldSecondary from '@/components/lib/VTextFieldSecondary/VTextFieldSecondary.vue'
import VTooltip from '@/components/lib/VTooltip/VTooltip.vue'
import LoginFooter from '@/components/LoginFooter.vue'
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

async function launchLogin(type: string) {
  try {
    if (type === 'passwordless') {
      if (!hasValidEmail.value) return
      loaderStore.showLoader(content.APP.LOGIN.CLICK)
      await arcanaAuth.loginWithLink(email.value)
    } else {
      loaderStore.showLoader(`Signing with ${capitalize(type)}`)
      await arcanaAuth.loginWithSocial(type)
    }
    await fetchAndStoreDetails()
  } catch (e) {
    console.error(e)
    loaderStore.hideLoader()
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
  <div class="flex flex-col bg-[#f7f7f7]">
    <AppBanner />
    <main class="flex flex-col md:flex-row">
      <LandingDescriptor />
      <section
        class="z-[10] lg:z-[0] grid place-items-center px-2 md:px-0 w-full md:mt-[140px]"
      >
        <div
          class="max-w-[700px] md:space-y-9 p-2 py-[4vh] md:py-[10vh] lg:my-0 bg-white rounded-[25px] w-fit lg:w-[700px] h-[300px] md:h-[500px]"
        >
          <div
            class="p-2 space-y-2 md:space-y-4 text-center flex flex-col items-center justify-center"
          >
            <h1
              class="text-[24px] md:text-[32px] font-bold leading-7 tracking-tight md:tracking-normal text-black"
            >
              Welcome to Developer Dashboard
            </h1>
            <h5
              class="font-light text-[12px] md:text-[1rem] text-black text-left md:text-center"
            >
              We’ll email you a login link for a password-free sign in.
            </h5>
          </div>
          <form
            class="flex column items-center -space-y-4"
            @submit.prevent="launchLogin('passwordless')"
          >
            <VTextFieldSecondary
              v-model.trim="email"
              label="Email"
              placeholder="someone@gmail.com"
              class="w-full max-w-[20rem]"
              color="white"
            />
            <VButtonSecondary
              label="Send Link"
              class="w-full max-w-[20rem]"
              type="submit"
              :disabled="!hasValidEmail"
            />
          </form>
          <section
            class="flex justify-center flex-wrap space-y-1 md:space-y-0 mt-5 md:mt-0"
          >
            <div class="flex items-center">
              <span class="font-light text-[#8f8e8f] text-[11px] md:text-[14px]"
                >Or sign in with
              </span>
            </div>
            <div class="flex flex-wrap">
              <VTooltip title="Sign in with Google">
                <img
                  class="inline-block w-[25px] ml-4 cursor-pointer hover:opacity-80 transition-opacity duration-300"
                  src="@/assets/google-sso.svg"
                  @click.stop="launchLogin('google')"
                />
              </VTooltip>
              <VTooltip title="Sign in with Github">
                <img
                  class="inline-block w-[25px] ml-4 cursor-pointer hover:opacity-80 transition-opacity duration-300"
                  src="@/assets/github-sso-light.svg"
                  @click.stop="launchLogin('github')"
                />
              </VTooltip>
              <VTooltip title="Sign in with Twitch">
                <img
                  class="inline-block w-[25px] ml-4 cursor-pointer hover:opacity-80 transition-opacity duration-300"
                  src="@/assets/twitch-sso.svg"
                  @click.stop="launchLogin('twitch')"
                />
              </VTooltip>
              <VTooltip title="Sign in with Discord">
                <img
                  class="inline-block w-[25px] ml-4 cursor-pointer hover:opacity-80 transition-opacity duration-300"
                  src="@/assets/discord-sso.svg"
                  @click.stop="launchLogin('discord')"
                />
              </VTooltip>
            </div>
          </section>
        </div>
      </section>
      <img
        src="@/assets/login-bg.png"
        class="mobile-remove tablet-remove absolute z-[2] bottom-0 block mx-auto mt-24 md:h-[55vh]"
      />
      <img
        src="@/assets/mobile-login-bg.png"
        class="laptop-hide absolute bottom-0 block mx-auto mt-24"
      />
    </main>
    <LoginFooter class="mobile-remove" />
  </div>
</template>
