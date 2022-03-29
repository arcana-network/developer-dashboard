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
              text-align: center;
              margin-top: 2vh;
              margin-left: 2vw;
              margin-right: 2vw;
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
                @click.stop="launchLogin(false, SocialLoginType.google)"
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
                @click.stop="launchLogin(false, SocialLoginType.github)"
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
              style="gap: 1em; margin-top: 2em; justify-content: space-between"
            >
              <v-card-button
                class="sso-button"
                @click.stop="launchLogin(false, SocialLoginType.twitch)"
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
                @click.stop="launchLogin(false, SocialLoginType.discord)"
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
    <full-screen-loader v-if="loading" :message="loadingMessage" />
  </div>
</template>

<style scoped>
h1 {
  letter-spacing: unset;
  font-weight: 700;
}
.sso-button {
  box-shadow: 4px 5px 4px rgba(0, 0, 0, 0.25) !important;
  background: radial-gradient(
    134.5% 939.99% at -23.59% -12.9%,
    #262626 0%,
    rgba(26, 26, 26, 0.86293) 31.41%,
    rgba(32, 32, 32, 0.49) 100%
  ) !important;
  border-radius: 10px;
  min-width: 160px;
  width: 36vw;
  max-width: 240px;
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
  margin: 16vh auto 0 auto;
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

<script>
import { useRouter } from "vue-router";
import LandingDescriptor from "@/components/LandingDescriptor.vue";
import VCardButton from "@/components/lib/VCardButton/VCardButton.vue";
import VOverlay from "@/components/lib/VOverlay/VOverlay.vue";
import VCircularProgress from "@/components/lib/VCircularProgress/VCircularProgress.vue";
import FullScreenLoader from "../components/FullScreenLoader.vue";
import { getNonce, login, addUserToMailchimp } from "@/services/auth.service";
import sign from "@/services/sign";
import { Wallet } from "ethers";
import { useStore } from "vuex";
import { onMounted, ref } from "@vue/runtime-core";
import { SocialLoginType } from "@arcana/auth";
import useArcanaAuth from "@/use/arcanaAuth";

export default {
  name: "AppLoginV2",
  components: {
    LandingDescriptor,
    VCardButton,
    VOverlay,
    VCircularProgress,
    FullScreenLoader,
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    let loadingMessage = ref("");
    let loading = ref(false);
    const { loginWithSocial, isLoggedIn, fetchUserDetails } = useArcanaAuth();

    function navigateToSignup() {
      router.push("/signup");
    }

    function goToForgotPassword() {
      router.push("/password/forgot");
    }

    function onSignin() {
      router.push({ name: "Dashboard" });
    }

    async function launchLogin(isLoggedIn, type) {
      try {
        loading.value = true;
        if (!isLoggedIn) {
          loadingMessage.value = "Signing In...";
          await loginWithSocial(type);
        }
        loadingMessage.value = "Fetching user info...";
        const { userInfo, privateKey } = await fetchUserDetails();
        console.log({ userInfo, privateKey });
        const wallet = new Wallet(privateKey);
        const nonce = await getNonce(wallet.address);
        loadingMessage.value = "Signing In...";
        const signature = await sign(privateKey, nonce.data);
        const access_token = await login({
          signature,
          email: userInfo.id,
          address: wallet.address,
        });
        store.dispatch("updateAccessToken", access_token.data.token);
        store.dispatch("updateKeys", {
          privateKey,
        });
        store.dispatch("updateWalletAddress", wallet.address);
        store.dispatch("updateUserInfo", {
          email: userInfo.id,
          name: userInfo.name || "",
        });

        if (nonce.data === 0) {
          addUserToMailchimp(userInfo.id);
        }

        loading.value = false;

        if (localStorage.getItem("skipPassword") !== "true") {
          router.push({
            name: "Create Password",
            params: { redirectTo: "Dashboard" },
          });
        } else {
          router.push({
            name: "Dashboard",
          });
        }
      } catch (e) {
        loading.value = false;
        console.error(e);
      }
    }

    onMounted(async () => {
      if (isLoggedIn()) {
        launchLogin(isLoggedIn());
      }
    });

    return {
      navigateToSignup,
      goToForgotPassword,
      onSignin,
      launchLogin,
      loading,
      loadingMessage,
      SocialLoginType,
    };
  },
};
</script>