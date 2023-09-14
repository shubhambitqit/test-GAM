// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    app: {
        head: {
            link: [
                {
                    rel: "stylesheet",
                    href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css"
                }
            ]
        }
    },
    css: ['~/assets/css/main.css'],
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    runtimeConfig: {
        public: {
            baseUrl: "",
            clientId: "1152d530e742190acd19bd74563932aa",
        },
        clientId: "",
        clientSecret: "",
        collectionName: "shopify_customers",
        connectorCollectionName: "connectors",
        appName: "",
        gcpCert: "",
        fivetranKey: "",
        fivetranSecret: "",
        fivetranGroupId: "",
        firebaseSecret: ""
    },
    plugins: [
        {
            src: "~/plugins/fetch.client.ts",
            mode: "client",
        },
    ],
    devtools: {enabled: true},
});
