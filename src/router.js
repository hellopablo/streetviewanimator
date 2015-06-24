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

        base.log('Constructing');
        base.doReset();

        //  Instanciate the Google services
        if (typeof window.google !== 'undefined' && typeof window.google.maps !== 'undefined') {

            if (typeof window.google.maps.DirectionsService !== 'undefined') {

                base.directionService = new window.google.maps.DirectionsService();

            } else {

                throw('Google Maps Direction Service not available');
            }

            if (typeof window.google.maps.Geocoder !== 'undefined') {

                base.geocoder = new window.google.maps.Geocoder();

            } else {

                throw('Google Maps Geocoder not available');
            }

            if (typeof window.google.maps.geometry !== 'undefined') {

                base.computeHeading = window.google.maps.geometry.spherical.computeHeading;

            } else {

                throw('Google Maps Geometry library not available');
            }

        } else {

            throw('Google Maps Libraries were not found');
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
        base.log('Resetting');
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

        base.geocoder.geocode({'address': address}, function (results, status)
        {
            if (status === window.google.maps.GeocoderStatus.OK)
            {
                base.log('Successfully geocoded ' + address);
                base.log('Lat: ' + results[0].geometry.location.lat());
                base.log('Lng: ' + results[0].geometry.location.lng());

                var coordinates = {
                    'lat': results[0].geometry.location.lat(),
                    'lng': results[0].geometry.location.lng()
                };

                deferred.resolve(coordinates);

            } else {

                base.log('"' + address + '" could not be geocoded');
                deferred.reject({
                    'error': 'Failed to geocode "' + address + '".',
                    'response': results
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

        originObj = new window.google.maps.LatLng(
            origin.lat,
            origin.lng
        );

        destinationObj = new window.google.maps.LatLng(
            destination.lat,
            destination.lng
        );

        travelMode = travelMode || window.google.maps.DirectionsTravelMode.DRIVING;

        request = {
            'origin': originObj,
            'destination': destinationObj,
            'travelMode': travelMode
        };

        base.log('Getting ' + travelMode + ' directions', request);

        base.directionService.route(request, function(response, status){

            if (status === window.google.maps.DirectionsStatus.OK) {

                base.log('Directions received');
                deferred.resolve(response);

            } else {

                base.log('Directions failed: ', status);
                deferred.reject({
                    'error': 'Failed to get directions, received status "' + status + '"',
                    'response': response
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

        $SVA.debug.log('SVA [Router]:', arguments);
        return base;
    };

    // --------------------------------------------------------------------------

    /**
     * Sends an item to the error log, prefixing it with a string so that the class
     * making the log is easily identifiable
     * @return {Object}
     */
    base.error = function() {

        $SVA.debug.error('SVA [Router]:', arguments);
        return base;
    };

    // --------------------------------------------------------------------------

    return base.__construct();
};