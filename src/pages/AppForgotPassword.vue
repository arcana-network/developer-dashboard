<template>
  <div>
    <main class="flex">
      <landing-descriptor />
      <section class="forgot-password-container">
        <div>
          <h1 style="text-align: center">Forgot Password</h1>
          <h4
            style="
              text-align: center;
              margin-top: 2vh;
              font-weight: 400;
              line-height: 1.65em;
            "
          >
            Enter the email address associated with your account to receive a
            verification code
          </h4>
        </div>
        <form style="margin-top: 2vh" class="flex column">
          <v-text-field
            label="Email"
            type="email"
            placeholder="Enter Here"
            name="email"
            id="email"
          />
          <v-button
            label="SUBMIT"
            style="margin: 4vh 1% 0 1%"
            type="button"
            @click.stop="goToForgotPasswordVerify"
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

h1 {
  letter-spacing: unset;
  font-weight: 700;
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
import LandingDescriptor from "../components/LandingDescriptor.vue";
import VTextField from "../components/lib/VTextField/VTextField.vue";
import VButton from "../components/lib/VButton/VButton.vue";
import { useRouter } from "vue-router";
export default {
  components: { LandingDescriptor, VTextField, VButton },
  setup() {
    const router = useRouter();
    function goToForgotPasswordVerify() {
      router.push("/password/forgot/verify");
    }

    return {
      goToForgotPasswordVerify,
    };
  },
};
</script>