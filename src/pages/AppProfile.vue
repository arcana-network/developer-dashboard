<template>
  <div>
    <app-header />
    <main class="container">
      <h1 class="heading">PROFILE DETAILS</h1>
      <section class="personal-details">
        <div
          class="flex"
          style="justify-content: space-between; margin-right: 1.5em"
        >
          <h2>PERSONAL DETAILS</h2>
          <v-button
            variant="link"
            label="Edit"
            :disabled="true"
            style="visibility: hidden"
          />
        </div>
        <v-card
          variant="elevated"
          class="flex sm-column flex-wrap"
          style="
            gap: 1em;
            margin-top: 1em;
            padding: 1.5em;
            justify-content: space-between;
          "
        >
          <div class="flex column details">
            <span class="body-2">Name</span>
            <span class="sub-heading-3 overflow-ellipsis" :title="name">
              {{ name }}
            </span>
          </div>
          <div class="flex column details">
            <span class="body-2">Public Identifier</span>
            <span class="sub-heading-3 overflow-ellipsis" :title="email">
              {{ email }}
            </span>
          </div>
          <div class="flex column details" style="visibility: hidden">
            <!-- <span class="body-2">Password</span>
            <span class="sub-heading-3" v-if="!editPersonalDetails"> </span> -->
            <!-- <v-text-field
              type="password"
              v-else
              v-model="password"
              no-message
            /> -->
          </div>
        </v-card>
      </section>
      <section style="margin-top: 3em">
        <div
          class="flex"
          style="justify-content: space-between; margin-right: 1.5em"
        >
          <h2>ORGANISATION DETAILS</h2>
          <v-button
            variant="link"
            label="Edit"
            :disabled="false"
            @click="editOrganisationDetails = true"
            v-if="!editOrganisationDetails"
          />
          <div v-else class="flex" style="gap: 1.5em">
            <v-button
              variant="link"
              label="Cancel"
              :disabled="false"
              @click="resetOrganisationDetails"
              style="color: #8d8d8d"
            />
            <v-button
              variant="link"
              label="Save"
              :disabled="false"
              @click="onUpdateOrganization"
            />
          </div>
        </div>
        <v-card
          variant="elevated"
          class="flex sm-column flex-wrap"
          style="
            gap: 1em;
            margin-top: 1em;
            padding: 1.5em;
            justify-content: space-between;
          "
        >
          <div class="flex column flex-grow">
            <div class="flex flex-wrap justify-space-between">
              <div class="flex column details">
                <span class="body-2">Organisation Name</span>
                <span
                  class="sub-heading-3 overflow-ellipsis"
                  :title="organisationDetails.name"
                  v-if="!editOrganisationDetails"
                >
                  {{ organisationDetails.name }}
                </span>
                <v-text-field v-else v-model="organisationDetails.name" />
              </div>
              <div class="flex column details">
                <span class="body-2">Organization Size</span>
                <span
                  class="body-3"
                  style="text-transform: uppercase; letter-spacing: 0.1em"
                  v-if="organisationDetails.sizeErrorMessage"
                >
                  {{ organisationDetails.sizeErrorMessage }}
                </span>
                <span
                  class="sub-heading-3 overflow-ellipsis"
                  :title="organisationDetails.size"
                  v-if="!editOrganisationDetails"
                >
                  {{ organisationDetails.size }}
                </span>
                <v-text-field
                  type="number"
                  min="1"
                  step="1"
                  v-else
                  v-model="organisationDetails.size"
                />
              </div>
              <div class="flex column details">
                <span class="body-2">Country</span>
                <span
                  class="sub-heading-3 overflow-ellipsis"
                  :title="organisationDetails.country"
                  v-if="!editOrganisationDetails"
                >
                  {{ organisationDetails.country }}
                </span>
                <v-text-field v-else v-model="organisationDetails.country" />
              </div>
            </div>
          </div>
        </v-card>
      </section>
      <section style="margin-top: 3em" v-if="false">
        <div class="flex" style="justify-content: space-between">
          <h2>PAYMENT DETAILS</h2>
        </div>
        <v-card
          variant="elevated"
          class="flex sm-column flex-wrap"
          style="
            gap: 1em;
            margin-top: 1em;
            padding: 1.5em;
            justify-content: space-between;
          "
        >
          <div class="flex column details">
            <span class="body-2">Billing Name</span>
            <span class="sub-heading-3">John Doe</span>
          </div>
          <div class="flex column details">
            <span class="body-2">Billing Address</span>
            <span class="sub-heading-3">
              #101, Indiranagar, Bengaluru-68, Karnataka, India
            </span>
          </div>
          <div class="flex column details">
            <span class="body-2" style="margin-bottom: 5px">
              Tax Identification
            </span>
            <span class="sub-heading-3"> Ethereum </span>
          </div>
        </v-card>
      </section>
      <div
        class="flex"
        style="justify-content: flex-end; margin-top: 2em; margin-bottom: 2em"
      >
        <v-button
          variant="secondary"
          label="LOGOUT"
          v-wave="{ color: 'rgb(40, 198, 250)' }"
          @click.stop="onLogout"
        />
      </div>
    </main>
  </div>
