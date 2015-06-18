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
        'frameRate': 12,
        'frameWidth': 600,
        'frameHeight': 300,
        'debug': {
            'enabled': false
        },
        'router': {
            'apiKey': null
        },
        'loader': {

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

        //  Setup singletons, debug first (mainly for pretty-logs)
        base.debug = new $SVA.debug(base.options.debug, base);

        base.log('Constructing');

        //  Now the others
        base.router = new $SVA.router(base.options.router, base);
        base.loader = new $SVA.loader(base.options.loader, base);
        base.player = new $SVA.player(base.options.player, base);

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
     * @param  {Mixed} item The item to log
     * @return {Object}
     */
    base.log = function(item) {

        /**
         * If additional items have been passed then send the `arguments` array
         * to the logger, otherwise log the single item.
         */
        if (arguments.length > 1) {
            base.debug.log('SVA [Movie]:', arguments);
        } else {
            base.debug.log('SVA [Movie]:', item);
        }

        return base;
    };

    return base.__construct();
};