// =============================================================================
// Author:  Thomas Fuller
// File:    collision-component.js
// =============================================================================
// Description:
//
// =============================================================================

// Import base object
var component = require('./component.js');

// =============================================================================
// Position Component
// =============================================================================
var newCollisionComponent = function(s, c=true) {
    var compName = "Collision";    // Define name of component
    var collisionComponent = new component.newComponent(compName);

    // Define the x and y values for an entity's position
    collisionComponent.data = {
        size: s,
        isCollidable: c
    }

    return collisionComponent;
}

module.exports.collisionComponent = newCollisionComponent;
