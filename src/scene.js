/**
 * This class provides an interface for grouping clips.
 * @param  {Object} options       The scene options
 * @param  {Object} movieInstance The main movie instance
 * @return {Object}
 */
window.streetviewanimator.scene = function(name, options, movieInstance) {

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
     * The instance of the movie
     * @type {Object}
     */
    base.movie = movieInstance;

    // --------------------------------------------------------------------------

    /**
     * The name of the scene
     * @type {String}
     */
    base.name = name;

    // --------------------------------------------------------------------------

    /**
     * Scene options
     * @type {Object}
     */
    base.options = options || {};

    // --------------------------------------------------------------------------

    /**
     * Holds references to each clip within the scee
     * @type {Object}
     */
    base.clips = {};

    // --------------------------------------------------------------------------

    base.__construct = function() {
        base.log('Constructing ');
        return base;
    };

    // --------------------------------------------------------------------------

    /**
     * Return the current options object
     * @return {Object}
     */
    base.getOptions = function() {
        return base.options;
    };

    // --------------------------------------------------------------------------

    /**
     * Set the options object
     * @param {Object} newOptions the options to set
     */
    base.setOptions = function(newOptions) {

        base.log('Setting options');
        base.options = $.extend(true, base.options, newOptions);

        return base;
    };

    // --------------------------------------------------------------------------

    /**
     * Create, edit or fetch a clip instance
     * @param  {String} name    The clip name
     * @param  {Object} options The clip options
     * @return {Object}
     */
    base.clip = function(name, options) {

        options = options || {};

        if (typeof base.clip[name] === 'undefined') {

            //  Create new scene
            options = $.extend(true, movieInstance.options.scene, options);
            base.clips[name] = new $SVA.clip(name, options, base);

        } else {

            //  Update existing clip
            base.clips[name].setOptions(options);
        }

        return base.clips[name];
    };

    // --------------------------------------------------------------------------

    /**
     * Sends an item to the log, prefixing it with a string so that the class
     * making the log is easily identifiable
     * @param  {Mixed} item The item to log
     * @return {Object}
     */
    base.log = function(item) {

        $SVA.debug.log('SVA [Scene]:', arguments);
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

        $SVA.debug.error('SVA [Scene]:', arguments);
        return base;
    };

    // --------------------------------------------------------------------------

    return base.__construct();
};