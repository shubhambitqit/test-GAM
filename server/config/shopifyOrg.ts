import {MixpanelConfig} from "~/server/config/mixpanel";

export type ShopifyOrg = {
    customer_id: string;
    fivetran_id?: string;
    is_deleted: null | Date;
    mixpanel?: MixpanelConfig
    shopify_store_url: string;
    shopify_token: string
}