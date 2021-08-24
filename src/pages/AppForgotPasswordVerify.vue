<template>
  <div>
    <main class="flex">
      <landing-descriptor />
      <section class="forgot-password-container">
        <div>
          <h1 style="text-align: center">Verification</h1>
          <h4
            style="
              text-align: center;
              margin: 2vh 4vw;
              font-weight: 400;
              line-height: 1.65em;
            "
          >
            Please enter the verification code that was sent to your email
            address
          </h4>
        </div>
        <form style="margin-top: 6vh" class="flex column">
          <div class="flex" style="justify-content: space-between; gap: 1.8vw">
            <div class="text-field" v-for="i in 4" :key="'verification-' + i">
              <input
                type="number"
                maxlength="1"
                max="9"
                :id="'verification-' + i"
                v-model="verificationDigits[i - 1]"
                @keyup.stop="onKeyup(i, $event)"
                onpaste="return false;"
                min="0"
                step="1"
                pattern="[0-9]"
              />
            </div>
          </div>
          <span class="message" :class="{ error }"> Invalid input </span>
          <v-button label="VERIFY" style="margin: 4vh 1% 0 1%" type="button" />
        </form>
        <section style="text-align: center; margin-top: 4vh">
          <span
            class="body-1"
            style="color: var(--text-grey); margin-right: 1em"
          >
            Didn’t receive the code?
          </span>
          <v-button variant="link" label="RESEND CODE" />
        </section>
      </section>
    </main>
  </div>
</template>

<style scoped>
.forgot-password-container {
  width: 50%;
  max-width: 480px;
  margin: 20vh auto 0 auto;

  height: 200vh;
}

h1 {
  letter-spacing: unset;
  font-weight: 700;
}

div.text-field {
  background: linear-gradient(141.48deg, #1a1a1a -4.56%, #151515 135.63%);
  box-shadow: inset -2px -2px 4px rgba(57, 57, 57, 0.44),
    inset 5px 5px 10px rgba(11, 11, 11, 0.5);
  border-radius: 10px;
}

input {
  border: none;
  box-shadow: none;
  background: transparent;
  outline: none;
  --webkit-outline: none;
  color: var(--text-white);
  font-family: var(--font-body);
  font-size: 1.25em;
  line-height: 1.5em;
  margin: 0;
  padding: 15px 20px;
  width: 2em;
  text-align: center;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
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

.message {
  font-family: var(--font-body);
  font-weight: 400;
  visibility: hidden;
  font-size: 0.94em;
  line-height: 1.5em;
  margin: 5px 0;
}
.message.error {
  visibility: visible;
  color: #ee193f;
  text-align: right;
}
</style>

<script>
import { ref } from "@vue/reactivity";
import LandingDescriptor from "../components/LandingDescriptor.vue";
import VButton from "../components/lib/VButton/VButton.vue";
export default {
  components: { LandingDescriptor, VButton },
  setup() {
    const verificationDigits = ref(["", "", "", ""]);
    const error = ref(false);

    function onKeyup(index, event) {
      if (event.key.toLowerCase() === "backspace" && index > 1) {
        document.getElementById("verification-" + (index - 1)).focus();
      } else if (/[0-9]/.test(event.key.toLowerCase())) {
        if (verificationDigits.value[index - 1].length > 1) {
          verificationDigits.value[index - 1] =
            verificationDigits.value[index - 1][0];
        }
        if (index < 4) {
          document.getElementById("verification-" + (index + 1)).focus();
        }
      }
    }

    return {
      verificationDigits,
      onKeyup,
      error,
    };
  },
};
</script>