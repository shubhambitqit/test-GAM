//** The plugin intercepts the request for fetch and redirect the user to the  login page if required  */
import { ofetch } from "ofetch";
import { useBridge } from "~/composables/useBridge";

export default defineNuxtPlugin(async (_nuxtApp) => {
  globalThis.$fetch = ofetch.create({
    async onRequest({ options }) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${await useBridge().getToken()}`,
      };
    },
  });
});
