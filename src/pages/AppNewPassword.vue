<template>
  <div>
    <main class="flex">
      <landing-descriptor />
      <section class="forgot-password-container">
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
          <ul class="flex body-3">
            <li :class="{ 'success-message': passwordValidCases.minChar }">
              Must be at least 6 characters
            </li>
            <li :class="{ 'success-message': passwordValidCases.numeric }">
              Atleast one numeric digit
            </li>
          </ul>
          <ul class="flex body-3">
            <li :class="{ 'success-message': passwordValidCases.noSpaces }">
              Must not contain space
            </li>
            <li
              :class="{
                'success-message':
                  password.trim() && password === confirmPassword,
              }"
            >
              Passwords must match
            </li>
          </ul>
          <v-button
            label="SAVE PASSWORD"
            style="margin: 4vh 1% 0 1%"
            type="button"
            :disabled="!isValidPassword"
            :action="savePassword"
          />
        </form>
      </section>
    </main>
    <full-screen-loader v-if="loading" :message="loadingMessage" />
  </div>
</template>

<style scoped>
.forgot-password-container {
  width: 50%;
  max-width: 520px;
  margin: 20vh auto 0 auto;
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

ul {
  color: var(--text-grey);
  gap: 10%;
  margin: 0;
}

li {
  width: 45%;
}

li.success-message {
  color: var(--colors-green);
}

@media only screen and (max-width: 1023px) {
  .forgot-password-container {
    width: 80%;
    min-width: 340px;
    margin: 10vh auto;
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
import { ref } from "@vue/reactivity";
import { computed, onBeforeMount } from "@vue/runtime-core";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";

import LandingDescriptor from "../components/LandingDescriptor.vue";
import VButton from "../components/lib/VButton/VButton.vue";
import VTextField from "../components/lib/VTextField/VTextField.vue";
import FullScreenLoader from "../components/FullScreenLoader.vue";

import { encrypt, bufferToString } from "../utils/cryptoUtils";

export default {
  components: { LandingDescriptor, VButton, VTextField, FullScreenLoader },
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const password = ref("");
    const confirmPassword = ref("");
    const loading = ref(false);
    const loadingMessage = ref("");

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
      savePassword,
    };
  },
};
</script>