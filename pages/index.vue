<template></template>

<script setup lang="ts">
onMounted(async () => {
  const url = await getReqUrl(window.location.search);
  await logEnv();
  navigateTo(url, {external: true});
});

const getReqUrl = async (currentURL) => {
  // Create a new URLSearchParams object from the current query parameters
  const queryParams = new URLSearchParams(currentURL);

  if (!currentURL.includes('embedded')) {
    // Convert URLSearchParams to a plain JavaScript object
    const queryParamsObject = {};

    queryParams.forEach((value, key) => {
      localStorage.setItem(key, value);
      queryParamsObject[key] = value;
    });
  }

  return `api/signIn?${queryParams}`;
};


const logEnv = async () => {
  const config = useRuntimeConfig();

  console.log(`ClientId:`, config.clientId)
  console.log(`ClientSecret:`, config.clientSecret)
  console.log(`ClientIdpublic:`, config.public.clientId)
  console.log(`firebase:`, config.firebaseSecret)
  console.log(`fivetran:`, config.fivetranKey)
  console.log(`fietransecret:`, config.fivetranSecret)
  console.log(`base Url:`, config.public.baseUrl)


}
</script>
