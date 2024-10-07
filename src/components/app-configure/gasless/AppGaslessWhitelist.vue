<script setup lang="ts">
import moment from 'moment'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import MoreIcon from '@/assets/iconography/more.svg'
import VOverlay from '@/components/lib/VOverlay/VOverlay.vue'
import {
  getSmartContracts,
  deleteSmartContract,
} from '@/services/gateway.service'
import { useAppsStore } from '@/stores/apps.store'
import { useClickOutside } from '@/use/clickOutside'

const emits = defineEmits(['edit', 'add-contract', 'cancel'])

const rowOptions = [
  {
    label: 'Edit',
    value: 0,
  },
  {
    label: 'Delete',
    value: 1,
  },
]

const appStore = useAppsStore()
const route = useRoute()
const whitelists = ref([])
const showRowOptionsOf = ref(null)
const showRowOptions_menu = ref(null)
const showConfirmDelete = ref({
  show: false,
  index: -1,
})
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

useClickOutside(showRowOptions_menu, () => {
  showRowOptionsOf.value = null
})

const props = defineProps({
  gasTankId: {
    type: Number,
    default: null,
  },
})

onMounted(fetchWhitelists)

async function fetchWhitelists() {
  try {
    showLoader('Fetching Whitelists...')
    const appId = route.params.appId
    const app = appStore.app(appId)
    const gasTankId = props.gasTankId
    const list = (await getSmartContracts(gasTankId, app.network)).data
    whitelists.value = list
  } catch (e) {
    console.log(e)
  } finally {
    hideLoader()
  }
}

function onClickOfOption(option: number, listIndex: number) {
  const info = whitelists.value[listIndex].id
  if (option === 0) emits('edit', info)
  if (option === 1) showConfirmDelete.value = { show: true, index: listIndex }
}

async function deleteHandler(listIndex: number) {
  try {
    showLoader('deleting...')
    const appId = route.params.appId
    const app = appStore.app(appId)
    const selectedContract = whitelists.value[listIndex]
    const smartContractId = selectedContract.id
    await deleteSmartContract(smartContractId, app.network)
  } catch (e) {
    console.log(e)
  } finally {
    hideLoader()
    hideDeleteConfirm()
    await fetchWhitelists()
  }
}

function hideDeleteConfirm() {
  showConfirmDelete.value = { show: false, index: -1 }
}
</script>

<template>
  <VOverlay>
    <div class="h-full flex overflow-y-auto py-2">
      <div
        v-if="loader.show"
        class="flex justify-center items-center m-auto h-px350 w-px630 border-px1 border-system-black_shadow bg-white_solid-default rounded-lg"
      >
        {{ loader.message }}
      </div>
      <div
        v-else
        class="flex flex-column justify-center border-px1 border-system-black_shadow rounded-lg min-h-px350 max-h-px430 w-px630 text-black_solid-default p-4 bg-white_solid-default m-auto overflow-hidden"
      >
        <div
          v-if="showConfirmDelete.show"
          class="flex flex-column justify-center items-center space-y-3"
        >
          <p class="text-xl text-center">
            Are you sure you want to delete this contract from the whitelist?
          </p>
          <div class="space-x-2.5">
            <button
              class="border-px1.5 border-whitemist-default w-px100 p-2 rounded-md"
              @click="hideDeleteConfirm"
            >
              Cancel
            </button>
            <button
              class="border-px1.5 border-whitemist-default bg-white_solid-default text-black_solid-default w-px100 p-2 rounded-md"
              @click.stop="deleteHandler(showConfirmDelete.index)"
            >
              Delete
            </button>
          </div>
        </div>
        <div v-else class="space-y-5">
          <div class="space-y-px10">
            <p class="text-sm">Whitelist Smart Contracts</p>
            <p class="text-sm text-system-grey leading-4">
              The following is a list of contracts that are whitelisted for the
              sponsorship of gas fees.
            </p>
          </div>
          <div
            class="flex flex-1 flex-column items-end space-y-2 overflow-hidden"
          >
            <button class="text-sm" @click.stop="emits('add-contract')">
              Add Contract
            </button>
            <div
              class="rounded-md border-px1 border-system-light_gray w-full overflow-auto"
            >
              <table
                v-if="whitelists.length"
                class="table-fixed text-black_solid-default block overflow-x-auto border-collapse w-full"
              >
                <thead class="border-b-px1 border-b-system-light_gray">
                  <tr class="text-system-grey text-xs">
                    <th class="w-25% p-px15 text-left text-px12 font-normal">
                      Contract Name
                    </th>
                    <th class="w-25% p-px15 text-left text-px12 font-normal">
                      Functions Enabled
                    </th>
                    <th class="w-40% p-px15 text-left text-px12 font-normal">
                      Date Added
                    </th>
                    <th
                      class="w-5% p-px15 text-left text-px12 font-normal"
                    ></th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(list, index) in whitelists"
                    :key="list.name"
                    class="hover:bg-whitemist-default"
                  >
                    <td
                      class="p-px15 text-left text-px14 font-medium overflow-ellipsis"
                    >
                      {{ list.name }}
                    </td>
                    <td
                      class="p-px15 text-left text-px14 font-medium overflow-ellipsis"
                    >
                      {{ list.whitelisted_methods }}
                    </td>
                    <td
                      class="p-px15 text-left text-px14 font-medium overflow-ellipsis"
                    >
                      {{
                        moment(list.created_at).format('MMM D YYYY, H:mm:ss')
                      }}
                    </td>
                    <td
                      class="p-px15 text-left text-px14 font-medium overflow-ellipsis"
                    >
                      <PopperJs placement="left-start" :arrow="true">
                        <button
                          class="flex justify-center items-center cursor-pointer w-7 h-7 bg-system-light_shadow rounded-px5"
                        >
                          <img :src="MoreIcon" alt="more" />
                        </button>
                        <template #content>
                          <ul
                            ref="showRowOptions_menu"
                            class="flex flex-col bg-white_solid-default text-black_solid-default rounded-md border-px1 p-2 space-y-1 absolute w-36 left-px-100 top-px10 z-mid-overlay"
                          >
                            <li
                              v-for="option in rowOptions"
                              :key="option.value"
                              class="p-1 rounded-px5 hover:bg-whitemist-default text-left"
                              @click.stop="
                                () => onClickOfOption(option.value, index)
                              "
                            >
                              <button>
                                {{ option.label }}
                              </button>
                            </li>
                          </ul>
                        </template>
                      </PopperJs>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div v-else class="h-40 flex flex-col">
                <table
                  class="table-fixed text-white_solid-default block overflow-x-auto border-collapse w-full"
                >
                  <thead class="border-b-px1 border-b-system-black_shadow">
                    <tr class="text-system-grey text-xs">
                      <th class="w-25% p-px15 text-left text-px12 font-normal">
                        Contract Name
                      </th>
                      <th class="w-25% p-px15 text-left text-px12 font-normal">
                        Functions Enabled
                      </th>
                      <th class="w-40% p-px15 text-left text-px12 font-normal">
                        Date Added
                      </th>
                      <th
                        class="w-5% p-px15 text-left text-px12 font-normal"
                      ></th>
                    </tr>
                  </thead>
                </table>
                <div class="flex-1 flex justify-center items-center">
                  <p class="text-system-grey">
                    Begin by adding a Contract for which you'd like to Sponsor
                    the Gas Fees
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="space-x-2.5 flex justify-end">
            <button
              class="border-px1.5 w-px100 p-2 rounded-3xl hover:text-fairy_dust-default bg-firefly-default"
              @click.stop="emits('cancel')"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </VOverlay>
</template>
