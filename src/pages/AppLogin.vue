<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter, type RouteRecordName } from 'vue-router'

import AppFooter from '@/components/AppFooter.vue'
import LandingDescriptor from '@/components/LandingDescriptor.vue'
import VButton from '@/components/lib/VButton/VButton.vue'
import VTextField from '@/components/lib/VTextField/VTextField.vue'
import VTooltip from '@/components/lib/VTooltip/VTooltip.vue'
import { loginUser } from '@/services/gateway.service'
import { addUserToMailchimp } from '@/services/mailchimp.service'
import { useAppsStore } from '@/stores/apps.store'
import { useAuthStore } from '@/stores/auth.store'
import { useLoaderStore } from '@/stores/loader.store'
import useArcanaAuth from '@/use/arcanaAuth'
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
      loaderStore.showLoader(
        `Click on the verification link sent to your email.`
      )
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
    loaderStore.showLoader('Fetching user info...')
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
    loaderStore.showLoader('Signing In...')
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
    loaderStore.showLoader('Connecting wallet...')
    arcanaAuth.getProvider().on('connect', async () => {
      loaderStore.showLoader('Signing in...')
      await fetchAndStoreDetails()
    })
  }
})
</script>

<template>
  <div class="flex flex-col">
    <main class="flex divide-x-[1px] divide-[#8d8d8d33]">
      <LandingDescriptor />
      <section class="grid place-items-center w-full">
        <div class="max-w-[640px] space-y-9 p-2 my-[5vh] lg:my-0">
          <img
            src="@/assets/logo.svg"
            alt="Arcana Logo"
            class="laptop-remove m-auto"
          />
          <div class="space-y-4 text-center">
            <h1 class="text-4xl font-bold tracking-normal">Welcome</h1>
            <h5 class="font-light text-xl">
              We’ll email you a login link for a password-free sign in.
            </h5>
          </div>
          <form
            class="flex column items-center space-y-1"
            @submit.prevent="launchLogin('passwordless')"
          >
            <VTextField
              v-model.trim="email"
              label="Email"
              placeholder="Enter your email"
              class="w-full max-w-[25rem]"
            />
            <VButton
              label="SEND LINK"
              class="w-full max-w-[18rem]"
              type="submit"
              :disabled="!hasValidEmail"
            />
          </form>
          <section class="flex justify-center flex-wrap space-y-1">
            <div class="flex items-center">
              <span class="font-light text-white">Or sign in with </span>
            </div>
            <div class="flex flex-wrap">
              <VTooltip title="Sign in with Google">
                <img
                  class="inline-block w-[30px] ml-8 cursor-pointer hover:opacity-80 transition-opacity duration-300"
                  src="@/assets/google-sso.svg"
                  @click.stop="launchLogin('google')"
                />
              </VTooltip>
              <VTooltip title="Sign in with Github">
                <img
                  class="inline-block w-[30px] ml-8 cursor-pointer hover:opacity-80 transition-opacity duration-300"
                  src="@/assets/github-sso.svg"
                  @click.stop="launchLogin('github')"
                />
              </VTooltip>
              <VTooltip title="Sign in with Twitch">
                <img
                  class="inline-block w-[30px] ml-8 cursor-pointer hover:opacity-80 transition-opacity duration-300"
                  src="@/assets/twitch-sso.svg"
                  @click.stop="launchLogin('twitch')"
                />
              </VTooltip>
              <VTooltip title="Sign in with Discord">
                <img
                  class="inline-block w-[30px] ml-8 cursor-pointer hover:opacity-80 transition-opacity duration-300"
                  src="@/assets/discord-sso.svg"
                  @click.stop="launchLogin('discord')"
                />
              </VTooltip>
            </div>
          </section>
        </div>
      </section>
    </main>
    <AppFooter show-social-icons />
  </div>
</template>
