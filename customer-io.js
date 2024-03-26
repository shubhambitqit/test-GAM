var analytics = window.analytics = window.analytics || [];
(function () {
    if (!analytics.initialize) {
        if (analytics.invoked) {
            window.console && console.error && console.error("Snippet included twice.");
        } else {
            analytics.invoked = !0;
            analytics.methods = [
                "trackSubmit", "trackClick", "trackLink", "trackForm",
                "pageview", "identify", "reset", "group", "track", "ready",
                "alias", "debug", "page", "once", "off", "on",
                "addSourceMiddleware", "addIntegrationMiddleware", "setAnonymousId",
                "addDestinationMiddleware"
            ];
            analytics.factory = function (e) {
                return function () {
                    var t = Array.prototype.slice.call(arguments);
                    t.unshift(e);
                    analytics.push(t);
                    return analytics
                }
            };
            for (var e = 0; e < analytics.methods.length; e++) {
                var key = analytics.methods[e];
                analytics[key] = analytics.factory(key)
            }
            analytics.load = function (key, e) {
                var t = document.createElement("script");
                t.type = "text/javascript";
                t.async = !0;
                t.src = "https://cdp.customer.io/v1/analytics-js/snippet/" + key + "/analytics.min.js";
                var n = document.getElementsByTagName("script")[0];
                n.parentNode.insertBefore(t, n);
                analytics._writeKey = key;
                analytics._loadOptions = e
            };
            analytics.SNIPPET_VERSION = "4.15.3";
            analytics.load("a03a8a33741b9315a05b"); // Your Customer.io write key
            analytics.page();
        }
    }
})();