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
        frameWidth: 600,
        frameHeight: 338,
        player: {
            frameRate: 12,
            domElement: null
        },
        scenes: [],
        //  Events
        onReady: function() {},
        onSceneCreate: function(scene) {},
        onSceneUpdate: function(scene) {},
        onSceneDestroy: function() {},
        onGenerateStart: function() {},
        onGenerateEnd: function() {},
        onReset: function() {},
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
        onPlayerReset: function(player) {},
        //  Custom player events
        onPlayerEnterScene: function(player, scene) {},
        onPlayerExitScene: function(player, scene) {}
    };
    // --------------------------------------------------------------------------
    /**
     * Holds references to each scene within the movie
     * @type {Object}
     */
    base.scenes = {};
    // --------------------------------------------------------------------------
    /**
     * An array of scene's first frames
     * @type {Object}
     */
    base.sceneStartFrames = {};
    // --------------------------------------------------------------------------
    /**
     * An array of scene's first frames
     * @type {Object}
     */
    base.sceneStopFrames = {};
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
     * Holds the router instance
     * @type {Object}
     */
    base.router = null;
    // --------------------------------------------------------------------------
    /**
     * Holds the player instance
     * @type {Object}
     */
    base.player = null;
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
        //  Reset everything
        base.doReset();
        //  Setup singletons
        base.router = new $SVA.router(base.options.router, base);
        //  And finally the player, check it exists first
        if (typeof window.frameplayer === "undefined") {
            throw "Dependency FramePlayer is not available http://hellopablo.github.io/frameplayer";
        } else {
            base.options.player.playerWidth = base.options.frameWidth;
            base.options.player.playerHeight = base.options.frameHeight;
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
                base.playerEnterFrame.call(base, currentFrame);
                base.options.onPlayerEnterFrame.call(this);
            };
            base.options.player.onExitFrame = function(currentFrame) {
                base.playerExitFrame.call(base, currentFrame);
                base.options.onPlayerExitFrame.call(this);
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
            //  Update the player element so some visual feedback can be given easily
            base.player.element.addClass("generating");
            //  Fire the `onGenerateStart` event
            base.options.onGenerateStart.call(base);
        }
        var deferred = new $.Deferred();
        if (!base.requiresGeneration()) {
            base.log("Movie is already generated");
            //  Reset local variables
            base.isGenerating = false;
            base.generated = true;
            //  Resolve the promise
            deferred.resolve(deferred);
        } else {
            //  Process each scene
            base.doGenerate(deferred);
        }
        //  Fired when generation is complete
        deferred.done(function() {
            base.log("Completed movie generation");
            //  Reset local variables
            base.isGenerating = false;
            base.generated = true;
            //  Update the player element so some visual feedback can be given easily
            base.player.element.removeClass("generating");
            //  Fire the `onGenerateEnd` event
            base.options.onGenerateEnd.call(base);
        });
        return deferred.promise();
    };
    // --------------------------------------------------------------------------
    /**
     * The callback function which generates each scene
     * @param  {Object} deferred The deferred object to resolve
     * @return {Void}
     */
    base.doGenerate = function(deferred) {
        if (!base.getNumScenes()) {
            base.warn("No scenes are present in the movie");
            deferred.resolve();
        } else {
            //  Find a scene which has not been generated
            var scene;
            for (var key in base.scenes) {
                if (base.scenes[key].requiresGeneration()) {
                    scene = base.scenes[key];
                    break;
                }
            }
            if (scene) {
                scene.generate().fail(function(data) {
                    base.warn("Scene [" + scene.getId() + "] failed to generate: " + data.error);
                }).always(function() {
                    //  Generation of this scene complete, try again
                    base.doGenerate(deferred);
                });
            } else {
                //  No scenes to generate
                base.log("No scenes require generation");
                deferred.resolve();
            }
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
            base.log("Movie requires generation prior to playback");
            base.generate().done(function() {
                base.resolvePlay(deferred);
            });
        } else {
            //  Already generated
            base.resolvePlay(deferred);
        }
        return deferred.promise();
    };
    // --------------------------------------------------------------------------
    /**
     * Set the player frames and a note the start/end frames (for the callbacks)
     * @param  {Object} deferred The deferred object to resolve
     * @return {Void}
     */
    base.resolvePlay = function(deferred, resetPlayer) {
        base.log("Setting frames in player and calculating start/end frames");
        base.player.reset(true);
        base.sceneStartFrames = {};
        base.sceneStopFrames = {};
        var lastStartFrame = 0;
        var lastEndFrame = -1;
        for (var key in base.scenes) {
            base.log("Setting frames for scene [" + key + "]");
            base.player.addFrames(base.scenes[key].getFrames());
            //  Set the start frame, it's the lastEndFrame + 1
            lastStartFrame = lastEndFrame + 1;
            base.sceneStartFrames["frame" + lastStartFrame] = base.scenes[key];
            //  Set the end frame, it's the start frame + number of frames
            lastEndFrame = lastStartFrame + base.scenes[key].getNumFrames() - 1;
            base.sceneStopFrames["frame" + lastEndFrame] = base.scenes[key];
        }
        //  Begin playback
        base.log("Beginning playback");
        base.player.play();
        //  Resolve the promise
        deferred.resolve();
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
     * Called when the player enters a frame and calculates whether it's the exit
     * frame of a scene, if so it triggers the `onEnterScene` event
     * @param  {Number} currentFrame The current frame
     * @return {Void}
     */
    base.playerEnterFrame = function(currentFrame) {
        var methodName = "frame" + currentFrame;
        if (typeof base.sceneStartFrames[methodName] === "object") {
            base.log("Entering Scene:" + base.sceneStartFrames[methodName].getId());
            base.options.onPlayerEnterScene.call(base.player, base.sceneStartFrames[methodName]);
        }
    };
    // --------------------------------------------------------------------------
    /**
     * Called when the player exists a frame and calculates whether it's the exit
     * frame of a scene, if so it triggers the `onExitScene` event
     * @param  {Number} currentFrame The current frame
     * @return {Void}
     */
    base.playerExitFrame = function(currentFrame) {
        var methodName = "frame" + currentFrame;
        if (typeof base.sceneStopFrames[methodName] === "object") {
            base.log("Exiting Scene:" + base.sceneStopFrames[methodName].getId());
            base.options.onPlayerExitScene.call(base.player, base.sceneStopFrames[methodName]);
        }
    };
    // --------------------------------------------------------------------------
    /**
     * Resets the movie to it's default state
     * @return {Object}
     */
    base.reset = function() {
        base.log("Resetting");
        base.doReset();
        base.options.onReset.call(base);
    };
    // --------------------------------------------------------------------------
    /**
     * Actually performs the reset, without any calls to the log or firing the
     * reset event
     * @return {Void}
     */
    base.doReset = function() {
        //  Local properties
        base.scenes = {};
        base.sceneStartFrames = {};
        base.sceneStopFrames = {};
        base.generated = false;
        base.isGenerating = false;
        //  Player
        if (base.player) {
            base.player.reset();
        }
        //  Router
        if (base.router) {
            base.router.reset();
        }
    };
    // --------------------------------------------------------------------------
    /**
     * Set the player's framerate
     * @param {Number} frameRate The framerate to use
     * @return {Object}
     */
    base.setFrameRate = function(frameRate) {
        base.log("Changing framerate from " + base.options.player.frameRate + " to " + frameRate);
        base.options.player.frameRate = parseInt(frameRate, 10);
        return base;
    };
    // --------------------------------------------------------------------------
    /**
     * Set the player's framesize
     * @param {Number} width  The width of each frame
     * @param {Number} height The height of each frame
     * @return {Object}
     */
    base.setFrameSize = function(width, height) {
        base.log("Changing framesize from " + base.options.frameWidth + "x" + base.options.frameHeight + " to " + width + "x" + height);
        base.options.frameWidth = parseInt(width, 10);
        base.options.frameHeight = parseInt(height, 10);
        return base;
    };
    // --------------------------------------------------------------------------
    base.setPlayerSize = function(width, height) {
        base.log("Changing framesize from " + base.options.frameWidth + "x" + base.options.frameHeight + " to " + width + "x" + height);
        base.player.setPlayerSize(width, height);
        return base;
    };
    // --------------------------------------------------------------------------
    /**
     * Set the API key to use when contacting Google
     * @param {String} apiKey The API Key to use
     */
    base.setApiKey = function(apiKey) {
        base.log("Changing API key from " + base.options.router.apiKey + " to " + apiKey);
        base.router.setApiKey(apiKey);
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
    /**
     * Holds an instance of the direction service
     * @type {Object}
     */
    base.directionService = null;
    // --------------------------------------------------------------------------
    /**
     * Holds an instance of the geocoder
     * @type {Object}
     */
    base.geocoder = null;
    // --------------------------------------------------------------------------
    /**
     * Computes the heading between two points
     * @type {Object}
     */
    base.computeHeading = null;
    // --------------------------------------------------------------------------
    /**
     * A cache of geocoded strings
     * @type {Array}
     */
    base.geocodeCache = [];
    // --------------------------------------------------------------------------
    base.__construct = function() {
        base.log("Constructing");
        base.doReset();
        //  Instanciate the Google services
        if (typeof window.google !== "undefined" && typeof window.google.maps !== "undefined") {
            if (typeof window.google.maps.DirectionsService !== "undefined") {
                base.directionService = new window.google.maps.DirectionsService();
            } else {
                throw "Google Maps Direction Service not available";
            }
            if (typeof window.google.maps.Geocoder !== "undefined") {
                base.geocoder = new window.google.maps.Geocoder();
            } else {
                throw "Google Maps Geocoder not available";
            }
            if (typeof window.google.maps.geometry !== "undefined") {
                base.computeHeading = window.google.maps.geometry.spherical.computeHeading;
            } else {
                throw "Google Maps Geometry library not available";
            }
        } else {
            throw "Google Maps Libraries were not found";
        }
    };
    // --------------------------------------------------------------------------
    /**
     * Set the API key to use when communicating with Google
     * @param {String} apiKey The API key to use
     */
    base.setApiKey = function(apiKey) {
        base.apiKey = apiKey;
        return base;
    };
    // --------------------------------------------------------------------------
    base.reset = function() {
        base.log("Resetting");
        base.doReset();
    };
    // --------------------------------------------------------------------------
    base.doReset = function() {
        base.geocodeCache = [];
    };
    // --------------------------------------------------------------------------
    /**
     * Geocode a string and get the coordinates
     * @param  {String} address The address to geocode
     * @return {Object}         A jQuery promise
     */
    base.getCoordinatesFromAddress = function(address) {
        var deferred = new $.Deferred();
        base.log('Geocoding "' + address + '"');
        base.geocoder.geocode({
            address: address
        }, function(results, status) {
            if (status === window.google.maps.GeocoderStatus.OK) {
                base.log("Successfully geocoded " + address);
                base.log("Lat: " + results[0].geometry.location.lat());
                base.log("Lng: " + results[0].geometry.location.lng());
                var coordinates = {
                    lat: results[0].geometry.location.lat(),
                    lng: results[0].geometry.location.lng()
                };
                deferred.resolve(coordinates);
            } else {
                base.log('"' + address + '" could not be geocoded');
                deferred.reject({
                    error: 'Failed to geocode "' + address + '".',
                    response: results
                });
            }
        });
        return deferred.promise();
    };
    // --------------------------------------------------------------------------
    /**
     * Returns directions between two coordinates
     * @return {Object} A jQuery promise
     */
    base.getDirections = function(origin, destination, travelMode) {
        var deferred, originObj, destinationObj, request;
        deferred = new $.Deferred();
        originObj = new window.google.maps.LatLng(origin.lat, origin.lng);
        destinationObj = new window.google.maps.LatLng(destination.lat, destination.lng);
        travelMode = travelMode || window.google.maps.DirectionsTravelMode.DRIVING;
        request = {
            origin: originObj,
            destination: destinationObj,
            travelMode: travelMode
        };
        base.log("Getting " + travelMode + " directions", request);
        base.directionService.route(request, function(response, status) {
            if (status === window.google.maps.DirectionsStatus.OK) {
                base.log("Directions received");
                deferred.resolve(response);
            } else {
                base.log("Directions failed: ", status);
                deferred.reject({
                    error: 'Failed to get directions, received status "' + status + '"',
                    response: response
                });
            }
        });
        return deferred.promise();
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
     * required if type is set to AUTO or SWEEP
     * @type {Mixed}
     */
    base.origin = options.origin || null;
    // --------------------------------------------------------------------------
    /**
     * The scene's starting heading as an number required if type is set to SWEEP
     * @type {Mixed}
     */
    base.startHeading = options.startHeading || 0;
    // --------------------------------------------------------------------------
    /**
     * The scene's finish heading as an number required if type is set to SWEEP
     * @type {Mixed}
     */
    base.finishHeading = options.finishHeading || 360;
    // --------------------------------------------------------------------------
    /**
     * The scene's destination as either a string or a {lat:null,lng:null} object,
     * required if type is set to AUTO
     * @type {Mixed}
     */
    base.destination = options.destination || null;
    // --------------------------------------------------------------------------
    /**
     * The travel mode to use when calculating the route between the origin and
     * the destination
     * @type {String}
     */
    base.travelMode = options.travelMode || null;
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
            if (typeof base.origin === "string") {
                if (!base.origin.length) {
                    base.warn(typeof base.origin, base.origin);
                    throw "An origin must be specified";
                }
            } else if (typeof base.origin === "object" && base.origin !== null) {
                base.origin.lat = parseFloat(base.origin.lat, 10) || 0;
                if (!base.origin.lng) {
                    base.warn(typeof base.origin, base.origin);
                    throw "If origin is supplied as an object, the lat property cannot be empty";
                }
                base.origin.lng = parseFloat(base.origin.lng, 10) || 0;
                if (!base.origin.lng) {
                    base.warn(typeof base.origin, base.origin);
                    throw "If origin is supplied as an object, the lng property cannot be empty";
                }
            } else {
                base.warn(typeof base.origin, base.origin);
                throw "Invalid data type for origin, or origin missing; valid data types are string or object literal";
            }
            // --------------------------------------------------------------------------
            if (typeof base.destination === "string") {
                if (!base.destination.length) {
                    base.warn(typeof base.destination, base.destination);
                    throw "An destination must be specified";
                }
            } else if (typeof base.destination === "object" && base.destination !== null) {
                base.destination.lat = parseFloat(base.destination.lat, 10) || 0;
                if (!base.destination.lng) {
                    base.warn(typeof base.destination, base.destination);
                    throw "If destination is supplied as an object, the lat property cannot be empty";
                }
                base.destination.lng = parseFloat(base.destination.lng, 10) || 0;
                if (!base.destination.lng) {
                    base.warn(typeof base.destination, base.destination);
                    throw "If destination is supplied as an object, the lng property cannot be empty";
                }
            } else {
                base.warn(typeof base.destination, base.destination);
                throw "Invalid data type for destination, or destination missing; valid data types are string or object literal";
            }
            // --------------------------------------------------------------------------
            if (typeof base.target === "object" && base.target !== null) {
                base.target.lat = parseFloat(base.target.lat, 10) || 0;
                if (!base.target.lng) {
                    base.warn(typeof base.target, base.target);
                    throw "If target is supplied as an object, the lat property cannot be empty";
                }
                base.target.lng = parseFloat(base.target.lng, 10) || 0;
                if (!base.target.lng) {
                    base.warn(typeof base.target, base.target);
                    throw "If target is supplied as an object, the lng property cannot be empty";
                }
            }
        } else if (base.type === "SWEEP") {
            if (typeof base.origin === "string") {
                if (!base.origin.length) {
                    base.warn(typeof base.origin, base.origin);
                    throw "An origin must be specified";
                }
            } else if (typeof base.origin === "object" && base.origin !== null) {
                base.origin.lat = parseFloat(base.origin.lat, 10) || 0;
                if (!base.origin.lng) {
                    base.warn(typeof base.origin, base.origin);
                    throw "If origin is supplied as an object, the lat property cannot be empty";
                }
                base.origin.lng = parseFloat(base.origin.lng, 10) || 0;
                if (!base.origin.lng) {
                    base.warn(typeof base.origin, base.origin);
                    throw "If origin is supplied as an object, the lng property cannot be empty";
                }
            } else {
                base.warn(typeof base.origin, base.origin);
                throw "Invalid data type for origin, or origin missing; valid data types are string or object literal";
            }
            if (base.finishHeading <= base.startHeading) {
                base.warn(base.startHeading, base.finishHeading);
                throw "finishHeading must be greater than startHeading";
            } else if (base.finishHeading > 360) {
                base.warn(base.finishHeading);
                throw "finishHeading cannot be greater than 360";
            } else if (base.startHeading < 0) {
                base.warn(base.startHeading);
                throw "startHeading cannot be less than 0";
            }
        } else if (base.type === "MANUAL") {
            if (!base.frames.length) {
                throw "Scenes of type MANUAL must define at least 1 frame";
            }
        } else {
            throw 'Invalid scene type "' + base.type + '"';
        }
        // --------------------------------------------------------------------------
        /**
         * If the origin, destination or target are strings and are lat/lng coordinates
         * (i.e., in the format Number,Number) then translate them into an object.
         */
        var properties = [ "origin", "destination", "target" ];
        var regex = /^-?\d+(\.\d+),-?\d+(\.\d+)$/;
        var bits = null;
        for (var i = properties.length - 1; i >= 0; i--) {
            if (typeof base[properties[i]] === "string" && regex.test(base[properties[i]])) {
                bits = base[properties[i]].split(",");
                base[properties[i]] = {
                    lat: parseFloat(bits[0], 10),
                    lng: parseFloat(bits[1], 10)
                };
            }
        }
        // --------------------------------------------------------------------------
        return base;
    };
    // --------------------------------------------------------------------------
    /**
     * Process the scene and generate the frames
     * @return {Object} A jQuery promise
     */
    base.generate = function() {
        var deferred = new $.Deferred();
        if (base.type === "MANUAL" || !base.requiresGeneration()) {
            base.log("Generation not required");
            deferred.resolve();
        } else if (base.type === "AUTO") {
            //  Begin generation
            base.log("Requires generation");
            base.log("Beginning generation");
            //  Reset frame stack
            base.frames = [];
            /**
             * Here is where the magic happens. We need to generate our frames
             * based on the supplied location data.
             *
             * 1. Work out the route between the origin and the destination
             * 2. Pick out the right number of points/steps to satisfy the
             *    duration of the scene.
             * 3. Process each point, generating the streetview URL and save
             *    to the frame stack.
             * 4. Resolve the process so the generator can continue
             */
            //  Geocode anything which needs geocoded
            base.geocodePoints(deferred).done(function() {
                //  Everything has been geocoded, now get directions
                base.log("Getting directions between origin and destination");
                base.movie.router.getDirections(base.origin, base.destination, base.travelMode).done(function(data) {
                    //  Process the waypoints, only do enough to satisfy the scene duration
                    var maxFrames = base.movie.player.options.frameRate * base.duration;
                    base.log(base.movie.player.options.frameRate, base.duration);
                    for (var points = [], i = 0, s = data.routes[0].legs.length; s > i; i++) {
                        for (var r = 0, u = data.routes[0].legs[i].steps.length; u > r; r++) {
                            for (var d = 0, g = data.routes[0].legs[i].steps[r].lat_lngs.length; g > d; d++) {
                                if (points.length < maxFrames) {
                                    points.push(data.routes[0].legs[i].steps[r].lat_lngs[d]);
                                }
                            }
                        }
                    }
                    base.log("Successfully extracted " + points.length + " waypoints");
                    base.log("Processing waypoints");
                    var logPrefix, heading, url, targetObj;
                    if (base.target !== null) {
                        targetObj = new window.google.maps.LatLng(base.target.lat, base.target.lng);
                    }
                    for (i = 0; i < points.length; i++) {
                        logPrefix = "Waypoint " + i + " (" + points[i].lat() + ", " + points[i].lng() + "): ";
                        if (typeof points[i + 1] !== "undefined") {
                            base.log(logPrefix + "Determining heading");
                            /**
                             * If a target is deifned, look at it, otherwise look at the next
                             * way point.
                             */
                            if (base.target !== null) {
                                heading = base.movie.router.computeHeading(points[i], targetObj);
                            } else {
                                heading = base.movie.router.computeHeading(points[i], points[i + 1]);
                            }
                            base.log(logPrefix + "Generating StreetView URL");
                            url = base.generateStreetViewUrl(points[i].lat(), points[i].lng(), heading);
                        } else {
                            //  Last frame
                            base.log(logPrefix + "Last frame");
                            base.log(logPrefix + "Determining heading");
                            /**
                             * If a target is deifned, look at it, otherwise look in the same
                             * direction as the previous waypoint.
                             */
                            if (base.target !== null) {
                                heading = base.movie.router.computeHeading(points[i], targetObj);
                            } else {
                                heading = heading;
                            }
                            base.log(logPrefix + "Generating StreetView URL");
                            url = base.generateStreetViewUrl(points[i].lat(), points[i].lng(), heading);
                        }
                        base.log(logPrefix + "Saving frame to stack");
                        base.frames.push(url);
                    }
                    base.log("Finished processing waypoints");
                    //  Resolve the request
                    base.log("Completed generation");
                    base.generated = true;
                    deferred.resolve();
                }).fail(function(data) {
                    /**
                     * Set this to true so that the main generation loop doesn't get
                     * stuck in an infinite loop
                     */
                    base.generated = true;
                    //  Reject the promise
                    deferred.reject({
                        error: data.error
                    });
                });
            }).fail(function() {
                /**
                 * Set this to true so that the main generation loop doesn't get
                 * stuck in an infinite loop
                 */
                base.generated = true;
                //  Reject the promise
                deferred.reject({
                    error: "Failed to geocode points"
                });
            });
        } else if (base.type === "SWEEP") {
            //  Begin generation
            base.log("Requires generation");
            base.log("Beginning generation");
            //  Reset frame stack
            base.frames = [];
            /**
             * Here is where the magic happens. We need to generate our frames
             * based on the supplied location data.
             *
             * 1.
             */
            //  Geocode anything which needs geocoded
            base.geocodePoints(deferred).done(function() {
                /**
                 * Everything has been geocoded, now get frames around the origin.
                 * the number of frames to get depends on the frame rate and the duration
                 * of the scene.
                 */
                var numFrames = base.movie.player.options.frameRate * base.duration;
                var interval = Math.ceil((base.finishHeading - base.startHeading) / numFrames);
                var currentHeading = base.startHeading || 0;
                base.log("Getting " + numFrames + " frames around the origin at " + interval + " intervals");
                base.log("Starting at heading: " + base.startHeading + " and finishing at " + base.finishHeading);
                for (var i = 0; i < numFrames; i++) {
                    //  Get the frame for the current heading
                    base.log("Generating frame for heading: " + currentHeading);
                    url = base.generateStreetViewUrl(base.origin.lat, base.origin.lng, currentHeading);
                    base.frames.push(url);
                    //  Work out the next heading
                    currentHeading += interval;
                }
                //  Resolve the request
                base.log("Completed generation");
                base.generated = true;
                deferred.resolve();
            }).fail(function() {
                /**
                 * Set this to true so that the main generation loop doesn't get
                 * stuck in an infinite loop
                 */
                base.generated = true;
                //  Reject the promise
                deferred.reject({
                    error: "Failed to geocode points"
                });
            });
        }
        return deferred.promise();
    };
    // --------------------------------------------------------------------------
    /**
     * Compile the streetview URL
     * @param  {Number} lat     The camera's latitude
     * @param  {Number} lng     The camera's longitude
     * @param  {Number} heading The camera's heading
     * @return {String}
     */
    base.generateStreetViewUrl = function(lat, lng, heading) {
        var url;
        url = "http://maps.googleapis.com/maps/api/streetview?";
        url += "size=" + base.movie.options.frameWidth + "x" + base.movie.options.frameHeight;
        url += "&location=" + lat + "," + lng;
        url += "&heading=" + heading;
        url += "&pitch=-1.62";
        url += "&sensor=false";
        url += "&key=" + base.movie.router.apiKey;
        if (!$.trim(base.movie.router.apiKey).length) {
            base.warn("Missing API key, StreetView imagery will fail");
        }
        return url;
    };
    // --------------------------------------------------------------------------
    /**
     * Loops through the origin,destination and target and geocodes them if they
     * are not already geocoded.
     * @return {Object} A jQuery promise
     */
    base.geocodePoints = function() {
        base.log("Geocoding origin/destination/target");
        var geocodeDeferred = new $.Deferred();
        base.doGeocodePoints(geocodeDeferred);
        return geocodeDeferred.promise();
    };
    // --------------------------------------------------------------------------
    /**
     * Checks all the lat/lng points are geocoded
     * @return {Void}
     */
    base.doGeocodePoints = function(geocodeDeferred) {
        var check = {
            origin: base.origin,
            destination: base.destination,
            target: base.target
        };
        var toGeocode = null;
        for (var key in check) {
            if (typeof check[key] === "string") {
                toGeocode = key;
                break;
            }
        }
        if (toGeocode !== null) {
            base.movie.router.getCoordinatesFromAddress(check[key]).done(function(data) {
                base[toGeocode] = data;
                base.doGeocodePoints(geocodeDeferred);
            }).fail(function(data) {
                geocodeDeferred.reject({
                    error: data.error
                });
            });
        } else {
            //  Nothing requires geocoding, resolve the request
            geocodeDeferred.resolve();
        }
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
     * Sends an item to the warn log, prefixing it with a string so that the class
     * making the log is easily identifiable
     * @return {Object}
     */
    base.warn = function() {
        $SVA.debug.warn("SVA [Scene:" + base.getId() + "]:", arguments);
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