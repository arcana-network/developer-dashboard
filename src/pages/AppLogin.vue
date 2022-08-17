<script lang="ts" setup>
import { onMounted, ref } from '@vue/runtime-core'
import { useRoute, useRouter } from 'vue-router'

import LandingDescriptor from '@/components/LandingDescriptor.vue'
import VButton from '@/components/lib/VButton/VButton.vue'
import VTextField from '@/components/lib/VTextField/VTextField.vue'
import { loginUser } from '@/services/gateway.service'
import { addUserToMailchimp } from '@/services/mailchimp.service'
import { useAppStore } from '@/stores/app.store'
import { useAuthStore } from '@/stores/auth.store'
import { useLoaderStore } from '@/stores/loader.store'
import useArcanaAuth from '@/use/arcanaAuth'
import { createTransactionSigner, generateLoginInfo } from '@/utils/signerUtils'
import { isValidEmail } from '@/utils/validation'

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()
const authStore = useAuthStore()
const loaderStore = useLoaderStore()
const arcanaAuth = useArcanaAuth()
const email = ref('')
const hasValidEmail = ref(true)

async function launchLogin(type: string) {
  loaderStore.showLoader(`Signing with ${type}`)
  if (type === 'passwordless') {
    await arcanaAuth.loginWithLink(email.value)
  } else {
    await arcanaAuth.loginWithSocial(type)
  }
  await fetchAndStoreDetails()
}

async function fetchAndStoreDetails() {
  loaderStore.showLoader('Fetching user info...')
  await fetchAndStoreUserInfo()
  createTransactionSigner()
  await appStore.fetchAppConfig()
  if (route.params.redirectTo) {
    router.push({ name: String(route.params.redirectTo) })
  } else {
    router.push({
      name: 'Dashboard',
    })
  }
  loaderStore.hideLoader()
}

async function fetchAndStoreUserInfo() {
  loaderStore.showLoader('Signing In...')
  const userInfo = await arcanaAuth.fetchUserDetails()
  const loginInfo = await generateLoginInfo()
  const access_token = await loginUser({
    signature: loginInfo.signature,
    email: userInfo.id,
    address: loginInfo.address,
  })
  authStore.updateAccessToken(access_token.data.token)
  authStore.updateWalletAddress(loginInfo.address)
  authStore.updateUserInfo(
    (userInfo.name as string) || 'User',
    userInfo.email || userInfo.id
  )

  if (loginInfo.nonce === 0) {
    addUserToMailchimp(userInfo.id)
  }
}

function validateEmail() {
  hasValidEmail.value = !email.value || isValidEmail(email.value)
}

onMounted(async () => {
  if (await arcanaAuth.isLoggedIn()) {
    await fetchAndStoreDetails()
  }
})
</script>

<template>
  <div>
    <main class="flex">
      <LandingDescriptor />
      <section class="signin-section">
        <div class="signin-container">
          <img
            src="@/assets/logo.svg"
            alt="Arcana Logo"
            style="margin: auto; margin-bottom: 2em"
            class="laptop-remove"
          />
          <div>
            <h1>Welcome</h1>
            <h5 class="login-description">
              We’ll email you a login link for a password-free sign in.
            </h5>
          </div>
          <div class="passwordless-container flex column flex-center">
            <VTextField
              v-model.trim="email"
              label="Email"
              class="passwordless-email"
              message="Invalid Email"
              :message-type="hasValidEmail ? '' : 'error'"
              @update:model-value="validateEmail"
              @keyup.enter="
                email && hasValidEmail ? launchLogin('passwordless') : void 0
              "
            />
            <VButton
              label="SEND LINK"
              class="passwordless-button"
              :disabled="!email || !hasValidEmail"
              @click.stop="launchLogin('passwordless')"
            />
          </div>
          <section class="social-links-container">
            <span class="body-1" style="vertical-align: middle"
              >Or sign in with
            </span>
            <img
              class="sso"
              src="@/assets/google-sso.svg"
              @click.stop="launchLogin('google')"
            />
            <img
              class="sso"
              src="@/assets/github-sso.svg"
              @click.stop="launchLogin('github')"
            />
            <img
              class="sso"
              src="@/assets/twitch-sso.svg"
              @click.stop="launchLogin('twitch')"
            />
            <img
              class="sso"
              src="@/assets/discord-sso.svg"
              @click.stop="launchLogin('discord')"
            />
          </section>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
h1 {
  font-size: 2.25rem;
  font-weight: 700;
  text-align: center;
  letter-spacing: unset;
}

.login-description {
  margin-top: 1rem;
  font-size: 1.25rem;
  text-align: center;
}

.sso-button {
  width: 36vw;
  min-width: 160px;
  max-width: 240px;
  background: radial-gradient(
    134.5% 939.99% at -23.59% -12.9%,
    #262626 0%,
    rgb(26 26 26 / 86.3%) 31.41%,
    rgb(32 32 32 / 49%) 100%
  ) !important;
  border-radius: 10px;
  box-shadow: 4px 5px 4px rgb(0 0 0 / 25%) !important;
}

.body-3 {
  font-size: 0.9em;
  font-weight: 300;
  line-height: 1.8em;
}

.signin-section {
  display: grid;
  place-items: center;
  width: 100%;
}

.signin-container {
  width: 50%;
  max-width: 640px;
}

@media only screen and (max-width: 1023px) {
  .signin-container {
    width: 80%;
    min-width: 340px;
    margin: 5vh auto;
  }
}

@media only screen and (max-width: 399px) {
  .signin-container {
    width: 90%;
  }
}

.passwordless-container {
  margin-top: 1.875rem;
}

.passwordless-email {
  width: 100%;
  max-width: 25rem;
}

.passwordless-button {
  width: 100%;
  max-width: 18rem;
  margin-top: 0.875rem;
}

.social-links-container {
  display: flex;
  justify-content: center;
  margin-top: 3.75rem;
}

.sso {
  display: inline-block;
  margin-left: 2rem;
  vertical-align: middle;
  cursor: pointer;
  transition: opacity 0.4s;
}

.sso + .sso {
  margin-left: 1.25rem;
}

.sso:hover {
  opacity: 0.8;
}
</style>
