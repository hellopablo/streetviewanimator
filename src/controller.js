//  Ensure that the main object is defined
if (typeof window.streetviewanimator === 'undefined') {
    window.streetviewanimator = {};
}
//  Declare the controller
window.streetviewanimator.controller = function() {

    //  Prevent scope issues by using `base` in callbacks
    var base = this;

    // --------------------------------------------------------------------------

    base.__construct = function() {
        base.log('Constructing');
    };

    // --------------------------------------------------------------------------

    base.log = function() {
        if (typeof console === 'object') {
            console.log('STREETVIEWANIMATOR [Controller]: ', arguments);
        }
    };

    return base.__construct();
};