<script lang="ts" setup>
import moment from 'moment'
import { ref, computed, type Ref } from 'vue'

import CreateOrEditDelegate from '@/components/app-configure/access/CreateOrEditDelegate.vue'
import DeleteDelegatePopup from '@/components/app-configure/access/DeleteDelegatePopup.vue'
import SettingCard from '@/components/app-configure/SettingCard.vue'
import VCard from '@/components/lib/VCard/VCard.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import { useToast } from '@/components/lib/VToast'
import { deleteDelegate, listDelegateKeys } from '@/services/gateway.service'
import { revokeDelegate } from '@/services/smart-contract.service'
import {
  useAppsStore,
  type Delegate,
  type DelegateKey,
} from '@/stores/apps.store'
import type { DelegateOperation } from '@/stores/apps.store'
import { useLoaderStore } from '@/stores/loader.store'
import { useAppId } from '@/use/getAppId'
import copyToClipboard from '@/utils/copyToClipboard'
import { truncate } from '@/utils/stringUtils'

const appId = useAppId()
const appsStore = useAppsStore()
const loaderStore = useLoaderStore()
const toast = useToast()

const app = appsStore.app(appId)
const delegates = computed(() => {
  return appsStore.app(appId).access.delegates
})

const delegateKeys: Ref<DelegateKey[]> = ref([])
const showDelegatePopup = ref(false)
const showDeletePopup = ref(false)
const selectedDelegate: Ref<Delegate | null> = ref(null)
let currentSelectedOperation: Ref<DelegateOperation> = ref('edit')

async function getDelegateKeys() {
  try {
    loaderStore.showLoader('Fetching keys...')
    const { data } = await listDelegateKeys(app.address)
    delegateKeys.value = data || []
  } catch (err) {
    console.error({ err })
  } finally {
    loaderStore.hideLoader()
  }
}

async function handleDelegatePopup(op: DelegateOperation, delegate?: Delegate) {
  currentSelectedOperation.value = op
  await getDelegateKeys()
  if (delegate) {
    selectedDelegate.value = delegate
  }
  showDelegatePopup.value = true
}

async function handleSuccess() {
  if (selectedDelegate.value) {
    selectedDelegate.value = null
  }
  showDelegatePopup.value = false
}

function handleDeleteClick(delegate: Delegate) {
  showDeletePopup.value = true
  selectedDelegate.value = delegate
}

async function handleDeleteDelegate(delegate: Delegate) {
  try {
    showDeletePopup.value = false
    loaderStore.showLoader('Revoking delegator access in smart contract...')
    await revokeDelegate(appId, delegate.address)
    loaderStore.showLoader('Deleting the delegate...')
    await deleteDelegate(delegate.id)
    const app = appsStore.app(appId)
    const updatedDelegates = app.access.delegates.filter(
      (d) => d.id !== delegate.id
    )
    app.access.delegates = updatedDelegates
    selectedDelegate.value = null
    toast.success('Delegate deleted')
  } catch (e) {
    console.error(e)
    toast.error('Error occurred while deleting delegate')
  } finally {
    loaderStore.hideLoader()
  }
}

async function copyAddress(address: string) {
  try {
    await copyToClipboard(address)
    toast.success('Delegate address copied')
  } catch (e) {
    console.error(e)
    toast.error('Failed to copy. Try again or contact support')
  }
}
</script>

