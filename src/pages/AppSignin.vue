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
          <h1 style="text-align: center">Welcome Back</h1>
          <h4
            style="
              text-align: center;
              margin-top: 2vh;
              margin-left: 2vw;
              margin-right: 2vw;
            "
          >
            Enter the credentials to access your account
          </h4>
          <form style="margin-top: 2vh" class="flex column">
            <v-text-field
              label="Email"
              type="email"
              placeholder="Enter Here"
              name="email"
              id="email"
            />
            <v-text-field
              label="Password"
              type="password"
              placeholder="Enter Here"
              name="password"
              id="password"
            />
            <v-button
              label="FORGOT PASSWORD?"
              variant="link"
              style="align-self: flex-end; margin-right: 1vw"
              @click.stop="goToForgotPassword"
            />
            <v-button
              label="SIGN IN"
              style="margin: 4vh 1% 0 1%"
              type="button"
              v-wave="{ color: 'white' }"
            />
          </form>
          <section style="margin-top: 3vh; text-align: center">
            <span class="body-1" style="color: var(--text-grey)">
              Or sign in with
              <a class="sso" style="margin: 0 1em" @click.stop="onSignin">
                <img :src="GoogleLogo" />
              </a>
              <a
                class="sso"
                style="
                  transform: scale(1.125);
                  margin-top: 2px;
                  margin-right: 1em;
                "
                @click.stop="onSignin"
              >
                <img :src="TwitterLogo" />
              </a>
              <a class="sso" style="margin-top: 2px" @click.stop="onSignin">
                <img :src="GithubLogo" />
              </a>
            </span>
          </section>
        </div>
        <section
          style="
            margin-top: 8vh;
            margin-bottom: 8vh;
            text-align: center;
            align-self: end;
          "
        >
          <h4 style="display: inline; margin-right: 10px">New to Arcana?</h4>
          <v-button
            variant="link"
            label="SIGN UP"
            @click.stop="navigateToSignup"
          />
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
  margin: 10vh auto 0 auto;
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
import VTextField from "../components/lib/VTextField/VTextField.vue";
import VButton from "../components/lib/VButton/VButton.vue";
import LandingDescriptor from "../components/LandingDescriptor.vue";
import GoogleLogo from "../assets/iconography/google.svg";
import TwitterLogo from "../assets/iconography/twitter.svg";
import GithubLogo from "../assets/iconography/github.svg";
import AppLogo from "../assets/logo.svg";
import { launchGoogleSSO, launchTwitterSSO } from "../utils/sso";
export default {
  name: "AppSignin",
  components: { VTextField, VButton, LandingDescriptor },
  setup() {
    const router = useRouter();

    function navigateToSignup() {
      router.push("/signup");
    }

    function goToForgotPassword() {
      router.push("/password/forgot");
    }

    function onSignin() {
      router.push("/");
    }

    return {
      GoogleLogo,
      TwitterLogo,
      GithubLogo,
      AppLogo,
      navigateToSignup,
      launchGoogleSSO,
      launchTwitterSSO,
      goToForgotPassword,
      onSignin,
    };
  },
};
</script>