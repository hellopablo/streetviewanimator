/**
 * A clip is a singular series of frames which make up a single part of an animation.
 * Clips are contained within scenes. A scene may contain multiple clips.
 * @param  {Object} options       The clip options
 * @param  {Object} sceneInstance A reference to the main movie instance
 * @return {Object}
 */
window.streetviewanimator.clip = function(name, options, sceneInstance) {

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
    base.scene = sceneInstance;

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

    base.__construct = function() {
        base.log('Constructing');
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
     * Sends an item to the log, prefixing it with a string so that the class
     * making the log is easily identifiable
     * @return {Object}
     */
    base.log = function() {

        $SVA.debug.log('SVA [Clip]:', arguments);
        return base;
    };

    // --------------------------------------------------------------------------

    /**
     * Sends an item to the error log, prefixing it with a string so that the class
     * making the log is easily identifiable
     * @return {Object}
     */
    base.error = function() {

        $SVA.debug.error('SVA [Clip]:', arguments);
        return base;
    };

    // --------------------------------------------------------------------------

    return base.__construct();
};