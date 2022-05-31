<script lang="ts" setup>
import { SocialLoginType } from '@arcana/auth'
import { onMounted } from '@vue/runtime-core'
import { Wallet } from 'ethers'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

import LandingDescriptor from '@/components/LandingDescriptor.vue'
import VCardButton from '@/components/lib/VCardButton/VCardButton.vue'
import { loginUser, getNonce } from '@/services/gateway.service'
import { addUserToMailchimp } from '@/services/mailchimp.service'
import useArcanaAuth from '@/use/arcanaAuth'
import signWithPrivateKey from '@/utils/signWithPrivateKey'

const router = useRouter()
const store = useStore()
const arcanaAuth = useArcanaAuth()

async function launchLogin(type: SocialLoginType) {
  store.commit('showLoader', `Signing with ${type}`)
  await arcanaAuth.loginWithSocial(type)
  await fetchAndStoreDetails()
}

async function fetchAndStoreDetails() {
  store.commit('showLoader', 'Fetching user info...')
  await fetchAndStoreUserInfo()
  await store.dispatch('fetchAppConfig')
  store.commit('hideLoader')

  if (localStorage.getItem('skipPassword') !== 'true') {
    router.push({
      name: 'Create Password',
      params: { redirectTo: 'Dashboard' },
    })
  } else {
    router.push({
      name: 'Dashboard',
    })
  }
}

async function fetchAndStoreUserInfo() {
  const { userInfo, privateKey } = await arcanaAuth.fetchUserDetails()
  const wallet = new Wallet(privateKey)
  const nonce = await getNonce(wallet.address)
  store.commit('showLoader', 'Signing In...')
  const signature = await signWithPrivateKey(privateKey, nonce.data)
  const access_token = await loginUser({
    signature,
    email: userInfo.id,
    address: wallet.address,
  })
  store.dispatch('updateAccessToken', access_token.data.token)
  store.dispatch('updateKeys', {
    privateKey,
  })
  store.dispatch('updateWalletAddress', wallet.address)
  store.dispatch('updateUserInfo', {
    email: userInfo.id,
    name: userInfo.name || '',
  })

  if (nonce.data === 0) {
    addUserToMailchimp(userInfo.id)
  }
}

onMounted(async () => {
  if (arcanaAuth.isLoggedIn()) {
    await fetchAndStoreDetails()
  }
})
</script>

<template>
  <div>
    <main class="flex">
      <landing-descriptor />
      <section class="signin-container">
        <img
          src="@/assets/logo.svg"
          alt="Arcana Logo"
          style="margin: auto; margin-bottom: 2em"
          class="laptop-remove"
        />
        <div>
          <h1 style="text-align: center">Welcome To Arcana</h1>
          <h5
            style="
              margin-top: 2vh;
              margin-right: 2vw;
              margin-left: 2vw;
              text-align: center;
            "
          >
            Let’s get started
          </h5>
        </div>
        <section style="margin-top: 6vh">
          <h3 style="padding: 1em">Continue With:</h3>
          <div class="flex column" style="margin-top: 4vh">
            <div
              class="flex wrap"
              style="gap: 1em; justify-content: space-between"
            >
              <v-card-button
                class="sso-button"
                @click.stop="launchLogin(SocialLoginType.google)"
              >
                <div class="flex" style="align-items: center; padding: 0.2em 0">
                  <img
                    style="margin-right: 1em"
                    src="@/assets/google-sso.svg"
                  />
                  <span class="body-1">Google</span>
                </div>
              </v-card-button>
              <v-card-button
                class="sso-button"
                @click.stop="launchLogin(SocialLoginType.github)"
              >
                <div class="flex" style="align-items: center; padding: 0.2em 0">
                  <img
                    style="margin-right: 1em"
                    src="@/assets/github-sso.svg"
                  />
                  <span class="body-1">Github</span>
                </div>
              </v-card-button>
            </div>
            <div
              class="flex wrap"
              style="gap: 1em; justify-content: space-between; margin-top: 2em"
            >
              <v-card-button
                class="sso-button"
                @click.stop="launchLogin(SocialLoginType.twitch)"
              >
                <div class="flex" style="align-items: center; padding: 0.2em 0">
                  <img
                    style="margin-right: 1em"
                    src="@/assets/twitch-sso.svg"
                  />
                  <span class="body-1">Twitch</span>
                </div>
              </v-card-button>
              <v-card-button
                class="sso-button"
                @click.stop="launchLogin(SocialLoginType.discord)"
              >
                <div class="flex" style="align-items: center; padding: 0.2em 0">
                  <img
                    style="margin-right: 1em"
                    src="@/assets/discord-sso.svg"
                  />
                  <span class="body-1">Discord</span>
                </div>
              </v-card-button>
            </div>
          </div>
        </section>
      </section>
    </main>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 700;
  letter-spacing: unset;
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

.signin-container {
  display: grid;
  grid-template-rows: auto 1fr auto;
  width: 50%;
  max-width: 532px;
  margin: 16vh auto 0;
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

.sso {
  display: inline-block;
  vertical-align: middle;
  cursor: pointer;
}

.sso img {
  width: 28px;
  transition: opacity 0.4s;
}

.sso:hover img,
.sso img:hover {
  opacity: 0.8;
}
</style>
