<template>
  <div>
    <main class="flex">
      <landing-descriptor />
      <section class="create-password-container">
        <div>
          <h1 style="text-align: center">Create Password</h1>
        </div>
        <form style="margin-top: 2vh" class="flex column">
          <v-text-field
            label="New Password"
            type="password"
            placeholder="Enter Here"
            name="password"
            id="password"
            v-model="password"
          />
          <v-text-field
            label="Confirm New Password"
            type="password"
            placeholder="Enter Here"
            name="confirm-password"
            id="confirm-password"
            v-model="confirmPassword"
          />
          <ul class="flex body-3 password-strength-list">
            <li :class="{ 'success-message': passwordValidCases.minChar }">
              Must be at least 6 characters
            </li>
            <li :class="{ 'success-message': passwordValidCases.numeric }">
              Atleast one numeric digit
            </li>
          </ul>
          <ul class="flex body-3 password-strength-list">
            <li :class="{ 'success-message': passwordValidCases.noSpaces }">
              Must not contain space
            </li>
            <li
              :class="{
                'success-message':
                  password && password === confirmPassword,
              }"
            >
              Passwords must match
            </li>
          </ul>
          <v-button
            variant="link"
            label="Why create a password?"
            style="margin-top: 3vh; align-self: center"
            @click.stop="showPasswordDescriptionPopup = true"
          />
          <v-button
            label="SAVE PASSWORD"
            style="margin: 3vh 1% 0 1%"
            type="button"
            :disabled="!isValidPassword"
            :action="savePassword"
          />
        </form>
        <v-stack direction="column" align="center" style="margin-top: 3vh">
          <h3>OR</h3>
          <v-button
            variant="link"
            label="SKIP THIS STEP"
            style="margin-top: 1rem"
            @click.stop="skipPasswordCreation"
          />
        </v-stack>
      </section>

      <v-overlay
        v-if="showPasswordDescriptionPopup"
        style="align-items: center; justify-content: center; display: flex"
      >
        <v-card
          variant="popup"
          style="
            padding: 4em 2em;
            min-width: 200px;
            max-width: 560px;
            width: 72%;
            flex-direction: column;
            gap: 1vh;
            position: relative;
          "
        >
          <header
            class="sub-heading-2"
            style="justify-content: center; flex-grow: 1; display: flex"
          >
            Why create a password?
          </header>
          <v-seperator style="width: 100%" />
          <main
            class="body-1"
            style="padding: 1vw; font-size: 0.9em; line-height: 1.6em"
          >
            <ul class="password-description-list">
              <li>
                This developer dashboard is a web app that also consumes the
                Arcana SDK.
              </li>
              <li>
                SDK uses popular oAuth mechanisms to assign and fetch an
                available private key from our DKG scheme.
                <br />
                <v-button
                  variant="link"
                  label="Learn about our DKG"
                  @click.stop="openDKGDocs"
                />
              </li>
              <li>
                The private key is only held in the app's memory and is wiped
                out when you close the tab or refresh the page or log out from
                the app. By creating a password that only you know, the app can
                encrypt the private key and store it in the browser's local
                storage so that your session can be retained even after you
                refresh the page or close and come back to the app.
              </li>
              <li>
                This password is NOT stored anywhere locally or on any server.
              </li>
            </ul>
          </main>
          <v-icon-button
            :icon="CloseIcon"
            class="close-popup-button"
            @click.stop="showPasswordDescriptionPopup = false"
          >
          </v-icon-button>
        </v-card>
      </v-overlay>
    </main>
    <full-screen-loader v-if="loading" :message="loadingMessage" />
  </div>
</template>

<style scoped>
.create-password-container {
  width: 50%;
  max-width: 520px;
  margin: 16vh auto 0 auto;
}

.body-3 {
  font-size: 0.9em;
  font-weight: 300;
  line-height: 1.8em;
}

h1 {
  letter-spacing: unset;
  font-weight: 700;
  font-size: 2.5em;
}

