var _cio = _cio || [];
(function() {
    var a, b, c;
    a = function(f) {
        return function() {
            _cio.push([f].concat(Array.prototype.slice.call(arguments, 0)));
        };
    };
    b = ["load", "identify", "sidentify", "track", "page", "on", "off"];
    for (c = 0; c < b.length; c++) {
        _cio[b[c]] = a(b[c]);
    }
    var t = document.createElement('script'),
        s = document.getElementsByTagName('script')[0];
    t.async = true;
    t.id = 'cio-tracker';
    t.setAttribute('data-site-id', '9c86c6f450dc4ddff6cd');
    t.setAttribute('data-use-array-params', 'true');

    // Enables in-app messaging
    t.setAttribute('data-use-in-app', 'true');

    t.src = 'https://assets.customer.io/assets/track.js';
    // If your account is in the EU, use:
    // t.src = 'https://assets.customer.io/assets/track-eu.js'
    s.parentNode.insertBefore(t, s);
})();