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
        'player': {
            'frameRate': 12,
            'frameWidth': 600,
            'frameHeight': 338,
            'domElement': null,
            'mode': 'background'
        },
        'scenes':[],

        //  Events
        'onReady': function() {},
        'onSceneCreate': function(scene) {},
        'onSceneUpdate': function(scene) {},
        'onSceneDestroy': function() {},
        'onGenerateStart': function() {},
        'onGenerateEnd': function() {},

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
        'onPlayerReset': function(player) {}
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

        base.log('Constructing');

        //  Setup singletons
        base.router = new $SVA.router(base.options.router, base);

        //  And finally the player, check it exists first
        if (typeof window.frameplayer === 'undefined') {

            throw('Dependency FramePlayer is not available http://hellopablo.github.io/frameplayer');

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

            base.log('Scene [' + key + '] has ' + sceneNumFrames + ' frames');
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
            base.options.onGenerateStart.call(base);
        }

        var deferred = new $.Deferred();

        if (!base.requiresGeneration()) {

            base.isGenerating = false;
            base.generated = true;
            base.log('Movie is already generated');
            deferred.resolve(deferred);

        } else {

            //  Process each scene, once they are all processed resolve the promise
            base.doGenerate(deferred);
        }

        //  Fired when generation is complete
        deferred.done(function() {
            base.isGenerating = false;
            base.generated = true;
            base.log('Completed movie generation');
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

            scene.generate()
            .done(function() {

                //  Generation of this scene complete, try again
                base.doGenerate(deferred);
            });

        } else {

            //  No scenes to generate
            base.log('No scenes require generation');
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
            base.generate()
            .done(function() {

                //  Set frames
                base.log('Setting frames in player');
                base.player.reset(true);

                for (var key in base.scenes) {

                    base.log('Setting frames for scene [' + key + ']');
                    base.player.addFrames(base.scenes[key].getFrames());
                }

                //  Begin playback
                base.log('Beginning playback');
                base.player.play();
                deferred.resolve();
            });

        } else {

            //  Already generated
            //  Set frames
            base.log('Setting frames in player');
            base.player.reset(true);

            for (var key in base.scenes) {

                base.log('Setting frames for scene [' + key + ']');
                base.player.addFrames(base.scenes[key].getFrames());
            }

            base.log('Beginning playback');
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