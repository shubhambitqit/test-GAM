import {FirebaseService} from "~/server/service/firebaseService";
import {createHmac} from "crypto";
import {FivetranService} from "~/server/service/fivetranService";
import {Connector} from "~/server/config/connector";
import {ShopifyOrg} from "~/server/config/shopifyOrg";
import {MESSAGES} from "~/engine/dto/Constants";


// Helper function to verify HMAC
const isHmacValid = (rawData, clientSecret, receivedHmac) => {
    const generatedHmac = createHmac("sha256", clientSecret)
        .update(rawData)
        .digest("base64");
    return receivedHmac === generatedHmac;
};

export default defineEventHandler(async (event) => {
    try {
        const {node} = event

        const config = useRuntimeConfig()

        const headers = await getRequestHeaders(event);

        const hmac = headers["x-shopify-hmac-sha256"]


        let rawData = '';

        for await (const chunk of node.req) {
            rawData += chunk;
        }

        // Validate HMAC
        if (!isHmacValid(rawData, config.clientSecret, hmac)) {
            console.error("Error Verifying HMAC");
            event.node.res.statusCode = 403;
            event.node.res.end(JSON.stringify({error: MESSAGES.VERIFICATIONERROR}));
        }

        const shopUrl = headers['x-shopify-shop-domain'] as string

        const firebaseService = new FirebaseService();

        const fivetranService = new FivetranService();

        const shopName = shopUrl?.split(".myshopify.com")[0];

        let connector: Connector;

        const shop: ShopifyOrg = await firebaseService.getShop(shopUrl)


        if (shop) {
            connector = await firebaseService.getConnector(shop.customer_id)
        }

        if (connector) {
            let response = await fivetranService.pauseConnector(connector.fivetran_connector_id, shop.shopify_token, connector.schema_name, shopName)
            if (response.code === 'Success')
                await firebaseService.deleteConnector(connector.fivetran_connector_id)
            else console.log("Unable to pause Connector")
        }

        // Insert the data into the document
        await firebaseService.deleteDocument(shopUrl);

        // Send a response with status 201 and a success message
        event.node.res.statusCode = 200;
        event.node.res.end(JSON.stringify({message: MESSAGES.SUCCESS}));


    } catch (error) {
        console.error("Error inserting data:", error);
        event.node.res.statusCode = 500;
        event.node.res.end(JSON.stringify({error: MESSAGES.ERROR}));
    }
});

