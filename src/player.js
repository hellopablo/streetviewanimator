/**
 * This class provides an interface for playing streetview animator animations.
 * @param  {Object} options       The player options
 * @param  {Object} movieInstance The main movie instance
 * @return {Object}
 */
window.streetviewanimator.player = function(options, movieInstance) {

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
        return base;
    };

    // --------------------------------------------------------------------------

    /**
     * Sends an item to the log, prefixing it with a string so that the class
     * making the log is easily identifiable
     * @param  {Mixed} item The item to log
     * @return {Object}
     */
    base.log = function(item) {

        /**
         * If additional items have been passed then send the `arguments` array
         * to the logger, otherwise log the single item.
         */
        if (arguments.length > 1) {
            movieInstance.debug.log('SVA [Player]:', arguments);
        } else {
            movieInstance.debug.log('SVA [Player]:', item);
        }

        return base;
    };

    // --------------------------------------------------------------------------

    return base.__construct();
};