<template>
  <v-card
    style="margin-top: 2em; padding: 1.5em 2em; gap: 1.2em; margin-bottom: 2em"
    class="column"
    id="configure-step-5"
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
        <v-button
          variant="link"
          label="LEARN MORE"
          :action="onLearnMoreClicked"
        />
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
              id="storage-user-limit"
              min="1"
              max="1024"
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
          <span class="error-message" :class="{ show: hasStorageError }">
            Value should not be less than 1 MB or more than 99 GB
          </span>
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
              id="bandwidth-user-limit"
              min="1"
              max="1024"
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
          <span class="error-message" :class="{ show: hasBandwidthError }">
            Value should not be less than 1 MB or more than 99 GB
          </span>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script>
import { computed, watch, ref } from "vue";
import { useStore } from "vuex";
import bytes from "bytes";
import VButton from "@/components/lib/VButton/VButton.vue";
import VCard from "@/components/lib/VCard/VCard.vue";
import VDropdown from "@/components/lib/VDropdown/VDropdown.vue";
import VSwitch from "@/components/lib/VSwitch/VSwitch.vue";

const MIN_BYTES = bytes("1 MB");
const MAX_BYTES = bytes("99 GB");
const EMPTY_VALUE = {
  value: "",
  unit: "",
}
const INIT_VALUE = {
  value: 2,
  unit: "MB",
}

export default {
  name: "ConfigureUserLimits",
  props: {
    isConfigured: Boolean,
  },
  components: {
    VButton,
    VCard,
    VDropdown,
    VSwitch,
  },
  setup(props, { emit }) {
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
    let storage = ref({ ...store.getters[env.value + "/storage"] });
    let bandwidth = ref({ ...store.getters[env.value + "/bandwidth"] });
    let hasStorageError = ref(false),
      hasBandwidthError = ref(false);

    function onLearnMoreClicked() {
      store.dispatch("showLearnMorePopup", {
        header: "USER LIMITS",
        description:
          "Set storage and bandwidth limits for each user. This can of course be handled by you on the application layer but you can leverage this feature to set default upload/download limits for your users and further update them, on a user level, depending on your app's requirements or business model. If there are no such limititation in your app, then you can simply set the limit to unlimited for both storage and bandwidth consumption by your users.",
      });
    }

    function emitChange() {
      let eventProps = {
        state: "default",
      };
      if (hasStorageError.value || hasBandwidthError.value) {
        eventProps = {
          state: "error",
          errors: {
            storage: hasStorageError.value,
            bandwidth: hasBandwidthError.value,
          },
        };
      }
      emit("value-change", eventProps);
    }

    function isValidByteValue({ value, unit }) {
      if (isNaN(Number(value))) {
        return false;
      }
      const actualValue = bytes(`${value}${unit}`);
      return actualValue >= MIN_BYTES && actualValue <= MAX_BYTES;
    }

    watch(
      () => storage.value,
      () => {
        if (isValidByteValue(storage.value)) {
          hasStorageError.value = false;
          store.dispatch(env.value + "/updateStorage", {
            ...storage.value,
            isUnlimited: false,
          });
          if (props.isConfigured && !store.getters.onConfigChange) {
            store.dispatch("configChangeDetected");
          }
        } else if (!storageUnlimited.value) {
          hasStorageError.value = true;
        }
        emitChange();
      },
      { deep: true }
    );

    watch(
      () => bandwidth.value,
      () => {
        if (isValidByteValue(bandwidth.value)) {
          hasBandwidthError.value = false;
          store.dispatch(env.value + "/updateBandwidth", {
            ...bandwidth.value,
            isUnlimited: false,
          });
          if (props.isConfigured && !store.getters.onConfigChange) {
            store.dispatch("configChangeDetected");
          }
        } else if (!bandwidthUnlimited.value) {
          hasBandwidthError.value = true;
        }
        emitChange();
      },
      { deep: true }
    );

    watch(
      () => storageUnlimited.value,
      () => {
        if (storageUnlimited.value) {
          storage.value = { ...EMPTY_VALUE };
          hasStorageError.value = false;
          store.dispatch(env.value + "/updateStorage", {
            ...storage.value,
            isUnlimited: true,
          });
        } else {
          if (!storage.value.value) {
            storage.value = { ...INIT_VALUE };
          }
          store.dispatch(env.value + "/updateStorage", {
            ...storage.value,
            isUnlimited: false,
          });
        }
        emitChange();
        if (props.isConfigured && !store.getters.onConfigChange) {
          store.dispatch("configChangeDetected");
        }
      }
    );

    watch(
      () => bandwidthUnlimited.value,
      () => {
        if (bandwidthUnlimited.value) {
          bandwidth.value = { ...EMPTY_VALUE };
          hasBandwidthError.value = false;
          store.dispatch(env.value + "/updateBandwidth", {
            ...bandwidth.value,
            isUnlimited: true,
          });
        } else {
          if (!bandwidth.value.value) {
            bandwidth.value = { ...INIT_VALUE };
          }
          store.dispatch(env.value + "/updateBandwidth", {
            ...bandwidth.value,
            isUnlimited: false,
          });
        }
        emitChange();
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
      hasStorageError,
      hasBandwidthError,
      onLearnMoreClicked,
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
.error-message {
  font-family: var(--font-body);
  font-weight: 400;
  visibility: hidden;
  font-size: 0.94em;
  line-height: 1.5;
  margin: 1px 20px;
  color: #ee193f;
  max-width: 18em;
}
.error-message.show {
  visibility: visible;
}
</style>
