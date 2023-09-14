import {FirebaseService} from "~/server/service/firebaseService";
import {FivetranService} from "~/server/service/fivetranService";
import {ShopifyService} from "~/server/service/shopifyService";

const config = useRuntimeConfig();

function redirectToAdmin(shopName, res) {
    res.writeHead(302, {
        Location: `https://admin.shopify.com/store/${shopName}/apps/${config.appName}`
    });
    res.end();
}

function handleServerError(errorMessage, res) {
    console.error(errorMessage);
    res.statusCode(500);
    res.end('Internal Server Error');
}

export default defineEventHandler(async (event) => {
    try {
        const {shop, code} = getQuery(event);

        if (!shop || !code) {
            return handleServerError('Missing shop or code.', event.node.res);
        }

        const shopName = shop.split(".myshopify.com")[0];

        const firebaseService = new FirebaseService();
        const fivetranService = new FivetranService();
        const shopifyService = new ShopifyService(shop);

        const shopifyAccessToken = await shopifyService.getAccessToken(code);
        if (!shopifyAccessToken) return handleServerError('Failed to get Shopify access token.', event.node.res);


        const shopifyId = await shopifyService.getShopifyId(shopifyAccessToken);
        if (!shopifyId) return handleServerError('Failed to get Shopify ID.', event.node.res);


        const customerId = await firebaseService.saveAccessTokenAndShopUrl(shopifyAccessToken, shop, shopifyId);
        if (!customerId) return handleServerError('Failed to save to Firebase.', event.node.res);


        const {success, data} = await fivetranService.createConnector(shopName, shopifyAccessToken, shopifyId);
        if (!success) return handleServerError('Failed to create Fivetran connector.', event.node.res);


        await firebaseService.saveConnectors(shopifyId, customerId, data?.connectorId, data?.schema);

        await shopifyService.registerWebhookSubscription(shopifyAccessToken);

        redirectToAdmin(shopName, event.node.res);

    } catch (e) {
        handleServerError('An unexpected error occurred: ' + e.message, event.node.res);
    }
});
