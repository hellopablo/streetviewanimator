/**
 * This file simply ensures that the streetviewanimator namespace is properly declared.
 */

//  Ensure that the main object is defined
if (typeof window.streetviewanimator === 'undefined') {
    window.streetviewanimator = {};
    //  Alias
    window.SVA = window.streetviewanimator;
}
