<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import VButton from '@/components/lib/VButton/VButton.vue'
import VCard from '@/components/lib/VCard/VCard.vue'
import VOverlay from '@/components/lib/VOverlay/VOverlay.vue'
import type { AppId } from '@/stores/apps.store'
import { useAppsStore } from '@/stores/apps.store'
import { NetworkName, WalletUIModes } from '@/utils/constants'

type Props = {
  appId: AppId
}

const props = defineProps<Props>()
const emit = defineEmits(['close'])
const router = useRouter()
const appsStore = useAppsStore()
const isArcanaUImode = ref(false)

function handleMainnetKeySpace() {
  router.push({ name: 'Keyspace', params: { appId: props.appId } })
  emit('close')
}

onMounted(() => {
  const app = appsStore.app(props.appId)
  isArcanaUImode.value = app.wallet_mode
    ? app.wallet_mode === WalletUIModes[1].value
    : false
})
</script>

<template>
  <VOverlay>
    <div class="popup-container">
      <VCard class="popup-card">
        <img src="@/assets/success-celebrate.svg" style="width: 8rem" />
        <h3 class="popup-title">{{ NetworkName.mainnet }} App Created!</h3>
        <span v-if="isArcanaUImode" class="popup-message">
          {{ NetworkName.mainnet }} app has been configured. <br />Please
          proceed to configure your app's keyspace
        </span>
        <VButton
          v-if="isArcanaUImode"
          label="CONFIGURE KEYSPACE"
          style="width: 200px"
          @click.stop="handleMainnetKeySpace()"
        />
        <VButton
          v-else
          label="Close"
          style="width: 200px"
          @click.stop="emit('close')"
        />
      </VCard>
    </div>
  </VOverlay>
</template>

<style scoped>
.popup-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.popup-card {
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
  padding: 2rem;
}

.popup-title {
  margin-block: 10px;
  font-size: 35px;
  text-align: center;
}

.popup-message {
  max-width: 500px;
  margin-top: 10px;
  margin-bottom: 64px;
  font-size: 20px;
  line-height: 1.5;
  color: var(--text-white);
  text-align: center;
}
</style>
