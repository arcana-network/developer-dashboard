<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import VOverlay from '@/components/lib/VOverlay/VOverlay.vue'
import VSwitch from '@/components/lib/VSwitch/VSwitch.vue'
import { useToast } from '@/components/lib/VToast'
import {
  getAbi,
  createSmartContract,
  getSmartContractMethods,
  editSmartContract,
} from '@/services/gateway.service'
import { useAppsStore } from '@/stores/apps.store'
import { useGaslessStore } from '@/stores/gasless.store'
import { content, errors } from '@/utils/content'

const emits = defineEmits(['close'])
const contractName = ref('')
const contractAddress = ref('')
const gaslessStore = useGaslessStore()
const route = useRoute()
const appStore = useAppsStore()
const abi = ref([])
const fetchedAbi = ref([])
const enteredAbi = ref('')
const showEnteredAbiError = ref(false)
const toast = useToast()
const loader = ref({
  show: false,
  message: '',
})

function showLoader(message: string) {
  loader.value.show = true
  loader.value.message = message
}

function hideLoader() {
  loader.value.show = false
  loader.value.message = ''
}

const props = defineProps({
  depositTankId: {
    type: Number,
    default: null,
  },
  formType: {
    type: String,
    default: 'add',
  },
  editSmartContractInfo: {
    type: Number,
    default: null,
  },
})

function extractValidABI(abiList: Array<object>, enabledMethods = []) {
  return abiList
    .filter(
      (item) =>
        item.type === 'function' &&
        item.stateMutability !== 'pure' &&
        item.stateMutability !== 'view'
    )
    .map((item) => {
      item.enabled = enabledMethods.includes(item.name)
      return item
    })
}

async function fetchAbi() {
  showLoader(content.GENERIC.ABI)
  try {
    const depositTankId = props.depositTankId
    const selectedGasTank = gaslessStore.gastankList.find((item) => {
      return item.id === depositTankId
    })
    const appId = route.params.appId
    const app = appStore.app(appId)
    fetchedAbi.value = (
      await getAbi(selectedGasTank?.chainId, contractAddress.value, app.network)
    ).data
    abi.value = extractValidABI(JSON.parse(fetchedAbi.value))
  } catch (e) {
    if (e?.response?.data?.err) {
      toast.error(e?.response?.data?.err)
    } else toast.error(errors.GENERIC.ABI)
  } finally {
    hideLoader()
  }
}

async function fetchSmartContractMethods() {
  try {
    showLoader('Fetching Whitelists...')
    const appId = route.params.appId
    const app = appStore.app(appId)
    const smartContractId = props.editSmartContractInfo
    const methods = (
      await getSmartContractMethods(smartContractId, app.network)
    ).data
    contractName.value = methods.name
    contractAddress.value = methods.address
    fetchedAbi.value = methods.abi
    abi.value = extractValidABI(
      JSON.parse(fetchedAbi.value),
      methods.whitelisted_methods
    )
  } catch (e) {
    console.log(e)
  } finally {
    hideLoader()
  }
}

function toggleFunction(itemIndex: number) {
  const enabledStated = abi.value[itemIndex].enabled
  abi.value[itemIndex].enabled = !enabledStated
}

function getPayload() {
  const formType = props.formType

  const whitelistedMethods = abi.value
    .filter((item) => item.enabled)
    .map((item) => item.name)

  if (formType === 'add') {
    return {
      gas_tank: props.depositTankId,
      name: contractName.value,
      address: contractAddress.value,
      abi: JSON.stringify(abi.value),
      whitelisted_methods: whitelistedMethods,
    }
  }
  if (formType === 'edit') {
    return {
      name: contractName.value,
      id: props.editSmartContractInfo,
      whitelisted_methods: whitelistedMethods,
    }
  }
}

async function save() {
  try {
    showLoader(content.SMART_CONTRACT.CREATING)
    const appId = route.params.appId
    const app = appStore.app(appId)
    const payload = getPayload()

    if (props.formType === 'edit') {
      await editSmartContract(payload, app.network)
      toast.success(content.SMART_CONTRACT.WHITELIST_EDIT)
    }
    if (props.formType === 'add') {
      await createSmartContract(payload, app.network)
      toast.success(content.SMART_CONTRACT.CREATED)
    }
    emits('close')
  } catch (e) {
    if (e?.response?.data?.err) {
      toast.error(e?.response?.data?.err)
    } else toast.error(content.SMART_CONTRACT.FAILED)
  } finally {
    hideLoader()
  }
}

const enableSave = computed(() => {
  return (
    contractAddress.value.length &&
    contractName.value.length &&
    abi.value.length
  )
})

