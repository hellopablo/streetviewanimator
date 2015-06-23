/**
 * This class provides an interface for getting routes between two points; it abstracts the Google Map libraries.
 * @param  {Object} options       The router options
 * @param  {Object} movieInstance The main movie instance
 * @return {Object}
 */
window.streetviewanimator.router = function(options, movieInstance) {

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

    /**
     * The API key to use when communicating with Google
     * @type {String}
     */
    base.apiKey = options.apiKey;

    // --------------------------------------------------------------------------

    base.__construct = function() {
        base.log('Constructing');
    };

    // --------------------------------------------------------------------------

    /**
     * Set the API key to sue when communicating with Google
     * @param {String} apiKey The API key to sue
     */
    base.setApiKey = function(apiKey) {
        base.apiKey = apiKey;
        return base;
    };

    // --------------------------------------------------------------------------

    /**
     * Sends an item to the log, prefixing it with a string so that the class
     * making the log is easily identifiable
     * @return {Object}
     */
    base.log = function() {

        $SVA.debug.log('SVA [Router]:', arguments);
        return base;
    };

    // --------------------------------------------------------------------------

    /**
     * Sends an item to the error log, prefixing it with a string so that the class
     * making the log is easily identifiable
     * @return {Object}
     */
    base.error = function() {

        $SVA.debug.error('SVA [Router]:', arguments);
        return base;
    };

    // --------------------------------------------------------------------------

    return base.__construct();
};