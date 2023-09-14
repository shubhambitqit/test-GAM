const config = useRuntimeConfig();


export class ShopifyService {
    private readonly shopUrl: string

    constructor(shopUrl) {
        this.shopUrl = shopUrl
    }

    async registerWebhookSubscription(accessToken: string) {
        try {

            // The webhook subscription object
            const webhookSubscription = {
                webhook: {
                    address: `${config.public.baseUrl}/api/appUninstall`,
                    topic: 'app/uninstalled',
                    format: 'json'
                }
            };


            // Function to register the webhook subscription

            const response = await $fetch(`https://${this.shopUrl}/admin/api/2023-07/webhooks.json`, {
                method: 'POST',
                headers: {
                    'X-Shopify-Access-Token': accessToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(webhookSubscription)
            })
            console.log('Webhook subscription created:', response, response?.data?.webhook);
        } catch (error) {
            console.error('Error creating webhook subscription:', error.message);
            return false
        }

    }

    async getShopifyId(accessToken: string) {
        try {
            const response = await $fetch(`https://${this.shopUrl}/admin/api/2023-07/shop.json`, {
                method: 'GET',
                headers: {
                    'X-Shopify-Access-Token': accessToken
                }
            })
            return response.shop.id.toString();
        } catch (error) {
            console.error('Error getting shopifyId:', error.message);
            return false
        }

    }


    async getAccessToken(code: string) {
        try {
            const response = await $fetch(`https://${this.shopUrl}/admin/oauth/access_token`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    client_id: config.clientId,
                    client_secret: config.clientSecret,
                    code: code,
                }),
            });

            return response.access_token
        } catch (e) {
            console.log(e)
            return false
        }

    }


}
