<template>
  <v-card
    style="margin-top: 2em; padding: 1.5em 2em; gap: 1.2em; margin-bottom: 2em"
    class="column"
    :id="'configure-step-' + 5"
  >
    <h4 style="width: 100%; display: block">SET PER USER LIMIT</h4>
    <div class="flex sm-column" style="gap: 4vw">
      <div
        class="flex column"
        style="
          gap: 1.2em;
          align-items: flex-start;
          width: 22vw;
          min-width: 280px;
        "
      >
        <span class="body-1" style="color: var(--text-grey)">
          Your application’s limits will act as the default storage and
          bandwidth limits for each user of your application unless you choose
          to specify it for each user here.
        </span>
        <v-button variant="link" label="LEARN MORE" />
      </div>
      <div
        class="flex sm-column"
        style="gap: 3em; flex-wrap: wrap; flex-grow: 1"
      >
        <div class="flex column" style="gap: 20px">
          <div class="flex sm-column" style="justify-content: space-between">
            <h3>STORAGE</h3>
            <div
              class="flex sm-column-gap"
              style="align-items: center; gap: 1em"
            >
              <span class="body-2">Unlimited</span>
              <v-switch v-model="storageUnlimited" style="margin-top: 2px" />
            </div>
          </div>
          <div
            class="text-field flex"
            style="width: 100%; justify-content: space-between"
          >
            <input
              type="number"
              maxlength="1"
              id="storage-user-limit"
              min="0"
              pattern="[0-9]"
              v-model="storage.value"
              :disabled="storageUnlimited"
            />
            <v-dropdown
              :options="['MB', 'GB']"
              placeholder="unit"
              class="usage"
              style="min-width: 7em"
              triggerStyle="padding: 18px 20px"
              v-model="storage.unit"
              :disabled="storageUnlimited"
            />
          </div>
        </div>
        <div class="flex column" style="gap: 20px">
          <div
            class="flex sm-column sm-column-gap"
            style="justify-content: space-between"
          >
            <h3>BANDWIDTH</h3>
            <div
              class="flex sm-column-gap"
              style="align-items: center; gap: 1em"
            >
              <span class="body-2">Unlimited</span>
              <v-switch v-model="bandwidthUnlimited" style="margin-top: 2px" />
            </div>
          </div>
          <div
            class="text-field flex"
            style="width: 100%; justify-content: space-between"
          >
            <input
              type="number"
              maxlength="1"
              id="bandwidth-user-limit"
              min="0"
              pattern="[0-9]"
              v-model="bandwidth.value"
              :disabled="bandwidthUnlimited"
            />
            <v-dropdown
              :options="['MB', 'GB']"
              placeholder="unit"
              class="usage"
              style="min-width: 7em"
              triggerStyle="padding: 18px 20px"
              v-model="bandwidth.unit"
              :disabled="bandwidthUnlimited"
            />
          </div>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script>
import { computed, onMounted, watch } from "@vue/runtime-core";
import { ref } from "@vue/reactivity";
import { useStore } from "vuex";
import VButton from "@/components/lib/VButton/VButton.vue";
import VCard from "@/components/lib/VCard/VCard.vue";
import VDropdown from "@/components/lib/VDropdown/VDropdown.vue";
import VSwitch from "@/components/lib/VSwitch/VSwitch.vue";

export default {
  name: "ConfigureUserLimits",
  props: {
    isConfigured: Boolean,
  },
  components: {
    VCard,
    VDropdown,
    VSwitch,
    VButton,
  },
  setup(props) {
    const store = useStore();

    const env = computed(() => {
      return store.getters.env;
    });

    let storageUnlimited = ref(
      store.getters[env.value + "/isStorageUnlimited"]
    );
    let bandwidthUnlimited = ref(
      store.getters[env.value + "/isBandwidthUnlimited"]
    );
    let storage = ref({
      value: 2,
      unit: "MB",
    });
    let bandwidth = ref({
      value: 2,
      unit: "MB",
    });

    storage.value = { ...store.getters[env.value + "/storage"] };
    bandwidth.value = { ...store.getters[env.value + "/bandwidth"] };

    watch(
      () => env.value,
      () => {
        storage.value = { ...store.getters[env.value + "/storage"] };
        bandwidth.value = { ...store.getters[env.value + "/bandwidth"] };
      }
    );

    watch(
      () => storage.value,
      () => {
        if (storage.value.value !== "") {
          store.dispatch(env.value + "/updateStorage", {
            ...storage.value,
            isUnlimited: false,
          });
          if (props.isConfigured && !store.getters.onConfigChange) {
            store.dispatch("configChangeDetected");
          }
        }
      },
      { deep: true }
    );

    watch(
      () => bandwidth.value,
      () => {
        if (bandwidth.value.value !== "") {
          store.dispatch(env.value + "/updateBandwidth", {
            ...bandwidth.value,
            isUnlimited: false,
          });
          if (props.isConfigured && !store.getters.onConfigChange) {
            store.dispatch("configChangeDetected");
          }
        }
      },
      { deep: true }
    );

    watch(
      () => storageUnlimited.value,
      () => {
        if (storageUnlimited.value) {
          storage.value = {
            value: "",
            unit: "",
          };
          store.dispatch(env.value + "/updateStorage", {
            value: 2,
            unit: "MB",
            isUnlimited: true,
          });
        } else {
          if (!storage.value.value) {
            storage.value = {
              value: 2,
              unit: "MB",
            };
          }
          store.dispatch(env.value + "/updateStorage", {
            ...storage.value,
            isUnlimited: false,
          });
        }
        if (props.isConfigured && !store.getters.onConfigChange) {
          store.dispatch("configChangeDetected");
        }
      }
    );

    watch(
      () => bandwidthUnlimited.value,
      () => {
        if (bandwidthUnlimited.value) {
          bandwidth.value = {
            value: "",
            unit: "",
          };
          store.dispatch(env.value + "/updateBandwidth", {
            ...bandwidth.value,
            isUnlimited: true,
          });
        } else {
          if (!bandwidth.value.value) {
            bandwidth.value = {
              value: 2,
              unit: "MB",
            };
          }
          store.dispatch(env.value + "/updateBandwidth", {
            ...bandwidth.value,
            isUnlimited: false,
          });
        }
        if (props.isConfigured && !store.getters.onConfigChange) {
          store.dispatch("configChangeDetected");
        }
      }
    );

    return {
      storageUnlimited,
      bandwidthUnlimited,
      storage,
      bandwidth,
    };
  },
};
</script>

<style scoped>
div.text-field {
  background: linear-gradient(141.48deg, #1a1a1a -4.56%, #151515 135.63%);
  box-shadow: inset -2px -2px 4px rgba(57, 57, 57, 0.44),
    inset 5px 5px 10px rgba(11, 11, 11, 0.5);
  border-radius: 10px;
}

input {
  border: none;
  box-shadow: none;
  background: transparent;
  outline: none;
  --webkit-outline: none;
  color: var(--text-white);
  font-family: var(--font-body);
  font-size: 1.25em;
  line-height: 1.5em;
  margin: 0;
  padding: 15px 20px;
  width: 8em;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
.usage .custom-select__trigger {
  padding: 20px;
}
</style>
