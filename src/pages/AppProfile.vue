<script lang="ts" setup>
import { ref, onBeforeMount, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import AppHeader from '@/components/AppHeader.vue'
import VButton from '@/components/lib/VButton/VButton.vue'
import VCard from '@/components/lib/VCard/VCard.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import VTextField from '@/components/lib/VTextField/VTextField.vue'
import { useToast } from '@/components/lib/VToast'
import { fetchProfile, updateOrganization } from '@/services/gateway.service'
import { useAuthStore } from '@/stores/auth.store'
import { useLoaderStore } from '@/stores/loader.store'

const authStore = useAuthStore()
const loaderStore = useLoaderStore()
const toast = useToast()

type OrganizationDetails = {
  name: string
  size: number
  country: string
  sizeErrorMessage?: string
}

const editOrganisationDetails = ref(false)
const organisationDetails: Ref<OrganizationDetails> = ref({
  name: '',
  size: 0,
  sizeErrorMessage: '',
  country: '',
})
const name = ref(authStore.name)
const email = ref(authStore.email)
const route = useRoute()
const router = useRouter()

let organisationDetailsResetState: OrganizationDetails

async function onUpdateOrganization() {
  const size = Number(organisationDetails.value.size)
  if (!Number.isFinite(size) || !Number.isSafeInteger(size) || size <= 0) {
    organisationDetails.value.sizeErrorMessage = 'Invalid organization size.'
    return
  }
  organisationDetails.value.sizeErrorMessage = ''

  try {
    loaderStore.showLoader('Updating Profile details...')
    await updateOrganization({
      name: organisationDetails.value.name,
      size,
      country: organisationDetails.value.country,
    })
    toast.success('Profile details updated')
    editOrganisationDetails.value = false
    organisationDetailsResetState = { ...organisationDetails.value }
  } catch (e) {
    console.error(e)
    toast.error(
      'An error occurred while saving the profile details. Please try again or contact support'
    )
  } finally {
    loaderStore.hideLoader()
  }
}

onBeforeMount(() => {
  fetchProfile().then((response) => {
    organisationDetails.value = {
      name: response.data.organization.name,
      size: response.data.organization.size,
      country: response.data.organization.country,
    }
    organisationDetailsResetState = { ...organisationDetails.value }
  })
})

function resetOrganisationDetails() {
  editOrganisationDetails.value = false
  organisationDetails.value = { ...organisationDetailsResetState }

  if (organisationDetails.value.sizeErrorMessage) {
    organisationDetails.value.sizeErrorMessage = ''
  }
}
</script>

<template>
  <div>
    <AppHeader container />
    <main :class="{ container: route.name === 'AppProfile' }">
      <VStack class="heading" gap="1.5rem">
        <img
          v-if="route.name === 'AppProfile'"
          src="@/assets/iconography/back.svg"
          class="cursor-pointer"
          @click.stop="router.back()"
        />
        <h1>PROFILE DETAILS</h1>
      </VStack>
      <section class="personal-details">
        <div
          class="flex"
          style="justify-content: space-between; margin-right: 1.5em"
        >
          <h2>PERSONAL DETAILS</h2>
          <v-button
            variant="link"
            label="Edit"
            :disabled="true"
            style="visibility: hidden"
          />
        </div>
        <v-card
          variant="elevated"
          class="flex sm-column flex-wrap"
          style="
            gap: 1em;
            justify-content: space-between;
            padding: 1.5em;
            margin-top: 1em;
          "
        >
          <div class="flex column details">
            <span class="body-2">Name</span>
            <span class="sub-heading-3 overflow-ellipsis" :title="name">
              {{ name }}
            </span>
          </div>
          <div class="flex column details">
            <span class="body-2">Public Identifier</span>
            <span class="sub-heading-3 overflow-ellipsis" :title="email">
              {{ email }}
            </span>
          </div>
          <div class="flex column details" style="visibility: hidden"></div>
        </v-card>
      </section>
      <section style="margin-top: 3em">
        <div
          class="flex"
          style="justify-content: space-between; margin-right: 1.5em"
        >
          <h2>ORGANISATION DETAILS</h2>
          <v-button
            v-if="!editOrganisationDetails"
            variant="link"
            label="Edit"
            :disabled="false"
            @click="editOrganisationDetails = true"
          />
          <div v-else class="flex" style="gap: 1.5em">
            <v-button
              variant="link"
              label="Cancel"
              :disabled="false"
              style="color: #8d8d8d"
              @click="resetOrganisationDetails"
            />
            <v-button
              variant="link"
              label="Save"
              :disabled="false"
              @click="onUpdateOrganization"
            />
          </div>
        </div>
        <v-card
          variant="elevated"
          class="flex sm-column flex-wrap"
          style="
            gap: 1em;
            justify-content: space-between;
            padding: 1.5em;
            margin-top: 1em;
          "
        >
          <div class="flex column flex-grow">
            <div class="flex flex-wrap justify-space-between">
              <div class="flex column details">
                <span class="body-2">Organisation Name</span>
                <span
                  v-if="!editOrganisationDetails"
                  class="sub-heading-3 overflow-ellipsis"
                  :title="organisationDetails.name"
                >
                  {{ organisationDetails.name }}
                </span>
                <v-text-field v-else v-model="organisationDetails.name" />
              </div>
              <div class="flex column details">
                <span class="body-2">Organization Size</span>
                <span
                  v-if="organisationDetails.sizeErrorMessage"
                  class="body-3"
                  style="text-transform: uppercase; letter-spacing: 0.1em"
                >
                  {{ organisationDetails.sizeErrorMessage }}
                </span>
                <span
                  v-if="!editOrganisationDetails"
                  class="sub-heading-3 overflow-ellipsis"
                  :title="String(organisationDetails.size)"
                >
                  {{ organisationDetails.size }}
                </span>
                <v-text-field
                  v-else
                  v-model="organisationDetails.size"
                  type="number"
                  min="1"
                  step="1"
                />
              </div>
              <div class="flex column details">
                <span class="body-2">Country</span>
                <span
                  v-if="!editOrganisationDetails"
                  class="sub-heading-3 overflow-ellipsis"
                  :title="organisationDetails.country"
                >
                  {{ organisationDetails.country }}
                </span>
                <v-text-field v-else v-model="organisationDetails.country" />
              </div>
            </div>
          </div>
        </v-card>
      </section>
    </main>
  </div>
</template>

<style scoped>
.details {
  gap: 1em;
  width: 280px;
  margin-top: 1em;
}

.heading {
  margin-top: 2rem;
}

.personal-details {
  margin-top: 3rem;
}

.overflow-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media only screen and (max-width: 1023px) {
  .heading {
    margin-top: 0.9em;
    font-size: 1.8em;
  }

  .personal-details {
    margin-top: 2em;
  }
}
</style>
