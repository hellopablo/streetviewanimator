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
        'debug': false,
        'playerDebug': false,
        'router': {
            'apiKey': null
        },
        'frameWidth': 600,
        'frameHeight': 338,
        'player': {
            'frameRate': 12,
            'domElement': null
        },
        'scenes':[],
        'streetviewUrl': 'http://maps.googleapis.com/maps/api/streetview',

        //  Events
        'onReady': function() {},
        'onSceneCreate': function(scene) {},
        'onSceneUpdate': function(scene) {},
        'onSceneDestroy': function() {},
        'onGenerateStart': function() {},
        'onGenerateEnd': function() {},
        'onReset': function() {},

        //  Player Events
        'onPlayerReady': function(player) {},
        'onPlayerLoadStart': function(player) {},
        'onPlayerLoadStop': function(player) {},
        'onPlayerLoadProgress': function(player, lastFrameLoaded, totalFrames, percentageLoaded) {},
        'onPlayerLoadComplete': function(player) {},
        'onPlayerPlay': function(player) {},
        'onPlayerBufferStart': function(player) {},
        'onPlayerBufferStop': function(player) {},
        'onPlayerStop': function(player) {},
        'onPlayerEnterFrame': function(player, currentFrame) {},
        'onPlayerExitFrame': function(player, currentFrame) {},
        'onPlayerLoop': function(player) {},
        'onPlayerReset': function(player) {},

        //  Custom player events
        'onPlayerEnterScene': function(player, scene) {},
        'onPlayerExitScene': function(player, scene) {}
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

        base.log('Constructing');

        //  Reset everything
        base.doReset();

        //  Setup singletons
        base.router = new $SVA.router(base.options.router, base);

        //  And finally the player, check it exists first
        if (typeof window.frameplayer === 'undefined') {

            throw('Dependency FramePlayer is not available http://hellopablo.github.io/frameplayer');

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
            base.options.player.onReset = function()  {
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
        if (typeof base.scenes[sceneId] === 'undefined') {

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

            base.warn('Generation in progress, ignoring call');
            return false;

        } else {

            base.log('Beginning scene generation');
            base.isGenerating = true;

            //  Update the player element so some visual feedback can be given easily
            base.player.element.addClass('generating');

            //  Fire the `onGenerateStart` event
            base.options.onGenerateStart.call(base);
        }

        var deferred = new $.Deferred();

        if (!base.requiresGeneration()) {

            base.log('Movie is already generated');

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

            base.log('Completed movie generation');

            //  Reset local variables
            base.isGenerating = false;
            base.generated = true;

            //  Update the player element so some visual feedback can be given easily
            base.player.element.removeClass('generating');

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

            base.warn('No scenes are present in the movie');
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

                scene.generate()
                .fail(function(data) {

                    base.warn('Scene [' + scene.getId() + '] failed to generate: ' + data.error);
                })
                .always(function() {

                    //  Generation of this scene complete, try again
                    base.doGenerate(deferred);
                });

            } else {

                //  No scenes to generate
                base.log('No scenes require generation');
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
            base.log('Movie requires generation prior to playback');
            base.generate()
            .done(function() {

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

        base.log('Setting frames in player and calculating start/end frames');
        base.player.reset(true);

        base.sceneStartFrames = {};
        base.sceneStopFrames = {};

        var lastStartFrame = 0;
        var lastEndFrame = -1;

        for (var key in base.scenes) {

            base.log('Setting frames for scene [' + key + ']');
            base.player.addFrames(base.scenes[key].getFrames());

            //  Set the start frame, it's the lastEndFrame + 1
            lastStartFrame = lastEndFrame + 1;
            base.sceneStartFrames['frame'+lastStartFrame] = base.scenes[key];

            //  Set the end frame, it's the start frame + number of frames
            lastEndFrame = lastStartFrame + base.scenes[key].getNumFrames() - 1;
            base.sceneStopFrames['frame'+lastEndFrame] = base.scenes[key];
        }

        //  Begin playback
        base.log('Beginning playback');
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

        var methodName = 'frame' + currentFrame;
        if (typeof base.sceneStartFrames[methodName] === 'object') {
            base.log('Entering Scene:' + base.sceneStartFrames[methodName].getId());
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

        var methodName = 'frame' + currentFrame;
        if (typeof base.sceneStopFrames[methodName] === 'object') {
            base.log('Exiting Scene:' + base.sceneStopFrames[methodName].getId());
            base.options.onPlayerExitScene.call(base.player, base.sceneStopFrames[methodName]);
        }
    };

    // --------------------------------------------------------------------------

    /**
     * Resets the movie to it's default state
     * @return {Object}
     */
    base.reset = function() {
        base.log('Resetting');
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

        base.log('Changing framerate from ' + base.options.player.frameRate + ' to ' + frameRate);
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

        base.log('Changing framesize from ' + base.options.frameWidth + 'x' + base.options.frameHeight + ' to ' + width + 'x' + height);
        base.options.frameWidth = parseInt(width, 10);
        base.options.frameHeight = parseInt(height, 10);
        return base;
    };

    // --------------------------------------------------------------------------

    base.setPlayerSize = function(width, height) {

        base.log('Changing framesize from ' + base.options.frameWidth + 'x' + base.options.frameHeight + ' to ' + width + 'x' + height);
        base.player.setPlayerSize(width, height);
        return base;
    };

    // --------------------------------------------------------------------------

    /**
     * Set the API key to use when contacting Google
     * @param {String} apiKey The API Key to use
     */
    base.setApiKey = function(apiKey) {

        base.log('Changing API key from ' + base.options.router.apiKey + ' to ' + apiKey);
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

        $SVA.debug.log('SVA [Movie]:', arguments);
        return base;
    };

    // --------------------------------------------------------------------------

    /**
     * Sends an item to the error log, prefixing it with a string so that the class
     * making the log is easily identifiable
     * @return {Object}
     */
    base.warn = function() {

        $SVA.debug.warn('SVA [Movie]:', arguments);
        return base;
    };

    // --------------------------------------------------------------------------

    return base.__construct();
};
