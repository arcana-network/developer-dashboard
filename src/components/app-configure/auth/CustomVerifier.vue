<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import DeleteIcon from '@/assets/iconography/delete-icon.svg'
import PlusIcon from '@/assets/iconography/plus-icon-cricle-white.svg'
import ConfigureActionButtons from '@/components/app-configure/ConfigureActionButtons.vue'
import { useToast } from '@/components/lib/VToast'
import {
  createCustomVerifer,
  fetchCustomVerifier,
  updateCustomVerifier,
} from '@/services/gateway.service'
import { useAppsStore } from '@/stores/apps.store'
import { useLoaderStore } from '@/stores/loader.store'
import { DOCS_URL } from '@/utils/constants'
import { content, errors } from '@/utils/content'
import copyToClipboard from '@/utils/copyToClipboard'

const LEARN_MORE_LINK = `${DOCS_URL}/setup/config-custom-oauth/`
const WHATS_JWKS_URL_LINK = `${DOCS_URL}/concepts/authtype/custom-oauth/#jwk-url`
const WHATS_JWK_VALIDATION_LINK = `${DOCS_URL}/concepts/authtype/custom-oauth/#jwt-attributesclaims`
const toast = useToast()
const appStore = useAppsStore()
const loaderStore = useLoaderStore()

const route = useRoute()
const appId = route.params.appId
const app = appStore.app(Number(appId))
const selectedIdParam = ref('sub')

const validationFields = ref([
  {
    field: '',
    value: '',
  },
])
const jwkUrl = ref('')
const issuer = ref('')
const audience = ref('')
const idParam = ref('sub')
const fetchedData = ref({
  id: '',
  jwkUrl: '',
  issuer: '',
  audience: '',
  idParam: 'sub',
  name: '',
  params: [
    {
      field: '',
      value: '',
    },
  ],
})

onMounted(fetchAndSetData)

async function fetchAndSetData() {
  const data = await getCustomProvider()
  const fields =
    Object.values(data.params).length > 0
      ? Object.entries(data.params).map(([field, value]) => ({ field, value }))
      : [{ field: '', value: '' }]

  if (data) {
    fetchedData.value = data
    jwkUrl.value = data.jwkUrl
    issuer.value = data.issuer
    audience.value = data.audience
    selectedIdParam.value =
      data.idParam !== 'sub' && data.idParam !== 'email'
        ? 'custom'
        : data.idParam
    idParam.value = data.idParam
    validationFields.value = fields
  }
}

function addValidationField() {
  const entries = validationFields.value
  const lastEntry = entries[entries.length - 1]
  if (!lastEntry.field || !lastEntry.value) {
    toast.error('Please fill the fields before adding a new one')
    return
  }
  entries.push({
    field: '',
    value: '',
  })
  validationFields.value = [...entries]
}

function removeValidationField(index: number) {
  validationFields.value.splice(index, 1)
}

function showDeleteButton(index: number) {
  return validationFields.value.length > index + 1 || index === 2
}

function onFieldChange(e: Event, index: number) {
  const entries = validationFields.value
  entries[index].field = (e.target as HTMLInputElement).value
  validationFields.value = [...entries]
}

function onValueChange(e: Event, index: number) {
  const entries = validationFields.value
  entries[index].value = (e.target as HTMLInputElement).value
  validationFields.value = [...entries]
}

function validateForm() {
  if (!jwkUrl.value) {
    toast.error('Please fill the JWK URL field')
    return false
  }
  if (!issuer.value) {
    toast.error('Please fill the Issuer field')
    return false
  }
  if (!audience.value) {
    toast.error('Please fill the Audience field')
    return false
  }
  if (
    Object.values(validationFields.value).length > 1 &&
    validationFields.value.some(({ field, value }) => !field || !value)
  ) {
    toast.error('Please fill all the validation fields')
    return false
  }
  return true
}

function disableSubmitButton() {
  if (isFetchedDataEmpty()) {
    return !jwkUrl.value || !idParam.value || !issuer.value || !audience.value
  } else {
    return (
      jwkUrl.value === fetchedData.value.jwkUrl &&
      issuer.value === fetchedData.value.issuer &&
      audience.value === fetchedData.value.audience &&
      idParam.value === fetchedData.value.idParam &&
      JSON.stringify(validationFields.value) ===
        JSON.stringify(
          Object.entries(fetchedData.value.params).map(([field, value]) => ({
            field,
            value,
          }))
        )
    )
  }
}

