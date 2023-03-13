import type VOverlayVue from '../lib/VOverlay/VOverlay.vue';

<script lang="ts" setup>
import { reactive, ref } from 'vue'

import VButton from '@/components/lib/VButton/VButton.vue'
import VCard from '@/components/lib/VCard/VCard.vue'
import VOverlay from '@/components/lib/VOverlay/VOverlay.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import VTextField from '@/components/lib/VTextField/VTextField.vue'
import { useToast } from '@/components/lib/VToast'
import { submitVerificationForm } from '@/services/gateway.service'
import { useAppsStore, type AppId } from '@/stores/apps.store'
import { useLoaderStore } from '@/stores/loader.store'
import { NetworkName } from '@/utils/constants'
import { isValidEmail } from '@/utils/validation'

type VerificationFormProps = {
  address: string
  appId: AppId
}

const props = defineProps<VerificationFormProps>()
const emit = defineEmits(['close', 'submitted'])
const toast = useToast()
const loaderStore = useLoaderStore()
const error = ref('')
const appsStore = useAppsStore()

const formData = reactive({
  companyName: '',
  projectName: '',
  incorporationNumber: '',
  companyLocation: '',
  contactName: '',
  contactEmail: '',
  contactTelegram: '',
  appUrl: '',
  projectDescription: '',
})

async function handleSubmit() {
  error.value = ''
  if (!formData.companyName.trim()) {
    return (error.value = 'Company name is required')
  }
  if (!formData.projectName.trim()) {
    return (error.value = 'Project name is required')
  }
  if (!formData.companyLocation.trim()) {
    return (error.value = 'Company location is required')
  }
  if (!formData.contactName.trim()) {
    return (error.value = 'Contact name is required')
  }
  if (!formData.contactEmail.trim()) {
    return (error.value = 'Contact email is required')
  }
  if (!isValidEmail(formData.contactEmail)) {
    return (error.value =
      'Invalid contact email. Please enter a valid email address')
  }
  if (!formData.appUrl.trim()) {
    return (error.value = 'Website or app url is required')
  }
  if (!formData.projectDescription.trim()) {
    return (error.value = 'A short project description is required')
  }
  if (formData.projectDescription.length > 160) {
    return (error.value = 'Project Description should be less than 160 words')
  }
  loaderStore.showLoader('Submitting the form for verification...')
  try {
    const app = appsStore.app(props.appId)
    await submitVerificationForm(app.network, {
      app: props.address,
      company_name: formData.companyName,
      project_name: formData.projectName,
      incorporation_number: formData.incorporationNumber.trim()
        ? Number(formData.incorporationNumber)
        : 0,
      company_location: formData.companyLocation,
      contact_name: formData.contactName,
      contact_email: formData.contactEmail,
      contact_telegram: formData.contactTelegram,
      app_url: formData.appUrl,
      description: formData.projectDescription,
    })
    toast.success('Form submitted')
    emit('submitted')
  } catch (e) {
    toast.error('Error occurred while submitting the form. Try again.')
  } finally {
    loaderStore.hideLoader()
  }
}
</script>

