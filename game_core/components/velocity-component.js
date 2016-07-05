var component = require('./component.js');

var newVelocityComponent = function(angle, speed) {
    var compName = "Velocity";
    var positionComponent = new component.newComponent(compName);
    if (angle > 360 || angle < 0) {
        angle = 0;
    }
    positionComponent.data = {
        theta: angle,
        velocity: speed
    }
    return positionComponent;
}

module.exports.velocityComponent = newVelocityComponent;