.password-strength-list {
  color: var(--text-grey);
  gap: 10%;
  margin: 0;
}

.password-strength-list li {
  width: 45%;
}

.password-description-list li {
  margin-bottom: 1vh;
}

li.success-message {
  color: var(--colors-green);
}

.close-popup-button {
  position: absolute;
  right: 1em;
  top: 1em;
  cursor: pointer;
}

@media only screen and (max-width: 1023px) {
  .forgot-password-container {
    width: 80%;
    min-width: 340px;
    margin: 8vh auto;
  }
  ul {
    flex-direction: column;
  }
  li {
    width: 100%;
  }
}

@media only screen and (max-width: 399px) {
  .forgot-password-container {
    width: 90%;
    min-width: 340px;
  }
}
</style>

<script>
import { ref, computed, onBeforeMount } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";

import FullScreenLoader from "@/components/FullScreenLoader.vue";
import LandingDescriptor from "@/components/LandingDescriptor.vue";
import VButton from "@/components/lib/VButton/VButton.vue";
import VCard from "@/components/lib/VCard/VCard.vue";
import VIconButton from "@/components/lib/VIconButton/VIconButton.vue";
import VOverlay from "@/components/lib/VOverlay/VOverlay.vue";
import VSeperator from "@/components/lib/VSeperator/VSeperator.vue";
import VStack from "@/components/lib/VStack/VStack.vue";
import VTextField from "@/components/lib/VTextField/VTextField.vue";

import CloseIcon from "@/assets/iconography/close.svg";

import { encrypt, bufferToString } from "@/utils/cryptoUtils";

export default {
  components: {
    FullScreenLoader,
    LandingDescriptor,
    VButton,
    VCard,
    VIconButton,
    VOverlay,
    VSeperator,
    VStack,
    VTextField,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const password = ref("");
    const confirmPassword = ref("");
    const loading = ref(false);
    const loadingMessage = ref("");
    const showPasswordDescriptionPopup = ref(false);

    const passwordValidCases = computed(() => {
      let validCases = {
        minChar: false,
        numeric: false,
        noSpaces: false,
      };

      if (password.value.length > 0) {
        if (password.value.length >= 6) {
          validCases.minChar = true;
        }
        if (/\d/.test(password.value)) {
          validCases.numeric = true;
        }
        if (!/\s/g.test(password.value)) {
          validCases.noSpaces = true;
        }
      }

      return validCases;
    });

    const isValidPassword = computed(() => {
      return (
        passwordValidCases.value.minChar &&
        passwordValidCases.value.numeric &&
        passwordValidCases.value.noSpaces &&
        password.value === confirmPassword.value
      );
    });

    async function savePassword() {
      if (isValidPassword.value) {
        loading.value = true;
        loadingMessage.value = "Encrypting private key...";
        const privateKey = store.getters.keys.privateKey;
        const accessToken = store.getters.accessToken;
        const userInfo = store.getters.userInfo;
        const encryptedPrivateKey = await encrypt(privateKey, password.value);
        localStorage.setItem("private-key", encryptedPrivateKey);
        localStorage.setItem("user-info", JSON.stringify(userInfo));
        localStorage.setItem(
          "access-token",
          bufferToString(new TextEncoder().encode(accessToken))
        );
        await router.push({ name: route.params.redirectTo });
        loading.value = false;
      }
    }

    function skipPasswordCreation() {
      localStorage.setItem("skipPassword", true);
      router.push({ name: "Dashboard" });
    }

    function openDKGDocs() {
      window.open("https://docs.arcana.network/dkg");
    }

    onBeforeMount(() => {
      if (!store.getters.keys.privateKey) {
        router.push({ name: "Login" });
      }
    });

    return {
      passwordValidCases,
      password,
      confirmPassword,
      isValidPassword,
      loading,
      loadingMessage,
      showPasswordDescriptionPopup,
      CloseIcon,
      savePassword,
      skipPasswordCreation,
      openDKGDocs,
    };
  },
};
</script>