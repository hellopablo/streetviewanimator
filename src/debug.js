/**
 * This class provides debugging functionality to StreetView Animator
 * @return {Object}
 */
window.streetviewanimator.debug = {

    /**
     * Whether debugging is enabled or not
     * @type {Boolean}
     */
    'enabled': false,

    // --------------------------------------------------------------------------

    /**
     * Renders a `log` call to the console
     * @param  {String} caller The calling class
     * @param  {Mixed}  items  The item(s) to log
     * @return {Object}
     */
    'log': function(caller, items) {
        return this.execConsoleFunc('log', caller, items);
    },

    // --------------------------------------------------------------------------

    /**
     * Renders an `info` call to the console
     * @param  {String} caller The calling class
     * @param  {Mixed}  items  The item(s) to log
     * @return {Object}
     */
    'info': function(caller, items) {
        return this.execConsoleFunc('info', caller, items);
    },

    // --------------------------------------------------------------------------

    /**
     * Renders a `warn` call to the console
     * @param  {String} caller The calling class
     * @param  {Mixed}  items  The item(s) to log
     * @return {Object}
     */
    'warn': function(caller, items) {
        return this.execConsoleFunc('warn', caller, items);
    },

    // --------------------------------------------------------------------------

    /**
     * Renders an `error` call to the console
     * @param  {String} caller The calling class
     * @param  {Mixed}  items  The item(s) to log
     * @return {Object}
     */
    'error': function(caller, items) {
        return this.execConsoleFunc('error', caller, items);
    },

    // --------------------------------------------------------------------------

    /**
     * Prepares the arguments and executes the console method
     * @param  {String} method The console method to call
     * @param  {String} caller The calling class
     * @param  {Mixed}  items  The item(s) to log
     * @return {Object}
     */
    'execConsoleFunc': function(method, caller, items) {

        if (this.enabled && typeof console !== 'undefined') {

            var methods = ['log', 'info', 'warn', 'error'];

            for (var i = methods.length - 1; i >= 0; i--) {
                if (methods[i] === method && typeof console[methods[i]] === 'function') {
                    var args = [caller];
                    for (var x = 0; x < items.length; x++) {
                        args.push(items[x]);
                    }
                    console[methods[i]].apply(console, args);
                    break;
                }
            }
        }

        return this;
    }
};
