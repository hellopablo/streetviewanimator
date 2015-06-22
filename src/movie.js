/**
 * This is the main class for StreetView animator. Each movie is an instance of
 * this class. A movie instance can contain sequences.
 * @param  {Object} options       The global options object
 * @return {Object}
 */
window.streetviewanimator.movie = function(options) {

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
     * The default options object
     * @type {Object}
     */
    base.options = {
        'debug': {
            'enabled': false
        },
        'router': {
            'apiKey': null
        },
        'scene': {
            'frameRate': null
        },
        'clip': {
            'target': {
                'label': null,
                'lat': null,
                'lng': null,
            },
            'duration': '',
            'frames': []
        },
        'player': {
            'frameRate': 12,
            'frameWidth': 600,
            'frameHeight': 300,
            'domElement': null,
            'mode': 'background'
        }
    };

    // --------------------------------------------------------------------------

    /**
     * Holds references to each scene within the movie
     * @type {Object}
     */
    base.scenes = {};

    // --------------------------------------------------------------------------

    /**
     * Constructs the movie
     * @return {Object}
     */
    base.__construct = function() {

        base.options = $.extend(true, base.options, options);

        /**
         * Pass the global debug parameter into the player options if it's
         * not been defined.
         */
        if (typeof base.options.player.debug === 'undefined') {
            base.options.player.debug = base.options.debug.enabled;
        }

        //  Are we turning debugging on?
        if (base.options.debug.enabled) {
            $SVA.debug.enabled = true;
        }

        base.log('Constructing');

        //  Setup singletons
        base.router = new $SVA.router(base.options.router, base);

        //  And finally the player, check it exists first
        if (typeof window.frameplayer === 'undefined') {
            base.error('Dependency FramePlayer is not available http://hellopablo.github.io/frameplayer');
        } else {
            base.player = new window.frameplayer.player(base.options.player, base);
        }

        // --------------------------------------------------------------------------

        return base;
    };

    // --------------------------------------------------------------------------

    /**
     * Create, edit or fetch a scene instance
     * @param  {String} name    The scene name
     * @param  {Object} options The scene options
     * @return {Object}
     */
    base.scene = function(name, options) {

        options = options || {};

        if (typeof base.scenes[name] === 'undefined') {

            //  Create new scene
            options = $.extend(true, base.options.scene, options);
            base.scenes[name] = new $SVA.scene(name, options, base);

        } else {

            //  Update existing scene
            base.scenes[name].setOptions(options);
        }

        return base.scenes[name];
    };

    // --------------------------------------------------------------------------

    /**
     * Sends an item to the log, prefixing it with a string so that the class
     * making the log is easily identifiable
     * @return {Object}
     */
    base.log = function() {

        $SVA.debug.log('SVA [Movie]:', arguments);
        return base;
    };

    // --------------------------------------------------------------------------

    /**
     * Sends an item to the error log, prefixing it with a string so that the class
     * making the log is easily identifiable
     * @return {Object}
     */
    base.error = function() {

        $SVA.debug.error('SVA [Movie]:', arguments);
        return base;
    };

    // --------------------------------------------------------------------------

    return base.__construct();
};