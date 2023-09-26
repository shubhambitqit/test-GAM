// import { defineNuxtServerMiddleware } from '@nuxt/types';
import {FirebaseService} from '../service/firebaseService';
import {PERMISSIONS} from "~/engine/dto/Constants"; // Adjust the path as needed

import axios from 'axios';

const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {

    const {shop} = getQuery(event);


    console.log(`ClientId:`, config.clientId)
    console.log(`ClientSecret:`, config.clientSecret)
    console.log(`ClientIdpublic:`, config.public.clientId)
    console.log(`firebase:`, config.firebaseSecret)
    console.log(`fivetran:`, config.fivetranKey)
    console.log(`fietransecret:`, config.fivetranSecret)
    console.log(`base Url:`, config.public.baseUrl)


    const firebaseService = new FirebaseService();

    // check for shop in database
    const isShopUrlPresent = await firebaseService.isShopUrlPresent(shop);

    if (isShopUrlPresent) {
        // Shop URL already present, redirect to app page
        // return sendRedirect(event, 'https://admin.shopify.com/store/test-app-store-29aug/apps/test-app28')
        event.node.res.writeHead(302, {Location: config.public.baseUrl + '/mixpanel'}); // Change the URL as needed
        event.node.res.end();

    } else {
        const clientId = config.clientId;
        const requestScopes = PERMISSIONS.join(',');
        const baseUrl = config.public.baseUrl;

        const shopifyOAuthUrl = `https://${shop}/admin/oauth/authorize?client_id=${clientId}&scope=${requestScopes}&redirect_uri=${baseUrl}/api/callback`;
        // return  sendRedirect(event,shopifyOAuthUrl)
        // Redirect to the Shopify OAuth URL
        event.node.res.writeHead(302, {Location: shopifyOAuthUrl});
        event.node.res.end();
    }

});


