<script lang="ts" setup>
import CopyIcon from '@/assets/iconography/copy.svg'
import VButton from '@/components/lib/VButton/VButton.vue'
import VCard from '@/components/lib/VCard/VCard.vue'
import VOverlay from '@/components/lib/VOverlay/VOverlay.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import { useToast } from '@/components/lib/VToast'
import VTooltip from '@/components/lib/VTooltip/VTooltip.vue'
import copyToClipboard from '@/utils/copyToClipboard'

const emit = defineEmits(['proceed'])

const props = defineProps({
  delegatePrivateKey: {
    type: String,
    required: true,
  },
})

const toast = useToast()

async function copyAddress() {
  try {
    await copyToClipboard(props.delegatePrivateKey)
    toast.success('Key copied')
  } catch (e) {
    console.error(e)
    toast.error('Failed to copy. Try again or contact support')
  }
}
</script>

<template>
  <VOverlay>
    <div class="center h-full w-full">
      <VCard class="flex column container">
        <img src="@/assets/success-popup-icon.png" class="popup-icon" />
        <VStack gap="1rem" direction="column">
          <VStack
            gap="1rem"
            direction="column"
            justify="space-between"
            align="center"
          >
            <div class="text-base title font-bold">Successfully Generated</div>
            <p class="text-lg font-normal font-normal description">
              The public key will be applied to this delegate. The private key
              shown below must be stored safely. Note that one including Arcana
              will have access to it:
            </p>
            <VStack gap="0.5rem" direction="column" style="width: 100%">
              <label class="font-semibold grey label">Private Key</label>
              <VStack
                justify="center"
                align="center"
                class="text-field"
                gap="1rem"
                style="padding: 1rem"
              >
                <p class="body-2 text-ellipsis">
                  {{ props.delegatePrivateKey }}
                </p>
                <VTooltip
                  title="Click to copy"
                  class="mobile-remove"
                  @click.stop="copyAddress"
                >
                  <img
                    :src="CopyIcon"
                    class="cursor-pointer"
                    alt="Click to copy key"
                    style="margin-top: 4px"
                  />
                </VTooltip>
              </VStack>
            </VStack>
          </VStack>
          <VStack gap="1rem" direction="column" align="center">
            <VButton
              label="PROCEED"
              button-style="width: 100px"
              @click.stop="emit('proceed')"
            />
            <VButton
              variant="link"
              label="LEARN MORE"
              button-style="width: 100px"
            />
          </VStack>
        </VStack>
      </VCard>
    </div>
  </VOverlay>
</template>

<style scoped>
.container {
  position: relative;
  max-width: 480px;
  padding: 2rem;
  padding-top: 6rem;
}

.popup-icon {
  position: absolute;
  top: -3.5rem;
  left: 50%;
  width: 12rem;
  transform: translateX(-50%);
}

.grey {
  color: var(--text-grey);
}

.text-field {
  display: flex;
  background: linear-gradient(141.48deg, #161616 -4.56%, #151515 135.63%);
  border-radius: 10px;
  box-shadow: inset 5px 5px 10px rgb(11 11 11 / 50%),
    inset -50px 49px 29px 22px rgb(28 28 28 / 84%);
}

.title {
  font-size: 2rem;
  font-weight: 700;
}

.description {
  max-width: 40ch;
  font-size: 1rem;
  line-height: 1.5;
  text-align: center;
}

.label {
  font-size: 0.875rem;
  color: var(--text-grey);
}
</style>