</template>

<style scoped>
.details {
  gap: 1em;
  width: 280px;
  margin-top: 1em;
}
.heading {
  margin-top: 1.2em;
}
.personal-details {
  margin-top: 4em;
}

.overflow-ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

@media only screen and (max-width: 1023px) {
  .heading {
    margin-top: 0.9em;
    font-size: 1.8em;
  }
  .personal-details {
    margin-top: 2em;
  }
}
</style>

<script>
import { ref } from "@vue/reactivity";
import AppHeader from "@/components/AppHeader.vue";
import VButton from "@/components/lib/VButton/VButton.vue";
import VCard from "@/components/lib/VCard/VCard.vue";
import VTextField from "@/components/lib/VTextField/VTextField.vue";
import { useRouter } from "vue-router";
import { onBeforeMount } from "@vue/runtime-core";
import { fetchProfile, updateOrganization } from "../services/profile.service";
import { useStore } from "vuex";
import useArcanaAuth from "@/use/arcanaAuth";

export default {
  components: { AppHeader, VButton, VCard, VTextField },
  setup() {
    const store = useStore();
    const { logout } = useArcanaAuth();

    const editPersonalDetails = ref(false);
    const editOrganisationDetails = ref(false);
    const password = ref("");
    const organisationDetails = ref({
      name: " ",
      size: 0,
      sizeErrorMessage: null,
      country: " ",
    });
    const name = ref("");
    name.value = store.getters.userInfo.name;
    const email = ref("");
    email.value = store.getters.userInfo.email;
    const router = useRouter();

    let organisationDetailsResetState = {};

    function onUpdateOrganization() {
      // Validation
      const size = Number(organisationDetails.value.size);
      if (!Number.isFinite(size) || !Number.isSafeInteger(size) || size <= 0) {
        organisationDetails.value.sizeErrorMessage =
          "Invalid organization size.";
        return;
      }
      organisationDetails.value.sizeErrorMessage = null;

      // API Call
      try {
        updateOrganization({
          name: organisationDetails.value.name,
          size,
          country: organisationDetails.value.country,
        }).then((response) => {
          editOrganisationDetails.value = false;
          organisationDetailsResetState = { ...organisationDetails.value };
        });
      } catch (e) {
        console.error(e);
      }
    }

    onBeforeMount(() => {
      fetchProfile().then((response) => {
        organisationDetails.value = {
          name: response.data.organization.name,
          size: response.data.organization.size,
          country: response.data.organization.country,
        };
        organisationDetailsResetState = { ...organisationDetails.value };
      });
    });

    function onLogout() {
      logout();
      localStorage.clear();
      store.dispatch("test/resetConfigStore");
      store.dispatch("live/resetConfigStore");
      store.dispatch("resetAuth");
      store.dispatch("resetStore");
      router.push({ name: "Login" });
    }

    function resetOrganisationDetails() {
      editOrganisationDetails.value = false;
      organisationDetails.value = { ...organisationDetailsResetState };

      if (organisationDetails.value.sizeErrorMessage) {
        organisationDetails.value.sizeErrorMessage = null;
      }
    }

    return {
      editPersonalDetails,
      editOrganisationDetails,
      organisationDetails,
      password,
      onLogout,
      onUpdateOrganization,
      resetOrganisationDetails,
      name,
      email,
    };
  },
};
</script>
