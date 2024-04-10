<script setup lang="ts">
import { onMounted, ref } from 'vue'
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

const LEARN_MORE_LINK = `${DOCS_URL}/howto/custom-Verifier`
const toast = useToast()
const appStore = useAppsStore()
const loaderStore = useLoaderStore()

const route = useRoute()
const appId = route.params.appId
const app = appStore.app(Number(appId))

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
  jwkUrl: '',
  issuer: '',
  audience: '',
  idParam: 'sub',
  params: [
    {
      field: '',
      value: '',
    },
  ],
})

onMounted(async () => {
  const data = await getCustomProvider()
  if (data) {
    fetchedData.value = data
    jwkUrl.value = data.jwkUrl
    issuer.value = data.issuer
    audience.value = data.audience
    idParam.value = data.idParam
    validationFields.value = data.params.map(
      ({ field, value }: { field: string; value: string }) => ({
        field,
        value,
      })
    )
  }
})

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
  if (!validationFields.value.every((item) => item.field && item.value)) {
    toast.error('Please fill all the validation fields')
    return false
  }
  return true
}

function disableSubmitButton() {
  return (
    jwkUrl.value === fetchedData.value.jwkUrl &&
    issuer.value === fetchedData.value.issuer &&
    audience.value === fetchedData.value.audience &&
    idParam.value === fetchedData.value.idParam &&
    validationFields.value.every((item, idx) => {
      console.log(item.field, fetchedData.value.params[idx].field)
      console.log(item.value, fetchedData.value.params[idx].value)
      return (
        item.field === fetchedData.value.params[idx].field &&
        item.value === fetchedData.value.params[idx].value
      )
    })
  )
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

async function saveForm() {
  loaderStore.showLoader('Saving configuration')
  if (!validateForm()) return
  const data = {
    idParam: idParam.value,
    jwkUrl: jwkUrl.value,
    issuer: issuer.value,
    audience: audience.value,
    params: validationFields.value,
    appAddress: app.address,
  }
  try {
    await createCustomVerifer(appId as string, app.network, data)
    toast.success('Configuration saved successfully')
  } catch (e) {
    toast.error('Failed to save the configuration')
  } finally {
    loaderStore.hideLoader()
  }
}

async function updateForm() {
  loaderStore.showLoader('Updating configuration')
  if (!validateForm()) return
  const data = {
    idParam: idParam.value,
    jwkUrl: jwkUrl.value,
    issuer: issuer.value,
    audience: audience.value,
    params: validationFields.value,
    appAddress: app.address,
  }
  try {
    await updateCustomVerifier(appId as string, app.network, data)
    toast.success('Configuration updated successfully')
  } catch (e) {
    toast.error('Failed to update the configuration')
  } finally {
    loaderStore.hideLoader()
  }
}
</script>

<template>
  <div class="border-2 border-[#363636] bg-[#1F1F1F] rounded-xl space-y-5">
    <div>
      <h2 class="text-sm uppercase font-bold p-3.5 border-b-2 border-[#363636]">
        Custom Provider
      </h2>
      <p class="text-[#8D8D8D] text-sm font-normal p-3.5">
        Increase adoption of your app by enabling this option. Arcana will take
        care of issuing public and prviate keys to each user through our
        Decentralised Key Generation (DKG) mechanism and keep them secure.
        <a
          :href="LEARN_MORE_LINK"
          target="_blank"
          class="no-underline uppercase text-white text-sm font-bold"
          >Learn More</a
        >
      </p>
    </div>
    <div class="p-3.5 flex">
      <div class="flex flex-col flex-1 space-y-5">
        <fieldset class="space-y-2">
          <div class="flex justify-between">
            <legend class="text-[#8D8D8D] text-xs font-normal">ID Param</legend>
            <span class="text-xs font-normal">What is ID?</span>
          </div>
          <div class="flex items-baseline space-x-5">
            <div class="space-x-2">
              <input
                id="sub"
                v-model="idParam"
                type="radio"
                name="idParam"
                value="sub"
              />
              <label for="sub">Sub</label>
            </div>
            <div class="space-x-2">
              <input
                id="email"
                v-model="idParam"
                type="radio"
                name="idParam"
                value="email"
              />
              <label for="email">Email</label>
            </div>
          </div>
        </fieldset>
        <div class="flex flex-col space-y-2">
          <div class="flex w-full justify-between">
            <legend class="text-[#8D8D8D] text-xs font-normal">
              JWK Validation
            </legend>
            <span class="text-xs font-normal">What are Validation fields?</span>
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
                class="text-white bg-[#313131] p-2 rounded-md outline-none w-full"
              />
            </div>
            <div class="ml-2 flex-1">
              <input
                id="value"
                type="text"
                name="validation"
                :value="item.value"
                :onInput="($event) => onValueChange($event, idx)"
                class="text-white bg-[#313131] p-2 rounded-md outline-none w-full"
              />
            </div>
            <div class="ml-2 w-7 h-7">
              <button
                v-if="showDeleteButton(idx)"
                class="text-white flex items-center w-7 h-7"
                @click="removeValidationField(idx)"
              >
                <img :src="DeleteIcon" alt="Add Chain" class="w-7 h-7" />
              </button>
              <button
                v-else-if="idx < 2"
                class="text-white flex items-center w-7 h-7"
                @click="addValidationField"
              >
                <img :src="PlusIcon" alt="Add Chain" class="w-7 h-7" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-1 ml-10 space-y-2">
        <div>
          <div class="flex w-full justify-between">
            <legend class="text-[#8D8D8D] text-xs font-normal">JWK URL</legend>
            <span class="text-xs font-normal">What is JWK URL?</span>
          </div>
          <div class="w-full">
            <input
              id="value"
              v-model="jwkUrl"
              type="text"
              name="validation"
              class="text-white bg-[#313131] p-2 rounded-md outline-none w-full"
            />
          </div>
        </div>
        <div>
          <div class="flex w-full justify-between">
            <legend class="text-[#8D8D8D] text-xs font-normal">Issuer</legend>
          </div>
          <div class="w-full">
            <input
              id="value"
              v-model="issuer"
              type="text"
              name="Issuer"
              class="text-white bg-[#313131] p-2 rounded-md outline-none w-full"
            />
          </div>
        </div>
        <div>
          <div class="flex w-full justify-between">
            <legend class="text-[#8D8D8D] text-xs font-normal">Audience</legend>
          </div>
          <div class="w-full">
            <input
              id="value"
              v-model="audience"
              type="text"
              name="audience"
              class="text-white bg-[#313131] p-2 rounded-md outline-none w-full"
            />
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
