/**
 * This file simply ensures that the streetviewanimator namespace is properly declared.
 */
//  Ensure that the main object is defined
if (typeof window.streetviewanimator === "undefined") {
    window.streetviewanimator = {};
    //  Alias
    window.SVA = window.streetviewanimator;
}

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
        base.log("Constructing");
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
        base.log("Setting options");
        base.options = $.extend(true, base.options, newOptions);
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
            base.scene.movie.debug.log("SVA [Clip " + base.scene.name + ":" + base.name + "]:", arguments);
        } else {
            base.scene.movie.debug.log("SVA [Clip " + base.scene.name + ":" + base.name + "]:", item);
        }
        return base;
    };
    // --------------------------------------------------------------------------
    return base.__construct();
};

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
    if (Function.prototype.bind && (typeof console === "object" || typeof console === "function") && typeof console.log == "object") {
        try {
            [ "log", "info", "warn", "error", "assert", "dir", "clear", "profile", "profileEnd" ].forEach(function(method) {
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
                if (typeof console != "undefined" && typeof console.log == "function") {
                    // Opera 11
                    if (window.opera) {
                        var i = 0;
                        while (i < arguments.length) {
                            console.log("Item " + (i + 1) + ": " + arguments[i]);
                            i++;
                        }
                    } else if (base.slice.call(arguments).length == 1 && typeof base.slice.call(arguments)[0] == "string") {
                        console.log(slice.call(arguments).toString());
                    } else {
                        console.log.apply(console, base.slice.call(arguments));
                    }
                } else if ((!Function.prototype.bind || base.treatAsIE8) && typeof console != "undefined" && typeof console.log == "object") {
                    Function.prototype.call.call(console.log, console, slice.call(arguments));
                }
            } catch (ignore) {}
        }
    };
    // --------------------------------------------------------------------------
    return base.__construct();
};

/**
 * This class provides an interface for loading clips, sequences and frames.
 * @param  {Object} options       The loader options
 * @param  {Object} movieInstance The main movie instance
 * @return {Object}
 */
window.streetviewanimator.loader = function(options, movieInstance) {
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
        base.log("Constructing");
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
            movieInstance.debug.log("SVA [Loader]:", arguments);
        } else {
            movieInstance.debug.log("SVA [Loader]:", item);
        }
        return base;
    };
    // --------------------------------------------------------------------------
    return base.__construct();
};

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
        base.log("Constructing");
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
            movieInstance.debug.log("SVA [Map]:", arguments);
        } else {
            movieInstance.debug.log("SVA [Map]:", item);
        }
        return base;
    };
    // --------------------------------------------------------------------------
    return base.__construct();
};

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
        frameRate: 12,
        frameWidth: 600,
        frameHeight: 300,
        debug: {
            enabled: false
        },
        router: {
            apiKey: null
        },
        loader: {},
        scene: {
            frameRate: null
        },
        clip: {
            target: {
                label: null,
                lat: null,
                lng: null
            },
            duration: "",
            frames: []
        },
        player: {
            domElement: null,
            mode: "background"
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
        base.log("Constructing");
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
        if (typeof base.scenes[name] === "undefined") {
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
            base.debug.log("SVA [Movie]:", arguments);
        } else {
            base.debug.log("SVA [Movie]:", item);
        }
        return base;
    };
    return base.__construct();
};

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
        base.log("Constructing");
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
            movieInstance.debug.log("SVA [Player]:", arguments);
        } else {
            movieInstance.debug.log("SVA [Player]:", item);
        }
        return base;
    };
    // --------------------------------------------------------------------------
    return base.__construct();
};

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
    base.apiKey = options.apiKey;
    // --------------------------------------------------------------------------
    base.__construct = function() {
        base.log("Constructing");
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
            movieInstance.debug.log("SVA [Router]:", arguments);
        } else {
            movieInstance.debug.log("SVA [Router]:", item);
        }
        return base;
    };
    // --------------------------------------------------------------------------
    return base.__construct();
};

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
        base.log("Constructing ");
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
        base.log("Setting options");
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
        if (typeof base.clip[name] === "undefined") {
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
        /**
         * If additional items have been passed then send the `arguments` array
         * to the logger, otherwise log the single item.
         */
        if (arguments.length > 1) {
            base.movie.debug.log("SVA [Scene: " + base.name + "]:", arguments);
        } else {
            base.movie.debug.log("SVA [Scene: " + base.name + "]:", item);
        }
        return base;
    };
    // --------------------------------------------------------------------------
    return base.__construct();
};
//# sourceMappingURL=streetviewanimator.js.map