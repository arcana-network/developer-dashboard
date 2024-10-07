<script lang="ts" setup>
import { useRouter } from 'vue-router'

import VButton from '@/components/lib/VButton/VButton.vue'
import VCard from '@/components/lib/VCard/VCard.vue'
import VOverlay from '@/components/lib/VOverlay/VOverlay.vue'
import type { AppId } from '@/stores/apps.store'
import { NetworkName } from '@/utils/constants'

type Props = {
  appId: AppId
}

const props = defineProps<Props>()
const emit = defineEmits(['close'])
const router = useRouter()

function handleMainnetKeySpace() {
  router.push({ name: 'Keyspace', params: { appId: props.appId } })
  emit('close')
}
</script>

<template>
  <VOverlay>
    <div class="flex items-center justify-center w-full h-full">
      <VCard class="flex flex-col items-center w-full max-w-px600 p-8">
        <img src="@/assets/success-celebrate.svg" class="w-32" />
        <h3 class="my-2.5 text-3xl text-center">
          {{ NetworkName.mainnet }} App Created!
        </h3>
        <span
          class="max-w-px500 mt-2.5 mb-16 text-base leading-6 text-center text-black_solid-default"
        >
          {{ NetworkName.mainnet }} app has been configured. <br />Please
          proceed to configure your app's keyspace
        </span>
        <VButton
          label="CONFIGURE KEYSPACE"
          class="w-px200"
          @click.stop="handleMainnetKeySpace()"
        />
      </VCard>
    </div>
  </VOverlay>
</template>
