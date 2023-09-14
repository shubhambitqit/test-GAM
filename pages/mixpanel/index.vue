<template>
  <div class="cards-container">
    <div class="bg-white px-6 py-6 shadow sm:rounded-lg sm:px-6 width-45">
      <div class="card">
        <div class="card-title">
          <h3 class="font-semibold">App Settings</h3>
        </div>
        <hr class="my-4"/>
        <div class="card-content">
          <div class="row">
            <div class="icon-title">
              <i v-if="!isMixPanelSaved" class="fa-solid fa-lg fa-circle-xmark notVerifiedIcon"></i>
              <i v-else class="fa-solid fa-lg fa-circle-check verifiedIcon"></i>
              <span class="small-text font-medium text-gray-700">Mixpanel Settings</span>
            </div>
          </div>
          <hr class="my-4"/>
          <div class="row">
            <div class="icon-title">
              <i class="fa-solid fa-lg fa-circle-check verifiedIcon"></i>
              <span class="small-text font-medium text-gray-700">Connector</span>
            </div>
          </div>
          <hr class="my-4"/>
          <div class="row">
            <div class="icon-title">
              <i class="fa-solid fa-lg fa-circle-check verifiedIcon"></i>
              <span class="small-text font-medium text-gray-700">Shopify Access</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-white px-6 py-6 shadow sm:rounded-lg sm:px-6 width-45">
      <div class="card">
        <div class="card-title font-semibold mb-2">
          Mixpanel Details
        </div>
        <div class="rounded-md bg-blue-50 px-2 mb-2 py-2">
          <div class="flex">
          <div class="flex-shrink-0 mr-2">
            <InformationCircleIcon class="h-5 w-5 text-blue-400" aria-hidden="true" />
          </div>
          <a :href="accessUrl" class="small-text font-normal hover:text-blue-600 text-blue-700">How to get your mixpanel project settings and create a service account.</a>
          </div>
        </div>
        <div class="card-content">
          <form @submit.prevent="submitForm" class="form" role="form">
            <div class="form-group">
              <label for="projectId" class="block font-medium small-text leading-6 text-gray-700">Project ID</label>
              <div class="mt-2">
                <input type="text" name="projectId" id="projectId" v-model="formData.project_id"
                       class="form-control block w-full rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"/>
              </div>
            </div>
            <div class="form-group">
              <label for="region" class="mt-3 font-medium block small-text leading-6 text-gray-700">Data
                Residency</label>
              <div class="mt-2">
                <div class="w-full">
                  <Listbox v-model="formData.region">
                    <div class="relative mt-1">
                      <ListboxButton
                          class="relative w-full cursor-default text-left rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                      >
                        <span class="block truncate">{{ selectedRegion }}</span>
                        <span
                            class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
                        >
            <ChevronUpDownIcon
                class="h-5 w-5 text-gray-400"
                aria-hidden="true"
            />
          </span>
                      </ListboxButton>

                      <transition
                          leave-active-class="transition duration-100 ease-in"
                          leave-from-class="opacity-100"
                          leave-to-class="opacity-0"
                      >
                        <ListboxOptions
                            class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                        >
                          <ListboxOption
                              v-slot="{ active, selected }"
                              v-for="region in regions"
                              :key="region.name"
                              :value="region.name"
                              as="template"
                              @click="updateRegionTitle(region.name)"
                          >
                            <li
                                :class="[
                  active ? 'bg-gray-100 text-black-900' : 'text-gray-900',
                  'relative cursor-default select-none py-2 pl-10 pr-4',
                ]"
                            >
                <span
                    :class="[
                    selected ? 'font-medium' : 'font-normal',
                    'block truncate',
                  ]"
                >{{ region.name }}</span
                >
                              <span
                                  v-if="selected"
                                  class="absolute inset-y-0 left-0 flex items-center pl-3 text-green-600"
                              >
                  <CheckIcon class="h-5 w-5" aria-hidden="true"/>
                </span>
                            </li>
                          </ListboxOption>
                        </ListboxOptions>
                      </transition>
                    </div>
                  </Listbox>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label for="token" class="mt-3 font-medium block small-text leading-6 text-gray-700">Project Token</label>
              <div class="mt-2">
                <input type="text" required name="token" id="token" v-model="formData.token"
                       class="form-control block w-full rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"/>
              </div>
            </div>
            <div class="form-group">
              <label for="username" class="mt-3 font-medium block small-text leading-6 text-gray-700">Service Account
                User Name</label>
              <div class="mt-2">
                <input type="text" required name="username" id="username" v-model="formData.username"
                       class="form-control block w-full rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"/>
              </div>
            </div>
            <div class="form-group">
              <label for="secret" class="mt-3 font-medium block small-text leading-6 text-gray-700">Service Account
                Secret</label>
              <div class="mt-2">
                <input type="text" required name="secret" id="secret" v-model="formData.secret"
                       class="form-control block w-full rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"/>
              </div>
            </div>
            <button type="submit"
                    class="mt-5 rounded w-full bg-green-600 px-1 py-2 small-text font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
              <i v-if="isLoading" class="fa-solid fa-cog fa-spin mr-1"></i>
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
  <transition class="alert-component" name="fade" mode="out-in">
    <alert v-if="isSubmitted" :variant="'success'"
           :title="'data inserted successfully'"></alert>
  </transition>
