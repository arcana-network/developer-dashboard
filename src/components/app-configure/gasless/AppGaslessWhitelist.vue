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
        class="flex justify-center items-center m-auto h-[330px] w-[630px] border-[1px] border-[#363636] bg-white rounded-lg"
      >
        {{ loader.message }}
      </div>
      <div
        v-else
        class="flex flex-column justify-center border-[1px] border-[#363636] rounded-lg min-h-[330px] max-h-[430px] w-[630px] text-black p-4 bg-white m-auto overflow-hidden"
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
              class="border-[1.5px] border-[#F7F7F7] w-[100px] p-2 rounded-md"
              @click="hideDeleteConfirm"
            >
              Cancel
            </button>
            <button
              class="border-[1.5px] border-[#F7F7F7] bg-white text-black w-[100px] p-2 rounded-md"
              @click.stop="deleteHandler(showConfirmDelete.index)"
            >
              Delete
            </button>
          </div>
        </div>
        <div v-else class="space-y-5">
          <div class="space-y-[10px]">
            <p class="text-sm">Whitelist Smart Contracts</p>
            <p class="text-sm text-liquiddark leading-4">
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
              class="rounded-md border-[1px] border-liquidgrey w-full overflow-auto"
            >
              <table
                v-if="whitelists.length"
                class="table-fixed text-black block overflow-x-auto border-collapse w-full"
              >
                <thead class="border-b-[1px] border-b-liquidgrey">
                  <tr class="text-liquiddark text-xs">
                    <th class="w-[25%]">Contract Name</th>
                    <th class="w-[25%]">Functions Enabled</th>
                    <th class="w-[40%]">Date Added</th>
                    <th class="w-[5%]"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(list, index) in whitelists"
                    :key="list.name"
                    class="hover:bg-liquidlight"
                  >
                    <td>{{ list.name }}</td>
                    <td>{{ list.whitelisted_methods }}</td>
                    <td>
                      {{
                        moment(list.created_at).format('MMM D YYYY, H:mm:ss')
                      }}
                    </td>
                    <td>
                      <PopperJs placement="left-start" :arrow="true">
                        <button
                          class="flex justify-center items-center cursor-pointer w-7 h-7 bg-[#262626] rounded-[5px]"
                        >
                          <img :src="MoreIcon" alt="more" />
                        </button>
                        <template #content>
                          <ul
                            ref="showRowOptions_menu"
                            class="flex flex-col bg-white text-black rounded-md border-[1px] p-2 space-y-1 absolute w-36 left-[-100px] top-[10px] z-[999]"
                          >
                            <li
                              v-for="option in rowOptions"
                              :key="option.value"
                              class="p-1 rounded-[5px] hover:bg-liquidlight text-left"
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
                  class="table-fixed text-white block overflow-x-auto border-collapse w-full"
                >
                  <thead class="border-b-[1px] border-b-[#363636]">
                    <tr class="text-liquiddark text-xs">
                      <th class="w-[25%]">Contract Name</th>
                      <th class="w-[25%]">Functions Enabled</th>
                      <th class="w-[40%]">Date Added</th>
                      <th class="w-[5%]"></th>
                    </tr>
                  </thead>
                </table>
                <div class="flex-1 flex justify-center items-center">
                  <p class="text-liquiddark">
                    Begin by adding a Contract for which you'd like to Sponsor
                    the Gas Fees
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="space-x-2.5 flex justify-end">
            <button
              class="border-[1.5px] w-[100px] p-2 rounded-3xl hover:text-pink bg-liquid"
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

<style scoped>
th,
td {
  padding: 15px;
  text-align: left;
}

th {
  font-size: 12px;
  font-weight: 400;
}

td {
  font-size: 14px;
  font-weight: 500;
  text-overflow: ellipsis;
}
</style>
