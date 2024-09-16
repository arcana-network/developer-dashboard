<script setup lang="ts">
import type { PropType } from 'vue'

import RedirectURI from '@/components/app-configure/auth/RedirectURI.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import { useSocialAuthStore } from '@/stores/socialAuth.store'
import type { SocialAuthOption } from '@/utils/constants'

defineProps({
  authProvider: {
    type: Object as PropType<SocialAuthOption>,
    required: true,
  },
  authType: {
    type: String,
    required: true,
  },
})

const socialAuthStore = useSocialAuthStore()
const emits = defineEmits(['input1', 'input2', 'input3', 'input4', 'input5'])

function handleInput1(event: Event) {
  emits('input1', (event.target as HTMLInputElement).value)
}

function handleInput2(event: Event) {
  emits('input2', (event.target as HTMLInputElement).value)
}

function handleInput3(event: Event) {
  emits('input3', (event.target as HTMLInputElement).value)
}

function handleInput4(event: Event) {
  emits('input4', (event.target as HTMLInputElement).value)
}

function handleInput5(event: Event) {
  emits('input5', (event.target as HTMLInputElement).value)
}
</script>

<template>
  <div class="flex flex-col">
    <RedirectURI
      :auth-provider="authProvider"
      :auth-type="authType"
      class="py-5"
    />
    <div
      class="flex space-x-4 max-[1080px]:flex-col max-[1080px]:space-x-0 max-[1080px]:space-y-4"
    >
      <VStack
        v-if="authProvider.verifier !== 'steam'"
        class="flex flex-1 flex-col space-y-2"
      >
        <div class="flex justify-between">
          <span class="text-xs">{{ authProvider.inputLabels.label1 }}</span>
          <a
            :href="authProvider.documentation1.link"
            target="_blank"
            class="no-underline text-white text-sm font-medium"
            >{{ authProvider.documentation1.label }}</a
          >
        </div>
        <input
          class="flex-1 text-black bg-liquidlight p-2 rounded-md outline-none"
          :placeholder="authProvider.inputLabels.label1"
          :value="
            socialAuthStore.authCredentialsInput[authType][
              authProvider.verifier
            ]?.clientId
          "
          @input="handleInput1"
        />
      </VStack>
      <VStack
        v-if="authProvider.hasClientSecret && !authProvider.isApple"
        class="flex flex-1 flex-col space-y-2"
      >
        <div class="flex justify-between">
          <span class="text-xs">{{ authProvider.inputLabels.label2 }}</span>
          <a
            :href="authProvider?.documentation2?.link"
            target="_blank"
            class="no-underline text-white text-sm font-medium"
            >{{ authProvider?.documentation2?.label }}</a
          >
        </div>
        <input
          class="flex-1 text-black bg-liquidlight p-2 rounded-md outline-none"
          :placeholder="authProvider.inputLabels.label2"
          :value="
            socialAuthStore.authCredentialsInput[authType][
              authProvider.verifier
            ]?.clientSecret
          "
          @input="handleInput2"
        />
      </VStack>
    </div>
    <div
      class="flex pt-5 space-x-4 max-[1080px]:flex-col max-[1080px]:space-x-0 max-[1080px]:space-y-4"
    >
      <VStack
        v-if="authProvider.isApple"
        class="flex flex-1 flex-col space-y-2"
      >
        <span class="text-xs">{{ authProvider.inputLabels.label3 }}</span>
        <input
          class="flex-1 text-black bg-liquidlight p-2 rounded-md outline-none"
          :placeholder="authProvider.inputLabels.label3"
          :value="
            socialAuthStore.authCredentialsInput[authType][
              authProvider.verifier
            ]?.clientSecret
              .split(':')[0]
              .substring(1)
          "
          rows="1"
          as="div"
          @input="handleInput3"
        />
      </VStack>
      <VStack
        v-if="authProvider.isApple"
        class="flex flex-1 flex-col space-y-2"
      >
        <span class="text-xs">{{ authProvider.inputLabels.label4 }}</span>
        <input
          class="flex-1 text-black bg-liquidlight p-2 rounded-md outline-none"
          :placeholder="authProvider.inputLabels.label4"
          :value="
            socialAuthStore.authCredentialsInput[authType][
              authProvider.verifier
            ]?.clientSecret.split(':')[1]
          "
          @input="handleInput4"
        />
      </VStack>
    </div>
    <div
      class="flex pt-5 space-x-4 max-[1080px]:flex-col max-[1080px]:space-x-0 max-[1080px]:space-y-4"
    >
      <VStack
        v-if="authProvider.isApple"
        class="flex flex-1 flex-col space-y-2"
      >
        <span class="text-xs">{{ authProvider.inputLabels.label5 }}</span>

        <textarea
          class="flex-1 text-black bg-liquidlight p-2 rounded-md outline-none"
          :placeholder="`-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----`"
          :value="
            socialAuthStore.authCredentialsInput[authType][
              authProvider.verifier
            ]?.clientSecret
              .split(':')[2]
              ?.slice(0, -1)
          "
          rows="6"
          as="div"
          @input="handleInput5"
        />
      </VStack>
    </div>
  </div>
</template>
