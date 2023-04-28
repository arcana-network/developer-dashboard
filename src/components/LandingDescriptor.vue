<script lang="ts" setup>
import AppLogo from '@/assets/logo.svg'

const docsLink = 'https://docs.arcana.network/howto/config_dapp.html'
</script>

<template>
  <div
    class="mobile-remove tablet-remove w-[40%] min-w-[400px] max-w-[488px] m-[2rem] mt-[5vh] space-y-8"
  >
    <img :src="AppLogo" style="height: 72px" alt="Arcana Logo" />
    <h1 style="margin-top: 4vh" class="text-4xl">
      Make your dApps secure from the ground up!
    </h1>
    <p class="text-xl text-[#8d8d8d] font-light">
      See how to configure your app on the Arcana Dashboard.
      <a
        :href="docsLink"
        target="_blank"
        class="text-uppercase no-underline text-[#13a3fd]"
        >Learn More</a
      >
    </p>
    <img
      src="@/assets/sidebar-illustration.png"
      style="display: block; margin: 6vh auto 0"
    />
  </div>
</template>
