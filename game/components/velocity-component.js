var component = require('../../lib/entity-component-system/component.js');

/**
 * 
 * @param angle
 * @param speed
 * @returns {component}
 */
var newVelocityComponent = function(angle, speed) {
    var compName = "Velocity";    // Define name of component
    var positionComponent = new component.newComponent(compName);

    // Make sure the given angle is valid
    if (angle > 360 || angle < 0) {angle = 0;}

    // Define the speed and direction for an entity's velocity
    positionComponent.data = {
        theta: angle,
        velocity: speed
    };

    return positionComponent;
};

module.exports.velocityComponent = newVelocityComponent;
