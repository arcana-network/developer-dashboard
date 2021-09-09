<template>
  <div>
    <main class="flex">
      <landing-descriptor />
      <section class="signup-container">
        <div
          style="text-align: center; margin-bottom: 2em"
          class="laptop-remove"
        >
          <img :src="AppLogo" alt="Arcana Logo" />
        </div>
        <h1 style="text-align: center">Welcome To Arcana</h1>
        <div
          style="text-align: center; font-size: 1em; margin-top: 1vh"
          class="body-3"
        >
          Lets get started
        </div>
        <form style="margin-top: 2vh" class="flex column">
          <v-text-field
            label="Name"
            placeholder="Enter Here"
            name="name"
            id="name"
            v-model="user.name.value"
          />
          <v-text-field
            label="Email"
            type="email"
            placeholder="Enter Here"
            name="email"
            id="email"
            v-model="user.email.value"
          />
          <v-text-field
            label="Password"
            :type="passwordType"
            placeholder="Enter Here"
            name="password"
            id="password"
            :icon="ShowIcon"
            clickableIcon
            @icon-clicked="togglePasswordType"
            v-model="user.password.value"
          />
          <ul class="flex body-3">
            <li :class="{ 'success-message': passwordValidCases.minChar }">
              Must be at least 8 characters
            </li>
            <li :class="{ 'success-message': passwordValidCases.numeric }">
              Atleast one numeric digit
            </li>
          </ul>
          <ul class="flex body-3">
            <li :class="{ 'success-message': passwordValidCases.uppercase }">
              Atleast one uppercase letter
            </li>
            <li :class="{ 'success-message': passwordValidCases.specialCase }">
              Atleast one special character
            </li>
          </ul>
          <v-button
            label="SIGN UP"
            style="margin: 4vh 1% 0 1%"
            type="button"
            @click.stop="onSignUp"
          />
        </form>
        <section style="margin-top: 3vh; text-align: center">
          <span class="body-1" style="color: var(--text-grey)">
            Or sign up with
            <a class="sso" style="margin: 0 1em" @click.stop="launchGoogleSSO">
              <img :src="GoogleLogo" />
            </a>
            <a
              class="sso"
              style="
                transform: scale(1.125);
                margin-top: 2px;
                margin-right: 1em;
              "
              @click.stop="launchTwitterSSO"
            >
              <img :src="TwitterLogo" />
            </a>
            <a
              class="sso"
              style="margin-top: 2px"
              @click.stop="launchTwitterSSO"
            >
              <img :src="GithubLogo" />
            </a>
          </span>
        </section>
        <section style="margin-top: 4vh; text-align: center">
          <h4 style="display: inline; margin-right: 10px">Already a member?</h4>
          <v-button
            variant="link"
            label="SIGN IN"
            @click.stop="navigateToSignin"
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
ul {
  color: var(--text-grey);
  gap: 10%;
  margin: 0;
}

li {
  width: 45%;
}

.signup-container {
  width: 50%;
  max-width: 532px;
  margin: 8vh auto 0 auto;
}

@media only screen and (max-width: 1023px) {
  .signup-container {
    width: 80%;
    min-width: 340px;
    margin: 5vh auto;
  }
  ul {
    flex-direction: column;
  }
  li {
    width: 100%;
  }
}

@media only screen and (max-width: 399px) {
  .signup-container {
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
  transition: transform 0.4s;
}

.sso:hover img,
.sso img:hover {
  opacity: 0.8;
}
li.success-message {
  color: var(--colors-green);
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
import ShowIcon from "../assets/iconography/show.svg";
import { ref } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";
import AppLogo from "../assets/logo.svg";
export default {
  name: "AppSignup",
  components: { VTextField, VButton, LandingDescriptor },
  setup() {
    const router = useRouter();
    let passwordType = ref("password");
    let user = ref({
      name: {
        value: "",
        dirty: false,
        invalid: false,
      },
      email: {
        value: "",
        dirty: false,
        invalid: false,
      },
      password: {
        value: "",
        dirty: false,
        invalid: false,
      },
      dirty: false,
      invalid: false,
    });

    let passwordValidCases = ref({
      minChar: false,
      numeric: false,
      uppercase: false,
      specialCase: false,
    });

    function navigateToSignin() {
      router.push("/signin");
    }

    function togglePasswordType() {
      if (passwordType.value === "password") {
        return (passwordType.value = "text");
      }
      return (passwordType.value = "password");
    }

    watch(
      () => user.value.password,
      () => {
        if (!user.value.dirty) user.value.dirty = true;
        if (!user.value.password.dirty) user.value.password.dirty = true;
        validatePassword();
      },
      { deep: true }
    );

    function validatePassword() {
      const password = user.value.password.value;
      if (password.length >= 8) {
        passwordValidCases.value.minChar = true;
      } else passwordValidCases.value.minChar = false;
      if (/\d/.test(password)) {
        passwordValidCases.value.numeric = true;
      } else passwordValidCases.value.numeric = false;
      if (/[A-Z]/.test(password)) {
        passwordValidCases.value.uppercase = true;
      } else passwordValidCases.value.uppercase = false;
      if (/[!@#$%\*.]/.test(password)) {
        passwordValidCases.value.specialCase = true;
      } else passwordValidCases.value.specialCase = false;
    }

    function onSignUp() {
      router.push("/signup/success");
    }

    return {
      GoogleLogo,
      TwitterLogo,
      GithubLogo,
      ShowIcon,
      user,
      passwordType,
      passwordValidCases,
      AppLogo,
      navigateToSignin,
      togglePasswordType,
      onSignUp,
    };
  },
};
</script>