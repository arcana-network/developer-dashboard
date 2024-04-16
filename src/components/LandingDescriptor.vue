<script lang="ts" setup>
const docsLink = 'https://docs.arcana.network/howto/config_dapp.html'
</script>

<template>
  <div
    class="w-auto md:w-[45%] m-[2rem] md:mt-[10vh] md:ml-[50px] space-y-2 md:space-y-4"
  >
    <img
      src="@/assets/arcana-logo.webp"
      class="h-[27px] md:h-[38px]"
      alt="Arcana Logo"
    />
    <h1
      style="margin-top: 1vh"
      class="text-[25px] md:text-[35px] text-black tracking-tight"
    >
      Make your dApps secure from the ground up!
    </h1>
    <p class="text-[11px] md:text-[0.95rem] text-black font-light">
      See how to configure your app on the Arcana Dashboard.
    </p>
    <a
      :href="docsLink"
      target="_blank"
      class="flex flex-row uppercase no-underline text-[#000] text-[11px] md:text-[0.95rem] font-normal"
      >Learn More
      <img
        class="pl-2 h-[11px] md:h-[20px]"
        src="@/assets/iconography/right-pointer.svg"
      />
    </a>
  </div>
</template>
