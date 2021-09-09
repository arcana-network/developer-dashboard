<template>
  <div>
    <main class="flex">
      <landing-descriptor />
      <section class="signin-container">
        <img
          :src="AppLogo"
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
                @click.stop="launchLogin('google')"
              >
                <div class="flex" style="align-items: center; padding: 0.2em 0">
                  <img style="margin-right: 1em" :src="GoogleSSOIcon" />
                  <span class="body-1">Google</span>
                </div>
              </v-card-button>
              <v-card-button
                class="sso-button"
                @click.stop="launchLogin('twitter')"
              >
                <div class="flex" style="align-items: center; padding: 0.2em 0">
                  <img style="margin-right: 1em" :src="TwitterSSOIcon" />
                  <span class="body-1">Twitter</span>
                </div>
              </v-card-button>
            </div>
            <div
              class="flex wrap"
              style="gap: 1em; margin-top: 2em; justify-content: space-between"
            >
              <v-card-button
                class="sso-button"
                @click.stop="launchLogin('discord')"
              >
                <div class="flex" style="align-items: center; padding: 0.2em 0">
                  <img style="margin-right: 1em" :src="DiscordSSOIcon" />
                  <span class="body-1">Discord</span>
                </div>
              </v-card-button>
              <v-card-button
                class="sso-button"
                @click.stop="launchLogin('github')"
              >
                <div class="flex" style="align-items: center; padding: 0.2em 0">
                  <img style="margin-right: 1em" :src="GithubSSOIcon" />
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
                @click.stop="launchLogin('twitch')"
              >
                <div class="flex" style="align-items: center; padding: 0.2em 0">
                  <img style="margin-right: 1em" :src="TwitchSSOIcon" />
                  <span class="body-1">Twitch</span>
                </div>
              </v-card-button>
              <v-card-button
                class="sso-button"
                @click.stop="launchLogin('reddit')"
              >
                <div class="flex" style="align-items: center; padding: 0.2em 0">
                  <img style="margin-right: 1em" :src="RedditSSOIcon" />
                  <span class="body-1">Reddit</span>
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
  width: 16vw;
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
import LandingDescriptor from "../components/LandingDescriptor.vue";
import AppLogo from "../assets/logo.svg";
import VCardButton from "../components/lib/VCardButton/VCardButton.vue";
import GoogleSSOIcon from "../assets/google-sso.svg";
import TwitterSSOIcon from "../assets/twitter-sso.svg";
import TwitchSSOIcon from "../assets/twitch-sso.svg";
import RedditSSOIcon from "../assets/reddit-sso.svg";
import GithubSSOIcon from "../assets/github-sso.svg";
import DiscordSSOIcon from "../assets/discord-sso.svg";
import clientIds from "../utils/client-ids";
export default {
  name: "AppLoginV2",
  components: { LandingDescriptor, VCardButton },
  setup() {
    const router = useRouter();
    const { AuthProvider } = window.arcana_login;

    function navigateToSignup() {
      router.push("/signup");
    }

    function goToForgotPassword() {
      router.push("/password/forgot");
    }

    function onSignin() {
      router.push("/");
    }

    async function launchLogin(type) {
      let loginConfig = getLoginConfig(type);
      if (loginConfig) {
        const arcanaLogin = new AuthProvider(loginConfig);
        try {
          const pk = await arcanaLogin.signIn();
          console.log(pk);
          router.push("/");
        } catch (e) {
          console.error(e);
        }
      }
    }

    function getLoginConfig(type) {
      if (clientIds[type]) {
        return {
          loginType: type,
          appAddress: "dummyappaddress",
          redirectUri: "https://arcana-devdash-v2.web.app/oauth/redirect",
          clientId: clientIds[type],
        };
      }
      return null;
    }

    return {
      AppLogo,
      GoogleSSOIcon,
      RedditSSOIcon,
      TwitterSSOIcon,
      TwitchSSOIcon,
      DiscordSSOIcon,
      GithubSSOIcon,
      navigateToSignup,
      goToForgotPassword,
      onSignin,
      launchLogin,
    };
  },
};
</script>