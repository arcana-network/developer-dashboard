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

const emits = defineEmits(['edit'])

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
  const tankId = whitelists.value[listIndex]
  if (option === 0) emits('edit', tankId)
  if (option === 1) deleteHandler(listIndex)
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
    await fetchWhitelists()
  }
}
</script>

<template>
  <VOverlay>
    <div class="h-full flex overflow-y-auto py-2">
      <div
        v-if="loader.show"
        class="flex justify-center items-center m-auto h-[330px] w-[630px] border-[1px] border-[#363636] bg-[#1F1F1F] rounded-lg"
      >
        {{ loader.message }}
      </div>
      <div
        v-else
        class="flex flex-column border-[1px] border-[#363636] rounded-lg min-h-[330px] max-h-[430px] w-[630px] text-white p-4 space-y-5 bg-[#1F1F1F] m-auto overflow-hidden"
      >
        <div class="space-y-[10px]">
          <p class="text-sm">Whitelist Smart Contracts</p>
          <p class="text-sm text-[#8D8D8D] leading-4">
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
            class="rounded-md border-[1px] border-[#363636] w-full overflow-auto"
          >
            <table
              v-if="whitelists.length"
              class="table-fixed text-white block overflow-x-auto border-collapse w-full"
            >
              <thead class="border-b-[1px] border-b-[#363636]">
                <tr class="text-[#8d8d8d] text-xs">
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
                  class="hover:bg-[#363636]"
                >
                  <td>{{ list.name }}</td>
                  <td>{{ list.whitelisted_methods }}</td>
                  <td>
                    {{ moment(list.created_at).format('MMM D YYYY, H:mm:ss') }}
                  </td>
                  <td>
                    <div class="relative">
                      <button
                        class="flex justify-center items-center cursor-pointer w-7 h-7 bg-[#262626] rounded-[5px]"
                        @click.stop="showRowOptionsOf = index"
                      >
                        <img :src="MoreIcon" alt="more" />
                      </button>
                      <dialog
                        v-if="index === showRowOptionsOf"
                        ref="showRowOptions_menu"
                        open
                        class="flex flex-col bg-[#1F1F1F] text-[#FFFFFF] rounded-md border-[1px] border-[#363636] p-2 space-y-1 absolute w-36 left-[-100px] top-[10px] z-[999]"
                      >
                        <button
                          v-for="option in rowOptions"
                          :key="option.value"
                          class="p-1 rounded-[5px] hover:bg-[#363636] text-left"
                          @click.stop="
                            () => onClickOfOption(option.value, index)
                          "
                        >
                          {{ option.label }}
                        </button>
                      </dialog>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-else class="h-40 flex justify-center items-center">
              <p class="text-[#8D8D8D]">
                Begin by adding a Contract for which you'd like to Sponsor the
                Gas Fees
              </p>
            </div>
          </div>
        </div>
        <div class="space-x-2.5 flex justify-end">
          <button
            class="border-[1.5px] border-[#F7F7F7] w-[100px] p-2 rounded-md"
            @click.stop="emits('cancel')"
          >
            Cancel
          </button>
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