async function getCustomProvider() {
  loaderStore.showLoader('Fetching configuration')
  try {
    const { data } = await fetchCustomVerifier(appId as string, app.network)
    return data[0]
  } catch (e) {
    toast.error('Failed to fetch the configuration')
    return {}
  } finally {
    loaderStore.hideLoader()
  }
}

async function submitForm() {
  if (isFetchedDataEmpty()) {
    saveForm()
  } else {
    updateForm()
  }
}

function resetForm() {
  jwkUrl.value = fetchedData.value.jwkUrl
  issuer.value = fetchedData.value.issuer
  audience.value = fetchedData.value.audience
  idParam.value = fetchedData.value.idParam
  validationFields.value = fetchedData.value.params
}

function isFetchedDataEmpty() {
  return !fetchedData.value.jwkUrl
}

function getParamsInObj(validationFields: any[]): { [key: string]: string } {
  const params: { [key: string]: string } = {}
  for (const { field, value } of validationFields) {
    if (field && value) {
      params[field] = value
    }
  }
  return params
}

async function saveForm() {
  loaderStore.showLoader('Saving configuration')
  if (!validateForm()) {
    loaderStore.hideLoader()
    return
  }
  const data = {
    idParam: idParam.value,
    jwkUrl: jwkUrl.value,
    issuer: issuer.value,
    audience: audience.value,
    params: getParamsInObj(validationFields.value),
    appAddress: app.address,
  }
  try {
    await createCustomVerifer(appId as string, app.network, data)
    await fetchAndSetData()
    toast.success('Configuration saved successfully')
  } catch (e) {
    toast.error('Failed to save the configuration')
  } finally {
    loaderStore.hideLoader()
  }
}

async function updateForm() {
  loaderStore.showLoader('Updating configuration')
  if (!validateForm()) {
    loaderStore.hideLoader()
    return
  }
  const data = {
    idParam: idParam.value,
    jwkUrl: jwkUrl.value,
    issuer: issuer.value,
    audience: audience.value,
    params: getParamsInObj(validationFields.value),
    appAddress: app.address,
  }
  try {
    await updateCustomVerifier(Number(fetchedData.value.id), app.network, data)
    await fetchAndSetData()
    toast.success('Configuration updated successfully')
  } catch (e) {
    toast.error('Failed to update the configuration')
  } finally {
    loaderStore.hideLoader()
  }
}

async function copyCustomProviderId(id: string) {
  try {
    await copyToClipboard(id)
    toast.success(content.CUSTOM_PROVIDER_ID.COPIED)
  } catch (e) {
    toast.error(errors.CUSTOM_PROVIDER_ID.ERROR)
  }
}

watch(
  () => selectedIdParam.value,
  (newValue) => {
    if (newValue === 'custom')
      idParam.value = isFetchedDataEmpty() ? '' : fetchedData.value.idParam
    else idParam.value = newValue
  }
)
</script>

