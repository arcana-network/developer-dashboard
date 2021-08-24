<template>
  <div>
    <main class="flex">
      <landing-descriptor />
      <section
        class="flex column"
        style="
          height: 100vh;
          width: 100%;
          align-items: center;
          justify-content: center;
          gap: 0.625em;
        "
      >
        <img :src="CircleCheckIcon" />
        <h2 style="font-size: 2.25em; margin-top: 1.25em; text-align: center">
          Verification Email Sent
        </h2>
        <h5
          style="
            max-width: 400px;
            text-align: center;
            font-size: 0.875em;
            line-height: 2em;
          "
        >
          An email with a verification link has been sent to your id. Please
          click the link to log into Arcana.
        </h5>
      </section>
    </main>
  </div>
</template>

<script>
import CircleCheckIcon from "../assets/iconography/success-check-circle.svg";
import LandingDescriptor from "../components/LandingDescriptor.vue";
export default {
  components: { LandingDescriptor },
  setup() {
    return {
      CircleCheckIcon,
    };
  },
};
</script>