<template>
  <section name="did-delegate">
    <SettingCard>
      <template #title>Delegates</template>
      <template #controls>
        <img
          src="@/assets/iconography/plus.svg"
          class="cursor-pointer control-icons"
          @click.stop="handleDelegatePopup('create')"
        />
      </template>
      <template #description>
        <VStack
          gap="2rem"
          justify="space-between"
          sm-direction="column"
          md-direction="column"
        >
          <div class="description">
            Delegations can be used to have assigned delegate servers manage the
            DIDs on behalf of the users. Manage the delegates that you have
            assigned the ability to perform actions on behalf of your users.
          </div>
          <VStack gap="2rem">
            <a href="#">
              <VStack
                direction="column"
                sm-direction="row"
                md-direction="row"
                gap="0.5rem"
                align="center"
              >
                <img
                  src="@/assets/iconography/view-docs.svg"
                  class="help-action-icons"
                />
                <span class="help-title">View Docs</span>
              </VStack>
            </a>
            <a href="#">
              <VStack
                direction="column"
                sm-direction="row"
                md-direction="row"
                gap="0.5rem"
                align="center"
              >
                <img
                  src="@/assets/iconography/play-video.svg"
                  class="help-action-icons"
                />
                <span class="help-title">View Guide</span>
              </VStack>
            </a>
          </VStack>
        </VStack>
      </template>
      <VCard variant="depressed" class="delegates-card">
        <div class="table-container">
          <div v-if="delegates.length !== 0" class="table">
            <div class="table-grid table-header">
              <div class="text-ellipsis">NAME</div>
              <div class="text-ellipsis">ADDRESS</div>
              <div class="text-ellipsis">PERMISSIONS GRANTED</div>
              <div class="text-ellipsis">DELEGATION DATE</div>
            </div>
            <hr class="separator" />
            <div
              v-for="delegate in delegates"
              :key="delegate.address"
              class="table-grid table-body"
            >
              <VStack direction="column" gap="0.25rem" class="delegate-name">
                <div class="text-ellipsis laptop-remove delegate-header">
                  NAME
                </div>
                <div class="text-ellipsis" :title="delegate.name">
                  {{ delegate.name }}
                </div>
              </VStack>
              <VStack direction="column" gap="0.25rem" class="delegate-address">
                <div class="text-ellipsis laptop-remove delegate-header">
                  ADDRESS
                </div>
                <VStack gap="0.5rem">
                  <div
                    class="text-ellipsis tablet-remove mobile-remove"
                    :title="delegate.address"
                  >
                    {{ truncate(delegate.address, 5) }}
                  </div>
                  <div
                    class="text-ellipsis laptop-remove"
                    :title="delegate.address"
                  >
                    {{ truncate(delegate.address, 8) }}
                  </div>
                  <div class="actions">
                    <img
                      src="@/assets/iconography/copy.svg"
                      class="cursor-pointer"
                      title="Copy"
                      @click.stop="copyAddress(delegate.address)"
                    />
                  </div>
                </VStack>
              </VStack>
              <VStack
                direction="column"
                gap="0.25rem"
                class="delegate-permissions"
              >
                <div class="text-ellipsis laptop-remove delegate-header">
                  PERMISSIONS GRANTED
                </div>
                <VStack gap="5px" wrap>
                  <div
                    v-for="permission in delegate.permissions"
                    :key="`${delegate.address}${permission}`"
                    class="chip"
                  >
                    {{ permission }}
                  </div>
                </VStack>
              </VStack>
              <VStack direction="column" gap="0.25rem" class="delegate-date">
                <div class="text-ellipsis laptop-remove delegate-header">
                  DELEGATION DATE
                </div>
                <div class="text-ellipsis">
                  {{
                    moment(delegate.createdDate)
                      .format('DD MMM YYYY')
                      .toUpperCase()
                  }}
                </div>
              </VStack>
              <VStack
                direction="column"
                gap="0.25rem"
                class="delegate-controls"
              >
                <VStack class="actions" gap="1rem">
                  <img
                    src="@/assets/iconography/delete-icon.svg"
                    class="cursor-pointer"
                    title="Delete"
                    @click.stop="handleDeleteClick(delegate)"
                  />
                  <img
                    src="@/assets/iconography/edit-icon.svg"
                    class="cursor-pointer"
                    title="Edit"
                    @click.stop="handleDelegatePopup('edit', delegate)"
                  />
                </VStack>
              </VStack>
            </div>
          </div>
          <h4 v-else class="no-results">No records found</h4>
        </div>
      </VCard>
    </SettingCard>
    <CreateOrEditDelegate
      v-if="showDelegatePopup"
      :variant="currentSelectedOperation"
      :delegate-keys="delegateKeys"
      :delegate-info="(selectedDelegate as Delegate)"
      @close="showDelegatePopup = false"
      @success="handleSuccess"
    />
    <DeleteDelegatePopup
      v-if="showDeletePopup"
      :delegate="(selectedDelegate as Delegate)"
      @close="showDeletePopup = false"
      @delete="handleDeleteDelegate(selectedDelegate as Delegate)"
    />
  </section>
</template>

<style scoped>
.control-icons {
  height: 1.125rem;
}

.description {
  max-width: 40rem;
}

.help-action-icons {
  height: 3.5rem;
}

.help-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--primary);
  text-transform: uppercase;
}

.table-container {
  flex-grow: 1;
  padding: 1.25rem 5px;
  color: var(--text-grey);
}

.table-grid {
  display: grid;
  grid-template-columns:
    20% 20% 25% 25%
    4rem;
  gap: 0.5rem;
}

.table-header {
  padding-inline: 1.25rem;
}

.table-header,
.delegate-header {
  font-weight: 700;
  color: var(--text-grey);
}

.table-body {
  padding: 0.625rem 1.25rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: var(--text-white);
  border-radius: 10px;
}

.table-body:hover {
  background: #262626;
  box-shadow: 4px 5px 4px rgb(0 0 0 / 25%);
}

.no-results {
  padding: 2rem;
  color: var(--text-grey);
  text-align: center;
}

.chip {
  padding: 5px 10px;
  font-size: 0.625rem;
  font-weight: 500;
  background-color: #333;
  border-radius: 16px;
}

.separator {
  margin: 1.25rem 0;
  border: none;
  border-top: 1px solid rgb(141 141 141 / 20%);
}

.actions {
  opacity: 0;
}

.table-body:hover .actions {
  opacity: 1;
}

.actions img {
  width: 1.5rem;
}

@media only screen and (max-width: 1024px) {
  .delegate-name {
    grid-area: name;
  }

  .delegate-address {
    grid-area: address;
  }

  .delegate-controls {
    grid-area: controls;
  }

  .delegate-date {
    grid-area: date;
  }

  .delegate-permissions {
    grid-area: permissions;
  }

  .separator,
  .table-header {
    display: none;
  }

  .table-container {
    padding: 0;
  }

  .delegates-card {
    background: none !important;
    box-shadow: none !important;
  }

  .delegate-header {
    font-size: 0.625rem;
  }

  .table-grid {
    grid-template-areas:
      'name name controls'
      'address address address'
      'date permissions permissions';
    grid-template-columns: 1fr 1fr max-content;
    grid-row-gap: 1rem;
  }

  .table {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .actions {
    opacity: 1;
  }

  .table-body,
  .table-body:hover,
  .no-results {
    padding: 1rem;
    background: linear-gradient(141.48deg, #161616 -4.56%, #151515 135.63%);
    border-radius: 10px;
    box-shadow: inset 5px 5px 10px rgb(11 11 11 / 50%);
  }

  a:has(.help-title) {
    text-decoration: none;
    vertical-align: middle;
  }

  .help-action-icons {
    height: 2rem;
  }

  .help-title {
    margin-top: 2px;
  }
}
</style>