</template>

<script setup lang="ts">
import {MixpanelConfig} from "~/server/config/mixpanel";
import {CheckIcon, ChevronUpDownIcon, InformationCircleIcon} from "@heroicons/vue/20/solid";
import {Listbox, ListboxButton, ListboxOption, ListboxOptions} from "@headlessui/vue";

let isSubmitted = ref<boolean>(false);
let isLoading = ref<boolean>(false);
let isMixPanelSaved = ref<boolean>(false);
let accessUrl = ref<string>("https://app.tango.us/app/workflow/How-to-access-your-Mixpanel-Project-settings-and-create-a-service-account-4aacead446654a78a4b49af4972f3aa4")

const regions = [
  {name: 'EU'},
  {name: 'US'}
]

const selectedRegion = ref<string>("Select Region")

const updateRegionTitle = async (region: string) => {
  selectedRegion.value = region
}

const formData = ref<MixpanelConfig>({
  project_id: "",
  region: "",
  secret: "",
  token: "",
  username: "",
});

onMounted(async () => {
  const client = await $fetch("/api/client", {
    method: "get",
  });

  if (client?.mixpanel) {
    formData.value = client?.mixpanel;
    isMixPanelSaved.value = true
  }
});

const submitForm = async () => {
  isLoading.value = true;

  const response = await $fetch("/api/mixpanel", {
    method: "post",
    body: {
      data: formData?.value,
    },
  });
  if (response) {
    isLoading.value = false;
    isSubmitted.value = true;
    isMixPanelSaved.value = true
  }
};
</script>


<style scoped>
@media (max-width: 1045px) {
  .cards-container {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    gap: 20px;
  }
}

@media (max-width: 391px) {
  .cards-container {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    gap: 20px;
    align-content: center;
  }

  .small-text {
    font-size: 14px;
  }
}

.icon-title {
  display: flex;
  align-items: center;
  gap: 25px;
}

.alert-component {
  position: fixed;
  top: 10px;
  right: 500px;
}

.small-text {
  font-size: 14px; /* Adjust the font size as needed */
}

.cards-container {
  display: flex;
  justify-content: space-between; /* Spacing between cards */
  padding: 50px 360px; /* Add negative margin to offset the padding on individual cards */
  align-content: center;
}

.card {
  flex: 1; /* Allow cards to grow to fill available space */
  padding: 10px; /* Apply padding to individual cards */
}

.verifiedIcon {
  color: #11b689;
}

.notVerifiedIcon {
  color: #d9534f;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 2s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */
{
  opacity: 0;
}

.width-45 {
  width: 45%;
}
</style>
