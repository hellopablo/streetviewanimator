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
        $SVA.debug.log("SVA [Clip]:", arguments);
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
        $SVA.debug.error("SVA [Clip]:", arguments);
        return base;
    };
    // --------------------------------------------------------------------------
    return base.__construct();
};

/**
 * This class provides debugging functionality to StreetView Animator
 * @return {Object}
 */
window.streetviewanimator.debug = {
    /**
     * Whether debugging is enabled or not
     * @type {Boolean}
     */
    enabled: false,
    // --------------------------------------------------------------------------
    /**
     * Renders a `log` call to the console
     * @param  {String} caller The calling class
     * @param  {Mixed}  items  The item(s) to log
     * @return {Object}
     */
    log: function(caller, items) {
        return this.execConsoleFunc("log", caller, items);
    },
    // --------------------------------------------------------------------------
    /**
     * Renders an `info` call to the console
     * @param  {String} caller The calling class
     * @param  {Mixed}  items  The item(s) to log
     * @return {Object}
     */
    info: function(caller, items) {
        return this.execConsoleFunc("info", caller, items);
    },
    // --------------------------------------------------------------------------
    /**
     * Renders a `warn` call to the console
     * @param  {String} caller The calling class
     * @param  {Mixed}  items  The item(s) to log
     * @return {Object}
     */
    warn: function(caller, items) {
        return this.execConsoleFunc("warn", caller, items);
    },
    // --------------------------------------------------------------------------
    /**
     * Renders an `error` call to the console
     * @param  {String} caller The calling class
     * @param  {Mixed}  items  The item(s) to log
     * @return {Object}
     */
    error: function(caller, items) {
        return this.execConsoleFunc("error", caller, items);
    },
    // --------------------------------------------------------------------------
    /**
     * Prepares the arguments and executes the console method
     * @param  {String} method The console method to call
     * @param  {String} caller The calling class
     * @param  {Mixed}  items  The item(s) to log
     * @return {Object}
     */
    execConsoleFunc: function(method, caller, items) {
        if (this.enabled && typeof console !== "undefined") {
            var methods = [ "log", "info", "warn", "error" ];
            for (var i = methods.length - 1; i >= 0; i--) {
                if (methods[i] === method && typeof console[methods[i]] === "function") {
                    var args = [ caller ];
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
        $SVA.debug.log("SVA [Map]:", arguments);
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
        $SVA.debug.error("SVA [Map]:", arguments);
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
        debug: {
            enabled: false
        },
        router: {
            apiKey: null
        },
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
            frameRate: 12,
            frameWidth: 600,
            frameHeight: 300,
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
        /**
         * Pass the global debug parameter into the player options if it's
         * not been defined.
         */
        if (typeof base.options.player.debug === "undefined") {
            base.options.player.debug = {
                enabled: base.options.debug.enabled
            };
        }
        //  Are we turning debugging on?
        if (base.options.debug.enabled) {
            $SVA.debug.enabled = true;
        }
        base.log("Constructing");
        //  Setup singletons
        base.router = new $SVA.router(base.options.router, base);
        //  And finally the player, check it exists first
        if (typeof window.frameplayer === "undefined") {
            base.error("Dependency FramePlayer is not available http://hellopablo.github.io/frameplayer");
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
        $SVA.debug.log("SVA [Movie]:", arguments);
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
        $SVA.debug.error("SVA [Movie]:", arguments);
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
        $SVA.debug.log("SVA [Router]:", arguments);
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
        $SVA.debug.error("SVA [Router]:", arguments);
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
        $SVA.debug.log("SVA [Scene]:", arguments);
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
        $SVA.debug.error("SVA [Scene]:", arguments);
        return base;
    };
    // --------------------------------------------------------------------------
    return base.__construct();
};
//# sourceMappingURL=streetviewanimator.js.map