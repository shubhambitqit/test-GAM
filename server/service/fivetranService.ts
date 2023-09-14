import {STATUS} from "~/engine/dto/Constants";

const config = useRuntimeConfig();


export class FivetranService {

    private connectorData = {}

    async createConnector(shopName: string, accessToken: string, customerId: string, counter: number = 0) {
        try {
            let data = {
                "service": "shopify",
                "paused": false,
                "pause_after_trial": false,
                "sync_frequency": 15,
                "group_id": config.fivetranGroupId,
                "config": {
                    "schema": `shopify_${customerId}_${shopName.replaceAll('-', '_')}${counter === 0 ? '' : `_${counter}`}`,
                    "shop": `${shopName}`
                },
                "auth": {
                    "access_token": `${accessToken}`
                }
            }

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + Buffer.from(`${config.fivetranKey}:${config.fivetranSecret}`).toString('base64') // username and password from env

            }

            let response = await $fetch('https://api.fivetran.com/v1/connectors', {
                method: "POST",
                headers: headers,
                body: JSON.stringify(data)
            })

            return {
                success: true,
                data: {
                    schema: response.data.schema,
                    connectorId: response.data.id
                }
            }
        } catch (e) {

            if (e.status === STATUS.CONFLICT) {
                return await this.createConnector(shopName, accessToken, customerId, counter + 1)
            }
            return {
                success: false,
                data: e
            }
        }

    }


    async pauseConnector(connectorId: string, accessToken: string, schema: string, shopName: string): Promise<unknown> {
        let data = {
            "paused": true,
            "config": {
                "schema": `${schema}`,
                "shop": `${shopName}`
            },
            "auth": {
                "access_token": `${accessToken}`
            }
        }

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + Buffer.from(`${config.fivetranKey}:${config.fivetranSecret}`).toString('base64') // username and password from env

        }

        return await $fetch(`https://api.fivetran.com/v1/connectors/${connectorId}`, {
            method: 'PATCH',
            headers: headers,
            body: JSON.stringify(data)
        })
    }

}





