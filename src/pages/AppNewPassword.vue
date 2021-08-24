<template>
  <div>
    <main class="flex">
      <landing-descriptor />
      <section class="forgot-password-container">
        <div>
          <h1 style="text-align: center">Verification Successful</h1>
          <h4
            style="
              text-align: center;
              margin-top: 2vh;
              font-weight: 400;
              line-height: 1.65em;
            "
          >
            Your new password must be different <br />from previously used
            password
          </h4>
        </div>
        <form style="margin-top: 2vh" class="flex column">
          <v-text-field
            label="New Password"
            type="password"
            placeholder="Enter Here"
            name="password"
            id="password"
          />
          <v-text-field
            label="Confirm New Password"
            type="password"
            placeholder="Enter Here"
            name="confirm-password"
            id="confirm-password"
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
            label="SAVE PASSWORD"
            style="margin: 4vh 1% 0 1%"
            type="button"
          />
        </form>
      </section>
    </main>
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
import LandingDescriptor from "../components/LandingDescriptor.vue";
import VButton from "../components/lib/VButton/VButton.vue";
import VTextField from "../components/lib/VTextField/VTextField.vue";
import { onBeforeMount } from "@vue/runtime-core";
export default {
  components: { LandingDescriptor, VButton, VTextField },
  setup() {
    let passwordValidCases = ref({
      minChar: false,
      numeric: false,
      uppercase: false,
      specialCase: false,
    });
    let initialTestnetConfiguration = ref(false);
    onBeforeMount(() => {
      const isConfigured = localStorage.getItem("isConfigured");
      initialTestnetConfiguration.value = !!isConfigured;
    });

    return {
      passwordValidCases,
      initialTestnetConfiguration,
    };
  },
};
</script>