<script lang="ts" setup>
import CopyIcon from '@/assets/iconography/copy.svg'
import VButton from '@/components/lib/VButton/VButton.vue'
import VCard from '@/components/lib/VCard/VCard.vue'
import VOverlay from '@/components/lib/VOverlay/VOverlay.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import { useToast } from '@/components/lib/VToast'
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
    toast.success('Address copied')
  } catch (e) {
    console.error(e)
    toast.error('Failed to copy. Try again or contact support')
  }
}
</script>

<template>
  <VOverlay>
    <div class="center height-100 width-100">
      <VCard popup="true" class="flex column container">
        <VStack gap="1rem" direction="column">
          <VStack
            gap="1rem"
            direction="column"
            justify="space-between"
            align="center"
          >
            <h1 class="sub-heading-5 font-700 text-uppercase">
              Successfully Generated
            </h1>
            <p class="body-2 font-400 grey">
              The public key will be applied to this delegate. The private key
              shown below must be stored safely. Note that one including Arcana
              will have access to it:
            </p>
            <VStack gap="0.5rem" direction="column" style="width: 100%">
              <p class="body-3 grey">Private Key</p>
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
                <v-tooltip
                  title="Click to copy"
                  class="mobile-remove"
                  @click.stop="copyAddress"
                >
                  <img
                    :src="CopyIcon"
                    class="cursor-pointer"
                    alt="Click to copy smart contract address"
                    style="margin-top: 4px"
                  />
                </v-tooltip>
              </VStack>
            </VStack>
          </VStack>
          <VStack gap="1rem" direction="column" align="center">
            <VButton
              label="Proceed"
              button-style="width: 100px"
              @click.stop="emit('proceed')"
            />
            <VButton
              variant="link"
              label="Learn More"
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
  max-width: 600px;
  padding: 30px;
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
</style>
