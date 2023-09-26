// Define the Mixpanel class to encapsulate Mixpanel functionality
class MixpanelClass {
    constructor(token) {
        this.token = token;
    }

    async track(event, properties) {
        const requestData = {
            event: event,
            properties: {
                token: this.token,
                ...properties
            }
        };

        const response = await fetch('https://api.mixpanel.com/track', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([requestData])
        });

        // Handle response...
        console.log(response);
    }

    people = {
        set: async (properties) => {
            const requestData = {
                $token: this.token,
                $distinct_id: properties.$email,  // Assume $email as distinct_id
                $set: properties
            };

            const response = await fetch('https://api.mixpanel.com/engage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            // Handle response...
            console.log(response);
        }
    };
}

// Define a MixpanelFactory to handle instance creation
const MixpanelFactory = {
    instance: null,

    init: function(token) {
        if (!token) {
            throw new Error('Token is required to initialize Mixpanel');
        }
        this.instance = new MixpanelClass(token);
        self.mixpanel = this.instance;  // expose the instance globally
        console.log("inside")
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