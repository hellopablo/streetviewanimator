/**
 * This class represents a single scene
 * @param  {Object} options       The scene options
 * @param  {Object} movieInstance The main movie instance
 * @return {Object}
 */
window.streetviewanimator.scene = function(sceneId, options, movieInstance) {

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
     * The anme / unique identifier of the scene
     * @type {String}
     */
    base.sceneId = sceneId || null;

    // --------------------------------------------------------------------------

    /**
     * The scene's type
     * @type {String}
     */
    base.type = options.type || 'AUTO';

    // --------------------------------------------------------------------------

    /**
     * The scene's origin as either a string or a {lat:null,lng:null} object,
     * required if type is set to AUTO
     * @type {Mixed}
     */
    base.origin = options.origin || null;

    // --------------------------------------------------------------------------

    /**
     * The scene's destination as either a string or a {lat:null,lng:null} object,
     * required if type is set to AUTO
     * @type {Mixed}
     */
    base.destination = options.destination || null;

    // --------------------------------------------------------------------------

    /**
     * The scene's duration, in seconds
     * @type {Number}
     */
    base.duration = options.duration || 5;

    // --------------------------------------------------------------------------

    /**
     * The camera target as either a string or a {lat:null,lng:null} object
     * @type {Mixed}
     */
    base.target = options.target || null;

    // --------------------------------------------------------------------------

    /**
     * The camera pitch
     * @type {Number}
     */
    base.pitch = options.pitch || 10;

    // --------------------------------------------------------------------------

    /**
     * The camera field of vision
     * @type {Number}
     */
    base.fov = options.fov || 10;

    // --------------------------------------------------------------------------

    /**
     * The scene's frames, required if type is set to MANUAL
     * @type {Array}
     */
    base.frames = options.frames || [];

    // --------------------------------------------------------------------------

    /**
     * Whether the scene has been generated or not
     * @type {Boolean}
     */
    base.generated = false;

    // --------------------------------------------------------------------------

    /**
     * Construct the class
     * @return {Object}
     */
    base.__construct = function() {

        base.log('Constructing');
        base.log('Scene Type: ' + base.type);

        // --------------------------------------------------------------------------

        //  Set the scene's options
        base.setOptions(options);

        // --------------------------------------------------------------------------

        //  Check everything is as it should be
        base.validateOptions();

        // --------------------------------------------------------------------------

        return base;
    };

    // --------------------------------------------------------------------------

    /**
     * Sets the scene's options
     * @param  {Object} newOptions The option(s) to set
     * @return {Object}
     */
    base.setOptions = function(newOptions) {

        if (typeof newOptions.type !== 'undefined') {
            base.type = options.type || 'AUTO';
        }

        if (typeof newOptions.origin !== 'undefined') {
            base.origin = options.origin || null;
        }

        if (typeof newOptions.destination !== 'undefined') {
            base.destination = options.destination || null;
        }

        if (typeof newOptions.duration !== 'undefined') {
            base.duration = options.duration || 5;
        }

        if (typeof newOptions.target !== 'undefined') {
            base.target = options.target || null;
        }

        if (typeof newOptions.pitch !== 'undefined') {
            base.pitch = options.pitch || 10;
        }

        if (typeof newOptions.fov !== 'undefined') {
            base.fov = options.fov || 10;
        }

        if (typeof newOptions.frames !== 'undefined') {
            base.frames = options.frames || [];
        }

        // --------------------------------------------------------------------------

        if (base.type === 'MANUAL') {
            //  No need to generate a MANUAL scene
            base.generated = true;
        }

        // --------------------------------------------------------------------------

        return base.validateOptions();
    };

    // --------------------------------------------------------------------------

    /**
     * Validates the scene's options
     * @return {Object}
     */
    base.validateOptions = function() {

        if (base.type === 'AUTO') {

            if (!base.origin) {
                throw('An origin must be specified');
            } else if (base.origin !== null && typeof base.origin === 'object') {
                if (typeof base.origin.lat === 'undefined' || !base.origin.lat.length) {
                    throw('If origin is supplied as an object, the lat property cannot be empty');
                }
                if (typeof base.origin.lng === 'undefined' || !base.origin.lng.length) {
                    throw('If origin is supplied as an object, the lng property cannot be empty');
                }
            }

            if (!base.destination) {
                throw('An destination must be specified');
            } else if (base.destination !== null && typeof base.destination === 'object') {
                if (typeof base.destination.lat === 'undefined' || !base.destination.lat.length) {
                    throw('If destination is supplied as an object, the lat property cannot be empty');
                }
                if (typeof base.destination.lng === 'undefined' || !base.destination.lng.length) {
                    throw('If destination is supplied as an object, the lng property cannot be empty');
                }
            }

            if (base.target !== null && typeof base.target === 'object') {
                if (typeof base.target.lat === 'undefined' || !base.target.lat.length) {
                    throw('If target is supplied as an object, the lat property cannot be empty');
                }
                if (typeof base.target.lng === 'undefined' || !base.target.lng.length) {
                    throw('If target is supplied as an object, the lng property cannot be empty');
                }
            }

        } else if (base.type === 'MANUAL') {

            if (!base.frames.length) {
                throw('Scenes of type MANUAL must define at least 1 frame');
            }

        } else {

            throw('Invalid scene type "' + base.type + '"');
        }

        return base;
    };

    // --------------------------------------------------------------------------

    /**
     * Process the scene and generate the frames
     * @return {Object} A jQuery promise
     */
    base.generate = function() {

        var deferred = new $.Deferred();

        if (!base.requiresGeneration()) {

            base.log('Generation not required');
            deferred.resolve();

        } else {

            //  Begin generation
            base.log('Requires generation');
            base.log('Beginning generation');
            base.log('Completed generation');

            base.frames = [
                "http://lorempixel.com/600/338/people",
                "http://lorempixel.com/600/338/abstract",
                "http://lorempixel.com/600/338/animals",
                "http://lorempixel.com/600/338/food"
            ];

            base.generated = true;
            deferred.resolve();
        }

        return deferred.promise();
    };

    // --------------------------------------------------------------------------

    /**
     * Returns whether the scene has been generated or not
     * @return {Boolean}
     */
    base.requiresGeneration = function() {
        return !base.generated;
    };

    // --------------------------------------------------------------------------

    /**
     * Returns the ID of the scene
     * @return {String}
     */
    base.getId = function() {
        return base.sceneId;
    };

    // --------------------------------------------------------------------------

    /**
     * Returns the scene's frames
     * @return {Array}
     */
    base.getFrames = function() {
        return base.frames;
    };

    // --------------------------------------------------------------------------

    /**
     * Return the number fo frames for this scene. Note that this can be inaccurate
     * if the scene has not been processed.
     * @return {Object}
     */
    base.getNumFrames = function() {

        return base.frames.length;
    };

    // --------------------------------------------------------------------------

    /**
     * Sends an item to the log, prefixing it with a string so that the class
     * making the log is easily identifiable
     * @return {Object}
     */
    base.log = function() {

        $SVA.debug.log('SVA [Scene:' + base.getId() + ']:', arguments);
        return base;
    };

    // --------------------------------------------------------------------------

    /**
     * Sends an item to the error log, prefixing it with a string so that the class
     * making the log is easily identifiable
     * @return {Object}
     */
    base.error = function() {

        $SVA.debug.error('SVA [Scene:' + base.getId() + ']:', arguments);
        return base;
    };

    // --------------------------------------------------------------------------

    return base.__construct();
};