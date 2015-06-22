/**
 * This class provides an interface for creating and manipulating map DOM elements
 * @param  {Object} options       The router options
 * @param  {Object} movieInstance The main movie instance
 * @return {Object}
 */
window.streetviewanimator.map = function(options, movieInstance) {

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

    base.__construct = function() {
        base.log('Constructing');
    };

    // --------------------------------------------------------------------------

    /**
     * Sends an item to the log, prefixing it with a string so that the class
     * making the log is easily identifiable
     * @param  {Mixed} item The item to log
     * @return {Object}
     */
    base.log = function(item) {

        $SVA.debug.log('SVA [Map]:', arguments);
        return base;
    };

    // --------------------------------------------------------------------------

    /**
     * Sends an item to the error log, prefixing it with a string so that the class
     * making the log is easily identifiable
     * @param  {Mixed} item The item to log
     * @return {Object}
     */
    base.error = function(item) {

        $SVA.debug.error('SVA [Map]:', arguments);
        return base;
    };

    // --------------------------------------------------------------------------

    return base.__construct();
};