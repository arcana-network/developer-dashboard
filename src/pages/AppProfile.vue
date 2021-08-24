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
          <v-button variant="link" label="Edit" :disabled="true" />
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
            <span class="sub-heading-3">John Doe</span>
          </div>
          <div class="flex column details">
            <span class="body-2">Email</span>
            <span class="sub-heading-3">johndoe@gmail.com</span>
          </div>
          <div class="flex column details">
            <span class="body-2" style="margin-bottom: 5px">Password</span>
            <span class="sub-heading-3" v-if="!editPersonalDetails"> </span>
            <v-text-field
              type="password"
              v-else
              v-model="password"
              no-message
            />
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
              @click="editOrganisationDetails = false"
              style="color: #8d8d8d"
            />
            <v-button
              variant="link"
              label="Save"
              :disabled="false"
              @click="editOrganisationDetails = false"
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
          <div class="flex column" style="flex-grow: 1">
            <div class="flex flex-wrap" style="justify-content: space-between">
              <div class="flex column details">
                <span class="body-2">Organisation Name</span>
                <span class="sub-heading-3" v-if="!editOrganisationDetails">
                  {{ organisationDetails.name }}
                </span>
                <v-text-field v-else v-model="organisationDetails.name" />
              </div>
              <div class="flex column details">
                <span class="body-2">Size</span>
                <span class="sub-heading-3" v-if="!editOrganisationDetails">
                  {{ organisationDetails.size }}
                </span>
                <v-text-field
                  type="number"
                  v-else
                  v-model="organisationDetails.size"
                />
              </div>
              <div
                class="flex column mobile-remove"
                style="width: 280px; visibility: hidden"
              ></div>
            </div>
            <div class="flex flex-wrap" style="justify-content: space-between">
              <div class="flex column details">
                <span class="body-2">Country</span>
                <span class="sub-heading-3" v-if="!editOrganisationDetails">
                  {{ organisationDetails.country }}
                </span>
                <v-text-field v-else v-model="organisationDetails.country" />
              </div>
              <div class="flex column details">
                <span class="body-2">Region</span>
                <span class="sub-heading-3" v-if="!editOrganisationDetails">
                  {{ organisationDetails.region }}
                </span>
                <v-text-field v-else v-model="organisationDetails.region" />
              </div>
              <div
                class="flex column mobile-remove"
                style="width: 280px; visibility: hidden"
              ></div>
            </div>
          </div>
        </v-card>
      </section>
      <section style="margin-top: 3em">
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
import AppHeader from "../components/AppHeader.vue";
import VButton from "../components/lib/VButton/VButton.vue";
import VCard from "../components/lib/VCard/VCard.vue";
import VTextField from "../components/lib/VTextField/VTextField.vue";
import { useRouter } from "vue-router";
export default {
  components: { AppHeader, VButton, VCard, VTextField },
  setup() {
    const editPersonalDetails = ref(false);
    const editOrganisationDetails = ref(false);
    const password = ref("");
    const organisationDetails = ref({
      name: "John Doe",
      size: 5,
      country: "India",
      region: "Asia Pacific",
    });
    const router = useRouter();

    function onLogout() {
      router.push("/signin");
    }

    return {
      editPersonalDetails,
      editOrganisationDetails,
      organisationDetails,
      password,
      onLogout,
    };
  },
};
</script>