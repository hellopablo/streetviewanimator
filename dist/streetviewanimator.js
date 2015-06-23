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
                    if (typeof items !== "undefined") {
                        for (var x = 0; x < items.length; x++) {
                            args.push(items[x]);
                        }
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
     * @return {Object}
     */
    base.log = function() {
        $SVA.debug.log("SVA [Map]:", arguments);
        return base;
    };
    // --------------------------------------------------------------------------
    /**
     * Sends an item to the error log, prefixing it with a string so that the class
     * making the log is easily identifiable
     * @return {Object}
     */
    base.error = function() {
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
        debug: false,
        playerDebug: false,
        router: {
            apiKey: null
        },
        player: {
            frameRate: 12,
            frameWidth: 600,
            frameHeight: 338,
            domElement: null,
            mode: "background"
        },
        scenes: [],
        //  Events
        onReady: function() {},
        onSceneCreate: function(scene) {},
        onSceneUpdate: function(scene) {},
        onSceneDestroy: function() {},
        onGenerateStart: function() {},
        onGenerateEnd: function() {},
        //  Player Events
        onPlayerReady: function(player) {},
        onPlayerLoadStart: function(player) {},
        onPlayerLoadStop: function(player) {},
        onPlayerLoadProgress: function(player, lastFrameLoaded, totalFrames, percentageLoaded) {},
        onPlayerLoadComplete: function(player) {},
        onPlayerPlay: function(player) {},
        onPlayerBufferStart: function(player) {},
        onPlayerBufferStop: function(player) {},
        onPlayerStop: function(player) {},
        onPlayerEnterFrame: function(player, currentFrame) {},
        onPlayerExitFrame: function(player, currentFrame) {},
        onPlayerLoop: function(player) {},
        onPlayerReset: function(player) {}
    };
    // --------------------------------------------------------------------------
    /**
     * Holds references to each scene within the movie
     * @type {Object}
     */
    base.scenes = {};
    // --------------------------------------------------------------------------
    /**
     * Holds whether the movie has been generated or not
     * @type {Boolean}
     */
    base.generated = false;
    // --------------------------------------------------------------------------
    /**
     * Whether the generation process is in progress
     * @type {Boolean}
     */
    base.isGenerating = false;
    // --------------------------------------------------------------------------
    /**
     * Constructs the movie
     * @return {Object}
     */
    base.__construct = function() {
        base.options = $.extend(true, base.options, options);
        //  Are we turning debugging on?
        if (base.options.debug) {
            $SVA.debug.enabled = true;
        }
        if (base.options.playerDebug) {
            base.options.player.debug = true;
        }
        base.log("Constructing");
        //  Setup singletons
        base.router = new $SVA.router(base.options.router, base);
        //  And finally the player, check it exists first
        if (typeof window.frameplayer === "undefined") {
            throw "Dependency FramePlayer is not available http://hellopablo.github.io/frameplayer";
        } else {
            base.options.player.onReady = function() {
                base.options.onPlayerReady.call(this);
            };
            base.options.player.onLoadStart = function() {
                base.options.onPlayerLoadStart.call(this);
            };
            base.options.player.onLoadStop = function() {
                base.options.onPlayerLoadStop.call(this);
            };
            base.options.player.onLoadProgress = function(lastFrameLoaded, totalFrames, percentageLoaded) {
                base.options.onPlayerLoadProgress.call(this, lastFrameLoaded, totalFrames, percentageLoaded);
            };
            base.options.player.onLoadComplete = function() {
                base.options.onPlayerLoadComplete.call(this);
            };
            base.options.player.onPlay = function() {
                base.options.onPlayerPlay.call(this);
            };
            base.options.player.onBufferStart = function() {
                base.options.onPlayerBufferStart.call(this);
            };
            base.options.player.onBufferStop = function() {
                base.options.onPlayerBufferStop.call(this);
            };
            base.options.player.onStop = function() {
                base.options.onPlayerStop.call(this);
            };
            base.options.player.onEnterFrame = function(currentFrame) {
                base.options.onPlayerEnterFrame.call(this, currentFrame);
            };
            base.options.player.onExitFrame = function(currentFrame) {
                base.options.onPlayerExitFrame.call(this, currentFrame);
            };
            base.options.player.onLoop = function() {
                base.options.onPlayerLoop.call(this);
            };
            base.options.player.onReset = function() {
                base.options.onPlayerReset.call(this);
            };
            base.player = new window.frameplayer.player(base.options.player, base);
        }
        // --------------------------------------------------------------------------
        //  Setup any predefined scenes
        if (base.options.scenes.length) {
            for (var i = 0; i < base.options.scenes.length; i++) {
                base.scene(base.options.scenes[i].id, base.options.scenes[i]);
            }
        }
        // --------------------------------------------------------------------------
        //  Fire the `onReady` event
        base.options.onReady.call(base);
        // --------------------------------------------------------------------------
        return base;
    };
    // --------------------------------------------------------------------------
    /**
     * Create, edit or fetch a scene instance
     * @param  {String} sceneId The scene ID
     * @param  {Object} options The scene options
     * @return {Object}
     */
    base.scene = function(sceneId, options) {
        //  Create a new scene if one doesn't exist by that ID and options have been supplied
        if (typeof base.scenes[sceneId] === "undefined") {
            //  Create new scene
            base.scenes[sceneId] = new $SVA.scene(sceneId, options, base);
            //  Mark the movie as not generated, new scenes require processing
            base.generated = false;
            //  Fire the `onSceneCreate` event
            base.options.onSceneCreate.call(base, base.scenes[sceneId]);
        } else {
            //  Update existing scene
            base.scenes[sceneId].setOptions(options);
            //  Mark the movie as not generated, updated scenes require processing
            //  @todo Determine if a scene has *actually* been updated
            base.generated = false;
            //  Fire the `onSceneUpdate` event
            base.options.onSceneUpdate.call(base, base.scenes[sceneId]);
        }
        return base.scenes[sceneId];
    };
    // --------------------------------------------------------------------------
    /**
     * Returns the number of scenes in the movie
     * @return {Number}
     */
    base.getNumScenes = function() {
        var numScenes = 0;
        for (var key in base.scenes) {
            numScenes++;
        }
        return numScenes;
    };
    // --------------------------------------------------------------------------
    /**
     * Returns the number of scenes in the movie
     * @return {Number}
     */
    base.getNumFrames = function() {
        var numFrames = 0;
        var sceneNumFrames;
        for (var key in base.scenes) {
            sceneNumFrames = base.scenes[key].getNumFrames();
            base.log("Scene [" + key + "] has " + sceneNumFrames + " frames");
            numFrames += sceneNumFrames;
        }
        return numFrames;
    };
    // --------------------------------------------------------------------------
    /**
     * Generates the movie
     * @return {Object} A jQuery promise
     */
    base.generate = function() {
        //  Ignore other calls to this method if currently generating
        if (base.isGenerating) {
            base.warn("Generation in progress, ignoring call");
            return false;
        } else {
            base.log("Beginning scene generation");
            base.isGenerating = true;
            base.options.onGenerateStart.call(base);
        }
        var deferred = new $.Deferred();
        if (!base.requiresGeneration()) {
            base.isGenerating = false;
            base.generated = true;
            base.log("Movie is already generated");
            deferred.resolve(deferred);
        } else {
            //  Process each scene, once they are all processed resolve the promise
            base.doGenerate(deferred);
        }
        //  Fired when generation is complete
        deferred.done(function() {
            base.isGenerating = false;
            base.generated = true;
            base.log("Completed movie generation");
            base.options.onGenerateEnd.call(base);
        });
        return deferred.promise();
    };
    // --------------------------------------------------------------------------
    base.doGenerate = function(deferred) {
        //  Find a scene which has not been generated
        var scene;
        for (var key in base.scenes) {
            if (base.scenes[key].requiresGeneration()) {
                scene = base.scenes[key];
                break;
            }
        }
        if (scene) {
            scene.generate().done(function() {
                //  Generation of this scene complete, try again
                base.doGenerate(deferred);
            });
        } else {
            //  No scenes to generate
            base.log("No scenes require generation");
            deferred.resolve();
        }
    };
    // --------------------------------------------------------------------------
    /**
     * Returns whether the movie requires generation
     * @return {Boolean}
     */
    base.requiresGeneration = function() {
        return !base.generated;
    };
    // --------------------------------------------------------------------------
    /**
     * Begin playback
     * @return {Object} A jQuery promise
     */
    base.play = function() {
        var deferred = new $.Deferred();
        if (base.requiresGeneration()) {
            //  Once generated, set all the player frames, and begin playback
            base.generate().done(function() {
                //  Set frames
                base.log("Setting frames in player");
                base.player.reset(true);
                for (var key in base.scenes) {
                    base.log("Setting frames for scene [" + key + "]");
                    base.player.addFrames(base.scenes[key].getFrames());
                }
                //  Begin playback
                base.log("Beginning playback");
                base.player.play();
                deferred.resolve();
            });
        } else {
            //  Already generated
            //  Set frames
            base.log("Setting frames in player");
            base.player.reset(true);
            for (var key in base.scenes) {
                base.log("Setting frames for scene [" + key + "]");
                base.player.addFrames(base.scenes[key].getFrames());
            }
            base.log("Beginning playback");
            base.player.play();
            deferred.resolve();
        }
        return deferred.promise();
    };
    // --------------------------------------------------------------------------
    /**
     * Stop playback
     * @return {Object}
     */
    base.stop = function() {
        base.player.stop();
        return base;
    };
    // --------------------------------------------------------------------------
    /**
     * Sends an item to the log, prefixing it with a string so that the class
     * making the log is easily identifiable
     * @return {Object}
     */
    base.log = function() {
        $SVA.debug.log("SVA [Movie]:", arguments);
        return base;
    };
    // --------------------------------------------------------------------------
    /**
     * Sends an item to the error log, prefixing it with a string so that the class
     * making the log is easily identifiable
     * @return {Object}
     */
    base.warn = function() {
        $SVA.debug.warn("SVA [Movie]:", arguments);
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
    /**
     * The API key to use when communicating with Google
     * @type {String}
     */
    base.apiKey = options.apiKey;
    // --------------------------------------------------------------------------
    base.__construct = function() {
        base.log("Constructing");
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
        $SVA.debug.log("SVA [Router]:", arguments);
        return base;
    };
    // --------------------------------------------------------------------------
    /**
     * Sends an item to the error log, prefixing it with a string so that the class
     * making the log is easily identifiable
     * @return {Object}
     */
    base.error = function() {
        $SVA.debug.error("SVA [Router]:", arguments);
        return base;
    };
    // --------------------------------------------------------------------------
    return base.__construct();
};

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
    base.type = options.type || "AUTO";
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
        base.log("Constructing");
        base.log("Scene Type: " + base.type);
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
        if (typeof newOptions.type !== "undefined") {
            base.type = options.type || "AUTO";
        }
        if (typeof newOptions.origin !== "undefined") {
            base.origin = options.origin || null;
        }
        if (typeof newOptions.destination !== "undefined") {
            base.destination = options.destination || null;
        }
        if (typeof newOptions.duration !== "undefined") {
            base.duration = options.duration || 5;
        }
        if (typeof newOptions.target !== "undefined") {
            base.target = options.target || null;
        }
        if (typeof newOptions.pitch !== "undefined") {
            base.pitch = options.pitch || 10;
        }
        if (typeof newOptions.fov !== "undefined") {
            base.fov = options.fov || 10;
        }
        if (typeof newOptions.frames !== "undefined") {
            base.frames = options.frames || [];
        }
        // --------------------------------------------------------------------------
        if (base.type === "MANUAL") {
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
        if (base.type === "AUTO") {
            if (!base.origin) {
                throw "An origin must be specified";
            } else if (base.origin !== null && typeof base.origin === "object") {
                if (typeof base.origin.lat === "undefined" || !base.origin.lat.length) {
                    throw "If origin is supplied as an object, the lat property cannot be empty";
                }
                if (typeof base.origin.lng === "undefined" || !base.origin.lng.length) {
                    throw "If origin is supplied as an object, the lng property cannot be empty";
                }
            }
            if (!base.destination) {
                throw "An destination must be specified";
            } else if (base.destination !== null && typeof base.destination === "object") {
                if (typeof base.destination.lat === "undefined" || !base.destination.lat.length) {
                    throw "If destination is supplied as an object, the lat property cannot be empty";
                }
                if (typeof base.destination.lng === "undefined" || !base.destination.lng.length) {
                    throw "If destination is supplied as an object, the lng property cannot be empty";
                }
            }
            if (base.target !== null && typeof base.target === "object") {
                if (typeof base.target.lat === "undefined" || !base.target.lat.length) {
                    throw "If target is supplied as an object, the lat property cannot be empty";
                }
                if (typeof base.target.lng === "undefined" || !base.target.lng.length) {
                    throw "If target is supplied as an object, the lng property cannot be empty";
                }
            }
        } else if (base.type === "MANUAL") {
            if (!base.frames.length) {
                throw "Scenes of type MANUAL must define at least 1 frame";
            }
        } else {
            throw 'Invalid scene type "' + base.type + '"';
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
            base.log("Generation not required");
            deferred.resolve();
        } else {
            //  Begin generation
            base.log("Requires generation");
            base.log("Beginning generation");
            base.log("Completed generation");
            base.frames = [ "http://lorempixel.com/600/338/people", "http://lorempixel.com/600/338/abstract", "http://lorempixel.com/600/338/animals", "http://lorempixel.com/600/338/food" ];
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
        $SVA.debug.log("SVA [Scene:" + base.getId() + "]:", arguments);
        return base;
    };
    // --------------------------------------------------------------------------
    /**
     * Sends an item to the error log, prefixing it with a string so that the class
     * making the log is easily identifiable
     * @return {Object}
     */
    base.error = function() {
        $SVA.debug.error("SVA [Scene:" + base.getId() + "]:", arguments);
        return base;
    };
    // --------------------------------------------------------------------------
    return base.__construct();
};
//# sourceMappingURL=streetviewanimator.js.map