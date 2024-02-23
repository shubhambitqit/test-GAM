// Define the Mixpanel class to encapsulate Mixpanel functionality
class MixpanelClass {

    email = ''
    anonId = ''

    constructor(token, server) {
        this.token = token;
        console.log(server, "server")
        this.server = server === 'US' ? 'api' : 'api-eu'
    }

    async alias(alias, distinct_id) {
        this.anonId = distinct_id;
        // console.log('insidealias')
        const eventData = {
            event: '$create_alias',
            properties: {
                distinct_id: distinct_id,
                alias: alias,
                token: this.token
            }
        };
        await this.trackEvent(eventData);
    }

    async identify(distinct_id) {
        // console.log('insideidentify')
        console.log(distinct_id.split("$device:")[1], "identify")
        const eventData = {
            event: '$identify',
            properties: {
                $identified_id: distinct_id,
                $anon_id: this.anonId,
                token: this.token
            }
        };
        await this.trackEvent(eventData);
    }

    // async peopleSet(properties) {
    //     const requestData = {
    //         $token: this.token,
    //         $distinct_id: properties.$email,
    //         $set: properties
    //     };
    //     await this.engage(requestData);
    // }
    //
    // async peopleSetOnce(properties) {
    //     const requestData = {
    //         $token: this.token,
    //         $distinct_id: properties.$email,
    //         $set_once: properties
    //     };
    //     await this.engage(requestData);
    // }

    async track(eventName, properties) {
        const eventData = {
            event: eventName,
            properties: {
                token: this.token,
                ...properties
            }
        };
        await this.trackEvent(eventData);
    }

    async trackEvent(eventData) {
        // console.log(eventData)
        const encodedData = await this.utf8_to_b64(JSON.stringify(eventData));
        // console.log(encodedData)
        const formData = new URLSearchParams();
        formData.append('data', encodedData);
        console.log(`https://${this.server}.mixpanel.com/track`, "url")
        const resposne = await fetch(`https://${this.server}.mixpanel.com/track`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'accept': 'text/plain'
            },
            body: formData
        })

        // console.log(await resposne.json())

    }


    people = {
        set: async (properties) => {
            this.email = properties.$email;
            console.log("set", "prop")
            const requestData = {
                $token: this.token,
                $distinct_id: properties.$email,
                $set: properties
            };
            await this.engage(requestData);
        },
        set_once: async (properties) => {
            // console.log("inside once", this.email)
            // console.log(properties)
            const requestData = {
                $token: this.token,
                $distinct_id: this.email,
                $set_once: properties
            };
            await this.engage(requestData);
        }
    }


    async engage(requestData) {
        // Base64 encode the JSON stringified requestData
        const encodedData = await this.utf8_to_b64(JSON.stringify(requestData));
        const formData = new URLSearchParams();
        formData.append('data', encodedData);
        const response = await fetch(`https://${this.server}.mixpanel.com/engage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'accept': 'text/plain'
            },
            body: formData
        });
        console.log(response)
        console.log(await response.json())
    }


    async utf8_to_b64(str) {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
            return String.fromCharCode('0x' + p1);
        }));
    }
}

// Define a MixpanelFactory to handle instance creation
const MixpanelFactory = {
    instance: null,
    dataCenter: null,
    init: function (token) {
        console.log(token,"check token");
        if (!token) {
            throw new Error('Token is required to initialize Mixpanel');
        }

        this.instance = new MixpanelClass(token, this.dataCenter);
        self.mixpanel = this.instance;  // expose the instance globally
    },

    setServer: function (server) {
        console.log(server,"check Server");
        this.dataCenter = server
    }
};

// Expose MixpanelFactory as mixpanel
self.mixpanel = MixpanelFactory;

// Now, you can save this script to a file, e.g., mixpanelWrapper.js
// and load it in your web worker using importScripts('mixpanelWrapper.js');
// Afterwards, you can initialize and use mixpanel like so:
// mixpanel.init('YOUR_PROJECT_TOKEN');
// mixpanel.track('Page Viewed', { page: 'homepage' });
// mixpanel.people.set({ $email: 'user@example.com', $phone: '555-5555' });
