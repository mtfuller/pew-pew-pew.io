// =============================================================================
// Author:  Thomas Fuller
// File:    velocity-component.js
// =============================================================================
// Description:
//
// =============================================================================

// Import base object
var component = require('./component.js');

// =============================================================================
// Velocity Component
// =============================================================================
var newVelocityComponent = function(angle, speed) {
    var compName = "Velocity";    // Define name of component
    var positionComponent = new component.newComponent(compName);

    // Make sure the given angle is valid
    if (angle > 360 || angle < 0) {angle = 0;}

    // Define the speed and direction for an entity's velocity
    positionComponent.data = {
        theta: angle,
        velocity: speed
    }

    return positionComponent;
}

module.exports.velocityComponent = newVelocityComponent;