<template>
  <div class="bg-white rounded-xl space-y-5">
    <div>
      <div
        class="flex items-center justify-between border-b border-liquidgrey p-3.5"
      >
        <h2 class="text-sm uppercase font-bold">Custom OAuth</h2>
        <div v-if="fetchedData.name" class="flex items-center space-x-2">
          <span class="text-sm uppercase font-bold">Custom Provider ID</span>
          <div class="bg-[#313131] py-1 px-2 rounded flex space-x-4">
            <span class="text-sm">{{ fetchedData.name }}</span>
            <button @click.stop="copyCustomProviderId(fetchedData.name)">
              <img
                src="@/assets/iconography/copy-white.svg"
                class="cursor-pointer w-4"
              />
            </button>
          </div>
        </div>
      </div>
      <p class="text-[#8D8D8D] text-sm font-normal p-3.5">
        Increase adoption of your app by enabling this option. Arcana will take
        care of issuing public and private keys to each user through our
        De-centralized Key Generation (DKG) mechanism and keep them secure.
        <a
          :href="LEARN_MORE_LINK"
          target="_blank"
          class="no-underline uppercase text-black text-sm font-bold"
          >Learn More</a
        >
      </p>
    </div>
    <div class="p-3.5 flex">
      <div class="flex-1 space-y-2">
        <fieldset class="space-y-2">
          <legend class="text-[#8D8D8D] text-xs font-normal">
            User Identifier String
          </legend>
          <div class="flex items-baseline space-x-5">
            <div class="space-x-2">
              <input
                id="sub"
                v-model="selectedIdParam"
                type="radio"
                name="idParam"
                value="sub"
              />
              <label class="text-black font-normal" for="sub">Sub</label>
            </div>
            <div class="space-x-2">
              <input
                id="email"
                v-model="selectedIdParam"
                type="radio"
                name="idParam"
                value="email"
              />
              <label class="text-black font-normal" for="email">Email</label>
            </div>
            <div class="space-x-2">
              <input
                id="custom"
                v-model="selectedIdParam"
                type="radio"
                name="idParam"
                value="custom"
              />
              <label class="text-black font-normal" for="custom">Custom</label>
            </div>
          </div>
          <div>
            <input
              v-if="selectedIdParam === 'custom'"
              v-model="idParam"
              type="text"
              name="idParam"
              class="text-white bg-liquidlight p-2 rounded-md outline-none w-full"
            />
          </div>
        </fieldset>
        <div>
          <div class="flex w-full justify-between">
            <legend class="text-[#8D8D8D] text-xs font-normal">
              <span>JWKS URL</span>
              <span class="text-red-800 text-lg">*</span>
            </legend>
            <a
              :href="WHATS_JWKS_URL_LINK"
              target="_blank"
              class="text-xs no-underline text-white font-normal"
              >What is JWKS Endpoint?</a
            >
          </div>
          <div class="w-full">
            <input
              id="value"
              v-model="jwkUrl"
              type="text"
              name="validation"
              class="text-black bg-liquidlight p-2 rounded-md outline-none w-full"
            />
          </div>
        </div>
        <div>
          <div class="flex w-full justify-between">
            <legend class="text-[#8D8D8D] text-xs font-normal">
              <span>Issuer</span>
              <span class="text-red-800 text-lg">*</span>
            </legend>
          </div>
          <div class="w-full">
            <input
              id="value"
              v-model="issuer"
              type="text"
              name="Issuer"
              class="text-black bg-liquidlight p-2 rounded-md outline-none w-full"
            />
          </div>
        </div>
        <div>
          <div class="flex w-full justify-between">
            <legend class="text-[#8D8D8D] text-xs font-normal">
              <span>Audience</span>
              <span class="text-red-800 text-lg">*</span>
            </legend>
          </div>
          <div class="w-full">
            <input
              id="value"
              v-model="audience"
              type="text"
              name="audience"
              class="text-black bg-liquidlight p-2 rounded-md outline-none w-full"
            />
          </div>
        </div>
      </div>
      <div class="flex flex-col flex-1 space-y-5 ml-10">
        <div class="flex flex-col space-y-2">
          <div class="flex w-full justify-between">
            <legend class="text-liquiddark text-xs font-normal">
              JWK Validation (Optional)
            </legend>
            <a
              :href="WHATS_JWK_VALIDATION_LINK"
              target="_blank"
              class="text-xs no-underline text-white font-normal"
              >What are Validation fields?</a
            >
          </div>
          <div
            v-for="(item, idx) in validationFields"
            :key="idx"
            class="flex items-center"
          >
            <div class="flex-1">
              <input
                id="field"
                type="text"
                name="validation"
                :value="item.field"
                :onInput="($event) => onFieldChange($event, idx)"
                class="text-black bg-liquidlight p-2 rounded-md outline-none w-full"
              />
            </div>
            <div class="ml-2 flex-1">
              <input
                id="value"
                type="text"
                name="validation"
                :value="item.value"
                :onInput="($event) => onValueChange($event, idx)"
                class="text-black bg-liquidlight p-2 rounded-md outline-none w-full"
              />
            </div>
            <div class="ml-2 w-7 h-7">
              <button
                v-if="showDeleteButton(idx)"
                class="text-black flex items-center w-7 h-7"
                @click="removeValidationField(idx)"
              >
                <img :src="DeleteIcon" alt="Add Chain" class="w-7 h-7" />
              </button>
              <button
                v-else-if="idx < 2"
                class="text-black flex items-center w-7 h-7"
                @click="addValidationField"
              >
                <img :src="PlusIcon" alt="Add Chain" class="w-7 h-7" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="space-x-5 flex justify-end p-3.5">
      <ConfigureActionButtons
        :save-disabled="disableSubmitButton()"
        @save="submitForm"
        @cancel="resetForm"
      />
    </div>
  </div>
</template>
