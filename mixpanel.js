// Define the Mixpanel class to encapsulate Mixpanel functionality
class MixpanelClass {
    constructor(token) {
        this.token = token;
    }

    async alias(alias, distinct_id) {
        console.log('insidealias')
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
        console.log('insideidentify')
        const eventData = {
            event: '$identify',
            properties: {
                $identified_id: distinct_id,
                token: this.token
            }
        };
        await this.trackEvent(eventData);
    }

    async peopleSet(properties) {
        const requestData = {
            $token: this.token,
            $distinct_id: properties.$email,
            $set: properties
        };
        await this.engage(requestData);
    }

    async peopleSetOnce(properties) {
        const requestData = {
            $token: this.token,
            $distinct_id: properties.$email,
            $set_once: properties
        };
        await this.engage(requestData);
    }

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
        console.log("event")
        const encodedData = btoa(JSON.stringify(eventData));
        const formData = new URLSearchParams();
        formData.append('data', encodedData);

      fetch('https://api.mixpanel.com/track', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData
        }).then(x=> console.log(x.json())
      )

    }

    async engage(requestData) {
        await fetch('https://api.mixpanel.com/engage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });
    }

    people = {
        set: async (properties) => {
            const requestData = {
                $token: this.token,
                $distinct_id: properties.$email,
                $set: properties
            };
            await this.engage(requestData);
        }
    };

    people = {
        set_once: async (properties) => {
            const requestData = {
                $token: this.token,
                $distinct_id: properties.$email,
                $set_once: properties
            };
            await this.engage(requestData);
        }
    };
}

// Define a MixpanelFactory to handle instance creation
const MixpanelFactory = {
    instance: null,

    init: function (token) {
        if (!token) {
            throw new Error('Token is required to initialize Mixpanel');
        }
        this.instance = new MixpanelClass(token);
        self.mixpanel = this.instance;  // expose the instance globally
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