watch(
  () => contractAddress.value,
  () => {
    if (contractAddress.value.length === 0) abi.value = []
  }
)

watch(
  () => enteredAbi.value,
  () => {
    try {
      if (enteredAbi.value === '') showEnteredAbiError.value = false
      const parsedAbi = JSON.parse(`${enteredAbi.value}`)
      if (Array.isArray(parsedAbi)) {
        const validAbi = extractValidABI(parsedAbi)
        if (!validAbi.length) showEnteredAbiError.value = true
        else {
          showEnteredAbiError.value = false
          abi.value = validAbi
        }
      } else showEnteredAbiError.value = true
    } catch (e) {
      if (enteredAbi.value === '') {
        showEnteredAbiError.value = false
        abi.value = []
      } else showEnteredAbiError.value = true
    }
  }
)

onMounted(() => {
  if (props.formType === 'edit') fetchSmartContractMethods()
})
</script>

<template>
  <VOverlay>
    <div class="h-full flex overflow-y-auto py-2">
      <div
        v-if="loader.show"
        class="flex justify-center items-center m-auto h-[430px] w-[630px] border-[1px] border-[#363636] bg-white rounded-lg"
      >
        {{ loader.message }}
      </div>
      <div
        v-else
        class="flex flex-column border-[1px] border-[#363636] rounded-lg h-[430px] w-[630px] text-black p-4 space-y-5 bg-white m-auto"
      >
        <div class="space-y-[10px]">
          <p class="text-sm">Add Smart Contracts</p>
          <p class="text-sm text-liquiddark leading-4">
            Specify the details of a contract to add it to the whitelist
          </p>
        </div>
        <div class="flex space-x-3 flex-1 overflow-hidden">
          <form class="w-1/2 space-y-3 flex flex-col">
            <div class="flex flex-col space-y-2">
              <label for="network-name" class="text-xs text-liquiddark"
                >Contract Name</label
              >
              <input
                v-model="contractName"
                type="text"
                class="text-sm bg-liquidlight p-[10px] w-full border-none outline-none rounded-md"
                name="network-name"
              />
            </div>
            <div class="flex flex-col space-y-2">
              <div class="flex justify-between items-baseline">
                <label for="network-name" class="text-xs text-liquiddark"
                  >Smart Contract Address</label
                >
                <button
                  v-if="contractAddress.length && props.formType === 'add'"
                  class="text-xs text-black underline"
                  @click.prevent="fetchAbi"
                >
                  Fetch ABI
                </button>
              </div>
              <input
                v-model="contractAddress"
                type="text"
                class="text-sm bg-liquidlight p-[10px] w-full border-none outline-none rounded-md"
                :class="{
                  'text-gray-500': props.formType === 'edit',
                }"
                name="network-name"
                :disabled="props.formType === 'edit'"
              />
            </div>
            <div class="flex flex-col space-y-2 flex-1">
              <label for="network-name" class="text-xs text-liquiddark"
                >Application Binary Interface (ABI)</label
              >
              <textarea
                v-model="enteredAbi"
                type="text"
                class="text-sm bg-liquidlight p-[10px] w-full flex-1 border-none outline-none rounded-md"
                name="network-name"
                :class="{
                  'text-gray-500': props.formType === 'edit',
                }"
                :disabled="props.formType === 'edit'"
              ></textarea>
              <p v-if="showEnteredAbiError" class="text-xs text-red-500">
                Entered ABI is invalid, please add a valid JSON ABI
              </p>
            </div>
          </form>
          <div class="w-1/2 flex flex-column space-y-2 overflow-hidden">
            <span class="text-xs text-liquiddark"
              >Functions to Sponsor Gas Fees</span
            >
            <div class="flex-1 bg-liquidlight p-1 overflow-auto space-y-2">
              <div
                v-for="(abiItem, itemIndex) in abi"
                :key="abiItem.name"
                class="flex justify-between items-center"
              >
                <span>{{ abiItem.name }}</span>
                <VSwitch
                  :value="abiItem.enabled"
                  @update:model-value="() => toggleFunction(itemIndex)"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="space-x-2.5 flex justify-end">
          <button
            class="border-[1.5px] bg-liquid hover:text-pink border-[#F7F7F7] w-[100px] p-2 rounded-3xl"
            @click.stop="emits('close')"
          >
            Cancel
          </button>
          <button
            class="bg-liquid text-black w-[100px] p-2 rounded-3xl transition-opacity duration-500"
            :class="[
              !enableSave ? 'opacity-40' : 'opacity-100 hover:text-pink',
            ]"
            :disabled="!enableSave"
            @click.stop="save"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </VOverlay>
</template>
