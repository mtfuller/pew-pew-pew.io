// =============================================================================
// Author:  Thomas Fuller
// File:    entity.js
// =============================================================================
// Description:
//
// =============================================================================

// Importing necessary files
var entity = require('../../lib/entity-component-system/entity.js');
var position = require('../components/position-component.js');
var velocity = require('../components/velocity-component.js');

// =============================================================================
// Player
// =============================================================================
var newPlayer = function(id, user_id, x_pos, y_pos, theta, speed) {
    var newPlayer = new entity.Entity(id);  // Inherits from Entity

    // Add position and velocity components to entity
    var positionComponent = new position.positionComponent(x_pos, y_pos);
    var velocityComponent = new velocity.velocityComponent(theta, speed);
    newPlayer.addComponent(positionComponent);
    newPlayer.addComponent(velocityComponent);

    return newPlayer;
};

module.exports.Player = newPlayer;
