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

            if (typeof base.origin === 'string') {

                if (!base.origin.length) {

                    base.warn(typeof base.origin, base.origin);
                    throw('An origin must be specified');
                }

            } else if (typeof base.origin === 'object' && base.origin !== null) {

                base.origin.lat = parseFloat(base.origin.lat, 10) || 0;

                if (!base.origin.lng) {

                    base.warn(typeof base.origin, base.origin);
                    throw('If origin is supplied as an object, the lat property cannot be empty');
                }

                base.origin.lng = parseFloat(base.origin.lng, 10) || 0;

                if (!base.origin.lng) {

                    base.warn(typeof base.origin, base.origin);
                    throw('If origin is supplied as an object, the lng property cannot be empty');
                }

            } else {

                base.warn(typeof base.origin, base.origin);
                throw('Invalid data type for origin, or origin missing; valid data types are string or object literal');
            }

            // --------------------------------------------------------------------------

            if (typeof base.destination === 'string') {

                if (!base.destination.length) {

                    base.warn(typeof base.destination, base.destination);
                    throw('An destination must be specified');
                }

            } else if (typeof base.destination === 'object' && base.destination !== null) {

                base.destination.lat = parseFloat(base.destination.lat, 10) || 0;

                if (!base.destination.lng) {

                    base.warn(typeof base.destination, base.destination);
                    throw('If destination is supplied as an object, the lat property cannot be empty');
                }

                base.destination.lng = parseFloat(base.destination.lng, 10) || 0;

                if (!base.destination.lng) {

                    base.warn(typeof base.destination, base.destination);
                    throw('If destination is supplied as an object, the lng property cannot be empty');
                }

            } else {

                base.warn(typeof base.destination, base.destination);
                throw('Invalid data type for destination, or destination missing; valid data types are string or object literal');
            }

            // --------------------------------------------------------------------------

            if (typeof base.target === 'object' && base.target !== null) {

                base.target.lat = parseFloat(base.target.lat, 10) || 0;

                if (!base.target.lng) {

                    base.warn(typeof base.target, base.target);
                    throw('If target is supplied as an object, the lat property cannot be empty');
                }

                base.target.lng = parseFloat(base.target.lng, 10) || 0;

                if (!base.target.lng) {

                    base.warn(typeof base.target, base.target);
                    throw('If target is supplied as an object, the lng property cannot be empty');
                }
            }

        } else if (base.type === 'SWEEP') {

            if (typeof base.origin === 'string') {

                if (!base.origin.length) {

                    base.warn(typeof base.origin, base.origin);
                    throw('An origin must be specified');
                }

            } else if (typeof base.origin === 'object' && base.origin !== null) {

                base.origin.lat = parseFloat(base.origin.lat, 10) || 0;

                if (!base.origin.lng) {

                    base.warn(typeof base.origin, base.origin);
                    throw('If origin is supplied as an object, the lat property cannot be empty');
                }

                base.origin.lng = parseFloat(base.origin.lng, 10) || 0;

                if (!base.origin.lng) {

                    base.warn(typeof base.origin, base.origin);
                    throw('If origin is supplied as an object, the lng property cannot be empty');
                }

            } else {

                base.warn(typeof base.origin, base.origin);
                throw('Invalid data type for origin, or origin missing; valid data types are string or object literal');
            }

            if (base.finishHeading <= base.startHeading) {

                base.warn(base.startHeading, base.finishHeading);
                throw('finishHeading must be greater than startHeading');

            } else if (base.finishHeading > 360) {

                base.warn(base.finishHeading);
                throw('finishHeading cannot be greater than 360');

            } else if (base.startHeading < 0) {

                base.warn(base.startHeading);
                throw('startHeading cannot be less than 0');
            }

        } else if (base.type === 'MANUAL') {

            if (!base.frames.length) {
                throw('Scenes of type MANUAL must define at least 1 frame');
            }

        } else {

            throw('Invalid scene type "' + base.type + '"');
        }

        // --------------------------------------------------------------------------

        /**
         * If the origin, destination or target are strings and are lat/lng coordinates
         * (i.e., in the format Number,Number) then translate them into an object.
         */

        var properties = ['origin', 'destination', 'target'];
        var regex = /^-?\d+(\.\d+),-?\d+(\.\d+)$/;
        var bits = null;

        for (var i = properties.length - 1; i >= 0; i--) {

            if (typeof base[properties[i]] === 'string' && regex.test(base[properties[i]])) {
                bits = base[properties[i]].split(',');
                base[properties[i]] = {
                    'lat': parseFloat(bits[0], 10),
                    'lng': parseFloat(bits[1], 10)
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

        if (base.type === 'MANUAL' || !base.requiresGeneration()) {

            base.log('Generation not required');
            deferred.resolve();

        } else if (base.type === 'AUTO') {

            //  Begin generation
            base.log('Requires generation');
            base.log('Beginning generation');

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
            base.geocodePoints(deferred)
            .done(function() {

                //  Everything has been geocoded, now get directions
                base.log('Getting directions between origin and destination');
                base.movie.router.getDirections(base.origin, base.destination, base.travelMode)
                .done(function(data) {

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

                    base.log('Successfully extracted ' + points.length + ' waypoints');
                    base.log('Processing waypoints');

                    var logPrefix, heading, url, targetObj;

                    if (base.target !== null) {
                        targetObj = new window.google.maps.LatLng(
                            base.target.lat,
                            base.target.lng
                        );
                    }

                    for (i = 0; i < points.length; i++) {

                        logPrefix = 'Waypoint ' + i + ' (' + points[i].lat() + ', ' + points[i].lng() + '): ';

                        if (typeof points[i+1] !== 'undefined') {

                            base.log(logPrefix + 'Determining heading');

                            /**
                             * If a target is deifned, look at it, otherwise look at the next
                             * way point.
                             */
                            if (base.target !== null) {

                                heading = base.movie.router.computeHeading(points[i], targetObj);

                            } else {

                                heading = base.movie.router.computeHeading(points[i], points[i+1]);
                            }

                            base.log(logPrefix + 'Generating StreetView URL');
                            url = base.generateStreetViewUrl(points[i].lat(), points[i].lng(), heading);

                        } else {

                            //  Last frame
                            base.log(logPrefix + 'Last frame');
                            base.log(logPrefix + 'Determining heading');

                            /**
                             * If a target is deifned, look at it, otherwise look in the same
                             * direction as the previous waypoint.
                             */
                            if (base.target !== null) {

                                heading = base.movie.router.computeHeading(points[i], targetObj);

                            } else {

                                heading = heading;
                            }

                            base.log(logPrefix + 'Generating StreetView URL');
                            url = base.generateStreetViewUrl(points[i].lat(), points[i].lng(), heading);
                        }

                        base.log(logPrefix + 'Saving frame to stack');
                        base.frames.push(url);
                    }

                    base.log('Finished processing waypoints');

                    //  Resolve the request
                    base.log('Completed generation');
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
                        'error': data.error
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
                    'error': 'Failed to geocode points'
                });
            });

        } else if (base.type === 'SWEEP') {

            //  Begin generation
            base.log('Requires generation');
            base.log('Beginning generation');

            //  Reset frame stack
            base.frames = [];

            /**
             * Here is where the magic happens. We need to generate our frames
             * based on the supplied location data.
             *
             * 1.
             */

            //  Geocode anything which needs geocoded
            base.geocodePoints(deferred)
            .done(function() {

                /**
                 * Everything has been geocoded, now get frames around the origin.
                 * the number of frames to get depends on the frame rate and the duration
                 * of the scene.
                 */

                var numFrames = base.movie.player.options.frameRate * base.duration;
                var interval = Math.ceil((base.finishHeading - base.startHeading)/numFrames);
                var currentHeading = base.startHeading || 0;

                base.log('Getting ' + numFrames + ' frames around the origin at ' + interval + ' intervals');
                base.log('Starting at heading: ' + base.startHeading + ' and finishing at ' + base.finishHeading);

                for (var i = 0; i < numFrames; i++) {

                    //  Get the frame for the current heading
                    base.log('Generating frame for heading: ' + currentHeading);
                    url = base.generateStreetViewUrl(base.origin.lat, base.origin.lng, currentHeading);

                    base.frames.push(url);

                    //  Work out the next heading
                    currentHeading += interval;
                }

                //  Resolve the request
                base.log('Completed generation');
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
                    'error': 'Failed to geocode points'
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
        url = 'http://maps.googleapis.com/maps/api/streetview?';
        url += 'size=' + base.movie.options.frameWidth + 'x' + base.movie.options.frameHeight;
        url += '&location=' + lat + ',' + lng;
        url += '&heading=' + heading;
        url += '&pitch=-1.62';
        url += '&sensor=false';
        url += '&key=' + base.movie.router.apiKey;

        if (!$.trim(base.movie.router.apiKey).length) {
            base.warn('Missing API key, StreetView imagery will fail');
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

        base.log('Geocoding origin/destination/target');
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
            'origin': base.origin,
            'destination': base.destination,
            'target': base.target
        };

        var toGeocode = null;

        for (var key in check) {

            if (typeof check[key] === 'string') {

                toGeocode = key;
                break;
            }
        }

        if (toGeocode !== null) {
            base.movie.router.getCoordinatesFromAddress(check[key])
            .done(function(data) {

                base[toGeocode] = data;
                base.doGeocodePoints(geocodeDeferred);

            })
            .fail(function(data) {

                geocodeDeferred.reject({
                   'error': data.error
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

        $SVA.debug.log('SVA [Scene:' + base.getId() + ']:', arguments);
        return base;
    };

    // --------------------------------------------------------------------------

    /**
     * Sends an item to the warn log, prefixing it with a string so that the class
     * making the log is easily identifiable
     * @return {Object}
     */
    base.warn = function() {

        $SVA.debug.warn('SVA [Scene:' + base.getId() + ']:', arguments);
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