<template>
  <VOverlay>
    <div class="overlay-content">
      <VCard class="verification-form-card position-relative">
        <img
          src="@/assets/iconography/close.svg"
          class="position-absolute cursor-pointer"
          style="top: 1.25rem; right: 1.25rem; width: 1.25rem"
          @click.stop="emit('close')"
        />
        <VStack direction="column" align="center">
          <h3 class="verification-title">Verification Form</h3>
          <div class="verification-description" style="text-align: center">
            Fill up this verification form to register your application on
            {{ NetworkName.mainnet }} and enable the Global keys feature. For
            assistance,&nbsp;
            <a href="mailto:support@arcana.network">contact support</a>.
          </div>
          <form @submit.prevent="handleSubmit">
            <VStack
              direction="column"
              gap="1.25rem"
              style="padding-inline: 3rem"
            >
              <VTextField
                v-model="formData.companyName"
                label="Company Name"
                no-message
                placeholder="Ex: Aspire Pvt Ltd"
              />
              <VTextField
                v-model="formData.projectName"
                label="Project Name"
                no-message
                placeholder="Ex: Aspire"
              />
              <VTextField
                v-model="formData.incorporationNumber"
                label="Company Incorporation Number (Optional)"
                no-message
                placeholder="Ex: 1234567890"
                type="number"
              />
              <VTextField
                v-model="formData.companyLocation"
                label="Company Location"
                no-message
                placeholder="Ex: Cape Town, South Africa"
              />
              <VTextField
                v-model="formData.contactName"
                label="Contact Name"
                no-message
                placeholder="Ex: Karthik Nathan"
              />
              <VTextField
                v-model="formData.contactEmail"
                label="Contact Email"
                no-message
                placeholder="Ex: karthik98@gmail.com"
              />
              <VTextField
                v-model="formData.contactTelegram"
                label="Contact Telegram (Optional)"
                no-message
                placeholder="Ex: Karthik Nathan"
              />
              <VTextField
                v-model="formData.appUrl"
                label="Website or App URL"
                no-message
                placeholder="Ex: aspire.com"
              />
              <div class="form-group" aria-label="Form group">
                <label for="description"> Project Description </label>
                <div class="text-field">
                  <textarea
                    v-model="formData.projectDescription"
                    placeholder="Less than 160 words"
                    rows="4"
                  ></textarea>
                </div>
              </div>
              <div v-show="error.trim()" class="error">{{ error }}</div>
            </VStack>
            <VStack
              gap="1.25rem"
              style="justify-content: center; margin-block: 2rem"
              @click.stop="emit('close')"
            >
              <VButton variant="secondary" label="CANCEL"></VButton>
              <VButton type="submit" label="SUBMIT"></VButton>
            </VStack>
          </form>
        </VStack>
      </VCard>
    </div>
  </VOverlay>
</template>

<style scoped>
.overlay-content {
  padding-block: 2rem;
}

.verification-form-card {
  width: 100%;
  max-width: 600px;
  height: calc(100vh - 4rem);
  margin: auto;
  overflow-x: hidden;
  overflow-y: scroll;
}

form {
  width: 100%;
}

div.form-group {
  display: inline-flex;
  flex-direction: column;
}

label {
  margin-bottom: 0.5rem;
  margin-left: 0.25rem;
  font-family: var(--font-title);
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5em;
  color: var(--text-grey);
}

div.text-field {
  display: flex;
  background: linear-gradient(141.48deg, #161616 -4.56%, #151515 135.63%);
  border-radius: 10px;
  box-shadow: inset 5px 5px 10px rgb(11 11 11 / 50%),
    inset -50px 49px 29px 22px rgb(28 28 28 / 84%);
}

.text-field.focused {
  outline: 1px solid var(--primary);
}

textarea {
  width: 100%;
  padding: 0;
  margin: 0.875rem 1rem;
  font-family: var(--font-body);
  font-size: 1rem;
  line-height: 1.5;
  color: var(--text-white);
  resize: none;
  background: transparent;
  border: none;
  outline: none;
  box-shadow: none;

  --webkit-outline: none;
}

textarea::placeholder {
  font-family: var(--font-body);
  font-size: 1rem;
  line-height: 1.5;
  color: #393939;
}

.verification-title {
  margin-top: 2rem;
  margin-bottom: 0.5rem;
  font-size: 2rem;
  font-weight: 700;
}

.verification-description {
  padding-inline: 4.25rem;
  margin-bottom: 2rem;
  font-family: var(--font-body);
  font-size: 1rem;
  line-height: 1.5;
}

.verification-description a {
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: var(--primary);
  text-decoration: none;
}

.error {
  font-family: var(--font-body);
  font-size: 1rem;
  line-height: 1.5;
  color: var(--color-red);
}
</style>
