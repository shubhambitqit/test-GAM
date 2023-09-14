import {ClientApplication, createApp} from "@shopify/app-bridge";
import {getSessionToken} from "@shopify/app-bridge/utilities";

export const useBridge = () => {
    let app: ClientApplication;
    const config = useRuntimeConfig();

    const getApp = (): ClientApplication => {
        if (!app) {
            app = createApp({
                apiKey: config.public.clientId,
                host: localStorage.getItem("host") as string,
            });
        }

        return app;
    };

    const getToken = async () => {
        return await getSessionToken(getApp());
    };

    return {getApp, getToken};
};
