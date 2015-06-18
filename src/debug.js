/**
 * This class provides debugging functionality to StreetView Animator
 * @param  {Object} options       The debug options
 * @param  {Object} movieInstance The main movie instance
 * @return {Object}
 */
window.streetviewanimator.debug = function(options, movieInstance) {

    /**
     * Prevent scope issues by using `base` in callbacks instead of `this`
     * @type {Object}
     */
    var base = this;

    // --------------------------------------------------------------------------

    /**
     * Alias to main namespace
     * @type {Object}
     */
    var $SVA = window.streetviewanimator;

    // --------------------------------------------------------------------------

    base.enabled = false;
    base.treatAsIE8 = false;
    base.slice = Array.prototype.slice;

    //see http://patik.com/blog/complete-cross-browser-console-log/
    // Tell IE9 to use its built-in console
    if (Function.prototype.bind && (typeof console === 'object' || typeof console === 'function') && typeof console.log == 'object') {
        try {
            ['log', 'info', 'warn', 'error', 'assert', 'dir', 'clear', 'profile', 'profileEnd']
                .forEach(function(method) {
                    console[method] = this.call(console[method], console);
                }, Function.prototype.bind);
        } catch (ex) {
            base.treatAsIE8 = true;
        }
    }

    // --------------------------------------------------------------------------

    base.__construct = function() {
        base.enabled = options.enabled ? true : false;
        return base;
    };

    // --------------------------------------------------------------------------

    base.log = function(caller, items) {

        if (base.enabled) {
            try {
                // Modern browsers
                if (typeof console != 'undefined' && typeof console.log == 'function') {
                    // Opera 11
                    if (window.opera) {
                        var i = 0;
                        while (i < arguments.length) {
                            console.log('Item ' + (i + 1) + ': ' + arguments[i]);
                            i++;
                        }
                    }
                    // All other modern browsers
                    else if ((base.slice.call(arguments)).length == 1 && typeof base.slice.call(arguments)[0] == 'string') {
                        console.log((slice.call(arguments)).toString());
                    } else {
                        console.log.apply(console, base.slice.call(arguments));
                    }
                }
                // IE8
                else if ((!Function.prototype.bind || base.treatAsIE8) && typeof console != 'undefined' && typeof console.log == 'object') {
                    Function.prototype.call.call(console.log, console, slice.call(arguments));
                }

                // IE7 and lower, and other old browsers
            } catch (ignore) {}
        }
    };

    // --------------------------------------------------------------------------

    return base.__construct();
};