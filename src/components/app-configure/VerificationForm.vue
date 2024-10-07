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
import { content, errors } from '@/utils/content'
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
    return toast.error(errors.FORM.COMPANY_NAME)
  }
  if (!formData.projectName.trim()) {
    return toast.error(errors.FORM.PROJECT_NAME)
  }
  if (!formData.companyLocation.trim()) {
    return toast.error(errors.FORM.COMPANY_LOCATION)
  }
  if (!formData.contactName.trim()) {
    return toast.error(errors.FORM.CONTACT_NAME)
  }
  if (!formData.contactEmail.trim()) {
    return toast.error(errors.FORM.CONTACT_EMAIL)
  }
  if (!isValidEmail(formData.contactEmail)) {
    return toast.error(errors.FORM.VALID_MAIL)
  }
  if (!formData.appUrl.trim()) {
    return toast.error(errors.FORM.URL)
  }
  if (!formData.projectDescription.trim()) {
    return toast.error(errors.FORM.DESCRIPTION)
  }
  if (formData.projectDescription.length > 160) {
    return toast.error(errors.FORM.DESCRIPTION_LENGTH)
  }
  loaderStore.showLoader(content.VERIFICATION.FORM_SUBMIT)
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
    toast.success(content.VERIFICATION.FORM_SUCCESS)
    emit('submitted')
  } catch (e) {
    toast.error(errors.FORM.SUBMIT)
  } finally {
    loaderStore.hideLoader()
  }
}
</script>

<template>
  <VOverlay>
    <div class="py-8">
      <VCard
        class="relative w-full max-w-px600 h-calc-full-minus-rem4 mx-auto overflow-x-hidden overflow-y-scroll"
      >
        <img
          src="@/assets/iconography/close.svg"
          class="absolute cursor-pointer top-5 right-5 w-5"
          @click.stop="emit('close')"
        />
        <VStack direction="column" align="center">
          <h3 class="mt-8 mb-2 text-2xl font-bold">Verification Form</h3>
          <div class="px-rem4.25 mb-8 text-base leading-6 text-center">
            Fill up this verification form to register your application on
            {{ NetworkName.mainnet }} and enable the Global keys feature. For
            assistance,&nbsp;
            <a
              href="mailto:support@arcana.network"
              class="text-base font-normal leading-6 no-underline text-cornflower_blue-default"
              >contact support</a
            >.
          </div>
          <form class="w-full" @submit.prevent="handleSubmit">
            <VStack direction="column" gap="1.25rem" class="px-12">
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
              <div class="inline-flex flex-col" aria-label="Form group">
                <label
                  for="description"
                  class="mb-2 ml-1 text-base font-normal leading-6 text-black_solid-default"
                >
                  Project Description
                </label>
                <div
                  class="flex rounded-px10 bg-firefly-default focus:outline focus:outline-cornflower_blue-default focus:outline-1"
                >
                  <textarea
                    v-model="formData.projectDescription"
                    placeholder="Less than 160 words"
                    rows="4"
                    class="w-full p-0 my-3.5 mx-4 text-base leading-6 resize-none bg-transparent border-0 outline-none shadow-none placeholder:text-system-grey text-black_solid-default placeholder:text-base placeholder:leading-6"
                  ></textarea>
                </div>
              </div>
              <div
                v-show="error.trim()"
                class="text-base leading-6 text-system-red"
              >
                {{ error }}
              </div>
            </VStack>
            <VStack gap="1.25rem" class="flex justify-center mb-8">
              <VButton
                variant="secondary"
                label="CANCEL"
                @click.stop="emit('close')"
              ></VButton>
              <VButton type="submit" label="SUBMIT"></VButton>
            </VStack>
          </form>
        </VStack>
      </VCard>
    </div>
  </VOverlay>
</template>
