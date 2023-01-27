<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import SettingCard from '@/components/app-configure/SettingCard.vue'
import VerificationForm from '@/components/app-configure/VerificationForm.vue'
import VButton from '@/components/lib/VButton/VButton.vue'
import VCard from '@/components/lib/VCard/VCard.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import { useAppsStore } from '@/stores/apps.store'

const selectedKeyspace = ref('app-specific')
const showVerificationForm = ref(false)
const route = useRoute()
const appId = Number(route.params.appId)
const appsStore = useAppsStore()
const app = appsStore.app(appId)
</script>

<template>
  <section name="app-branding">
    <SettingCard class="app-branding-card">
      <template #title>Keyspace</template>
      <template #description>
        <div>
          Provide your users the convenience of using magic links delivered to
          their email addresses that they can click on to authenticate
          themselves instead of using passwords.
          <a href="#" target="_blank" class="learn-more"> LEARN MORE </a>
        </div>
      </template>
      <VStack gap="1.25rem" wrap>
        <VCard
          variant="depressed"
          class="keyspace-card keyspace-container"
          @click.stop="selectedKeyspace = 'app-specific'"
        >
          <VStack gap="1.25rem" align="start">
            <input
              id="app-specific"
              type="radio"
              :checked="selectedKeyspace === 'app-specific'"
              value="app-specific"
              @change="selectedKeyspace = 'app-specific'"
            />
            <VStack direction="column" gap="10px">
              <span class="card-title">App Specific</span>
              <span class="card-description"
                >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Diam
                ut fermentum, bibendum lectus phasellus ligula morbi.</span
              >
            </VStack>
          </VStack>
        </VCard>
        <div class="position-relative">
          <div
            class="gradient-border-card keyspace-card"
            @click.stop="selectedKeyspace = 'global'"
          >
            <VCard
              variant="depressed"
              class="keyspace-card-global keyspace-container"
            >
              <VStack gap="1.25rem" align="start">
                <input
                  id="global"
                  type="radio"
                  :checked="selectedKeyspace === 'global'"
                  value="global"
                  disabled
                  @change="selectedKeyspace = 'global'"
                />
                <VStack direction="column" gap="10px">
                  <VStack justify="space-between">
                    <span class="card-title">Global</span>
                    <span
                      v-if="false"
                      class="card-description"
                      style="color: #f7f7f7"
                    >
                      *Recommended
                    </span>
                    <VStack v-if="false" align="center" gap="4px">
                      <div
                        class="circle-indicator"
                        style="background: #ff6826"
                      ></div>
                      <span class="card-description" style="color: #f7f7f7">
                        In Review
                      </span>
                    </VStack>
                    <VStack v-if="false" align="center" gap="4px">
                      <div
                        class="circle-indicator"
                        style="background: #8fff00"
                      ></div>
                      <span class="card-description" style="color: #f7f7f7">
                        Approved
                      </span>
                    </VStack>
                    <VStack v-if="true" align="center" gap="4px">
                      <img
                        src="@/assets/iconography/rejected.svg"
                        style="width: 12px"
                      />
                      <span class="card-description" style="color: #f7f7f7">
                        Rejected
                      </span>
                    </VStack>
                  </VStack>
                  <span class="card-description"
                    >Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Diam ut fermentum, bibendum lectus phasellus ligula
                    morbi.</span
                  >
                  <VStack
                    class="justify-end"
                    style="margin-top: 2rem; visibility: hidden"
                  >
                    <VButton label="VERIFY" disabled></VButton>
                  </VStack>
                </VStack>
              </VStack>
            </VCard>
          </div>
          <div class="position-absolute" style="right: 2rem; bottom: 2rem">
            <VStack class="justify-end" style="margin-top: 2rem">
              <VButton
                label="VERIFY"
                @click.stop="showVerificationForm = true"
              ></VButton>
            </VStack>
          </div>
        </div>
      </VStack>
    </SettingCard>
    <VerificationForm
      v-if="showVerificationForm"
      :app-id="appId"
      :address="app.address"
      @submitted="void 0"
      @close="showVerificationForm = false"
    />
  </section>
</template>

<style scoped>
.keyspace-card {
  width: 100%;
  max-width: 360px;
  cursor: pointer;
}

.circle-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.keyspace-container {
  width: calc(100% - 2rem);
  max-width: 296px;
  padding: 2rem;
}

.card-title {
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 600;
}

.card-description {
  font-family: var(--font-body);
  font-size: 0.75rem;
  line-height: 1.5;
  color: var(--text-grey);
}

.gradient-border-card {
  padding: 2px;
  cursor: not-allowed;
  background: linear-gradient(90deg, #cc2b5e 0%, #753a88 100%);
  border-radius: 10px;
  opacity: 0.4;
}

input[type='radio'] {
  display: grid;
  place-content: center;
  width: 20px;
  background: #313131;
  border-radius: 50%;
  box-shadow: none;
  transform: translateX(0);
  appearance: none;
}

input[type='radio']::before {
  width: 16px;
  height: 16px;
  content: '';
  background: linear-gradient(180deg, #0085ff -4.5%, #29c8fa 100.1%);
  border-radius: 50%;
  transition: 120ms transform ease-in-out;
  transform: scale(0);
}

input[type='radio']:checked::before {
  transform: scale(1);
}
</style>
