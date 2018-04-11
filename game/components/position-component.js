// =============================================================================
// Author:  Thomas Fuller
// File:    position-component.js
// =============================================================================
// Description:
//
// =============================================================================

// Import base object
var component = require('./component.js');

// =============================================================================
// Position Component
// =============================================================================
var newPositionComponent = function(x_pos, y_pos) {
    var compName = "Position";    // Define name of component
    var positionComponent = new component.newComponent(compName);

    // Define the x and y values for an entity's position
    positionComponent.data = {
        x: x_pos,
        y: y_pos
    }

    return positionComponent;
}

module.exports.positionComponent = newPositionComponent;
