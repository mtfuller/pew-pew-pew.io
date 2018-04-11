// =============================================================================
// Author:  Thomas Fuller
// File:    velocity-system.js
// =============================================================================
// Description:
//
// =============================================================================

// Import System base object
var system = require('./system.js');

// =============================================================================
// Velocity System
// =============================================================================
var velocity = {};

velocity.VelocitySystem = function(game_manager) {
  var velocityObj = new system.System("Velocity");
  velocityObj.MIN_X = 0;
  velocityObj.MIN_Y = 0;
  velocityObj.MAX_X = game_manager.config_data.universe_width;
  velocityObj.MAX_Y = game_manager.config_data.universe_height;

  // Initialization of the velocity system
  velocityObj.init = function() {
      console.log();
  }

  // Updates the position of all entities, based off their currrent velocity
  velocityObj.update = function(name) {
    var x = name.components.Position.x;
    var y = name.components.Position.y;
    var old_hash_index = game_manager.spatialHashMap.hash(x,y);

    // Move entity's x position using their speed and direction
    name.components.Position.x += Math.round(name.components.Velocity.velocity
      * Math.cos(name.components.Velocity.theta * (Math.PI / 180)));

    // Move entity's y position using their speed and direction
    name.components.Position.y += Math.round(name.components.Velocity.velocity
      * Math.sin(name.components.Velocity.theta * (Math.PI / 180)));

    // If the entity moves past an edge on the map, the entity's position is
    // "wrapped" to the opposite edge. Just like in Astroids.
    if (name.components.Position.x >= velocityObj.MAX_X) {
      name.components.Position.x = velocityObj.MIN_X
    } else if (name.components.Position.x <= velocityObj.MIN_X) {
      name.components.Position.x = velocityObj.MAX_X-1
    }
    if (name.components.Position.y >= velocityObj.MAX_Y) {
      name.components.Position.y = velocityObj.MIN_Y
    } else if (name.components.Position.y <= velocityObj.MIN_Y) {
      name.components.Position.y = velocityObj.MAX_Y-1
    }

    x = name.components.Position.x;
    y = name.components.Position.y;
    var new_hash_index = game_manager.spatialHashMap.hash(x,y);

    if (old_hash_index != new_hash_index) {
      game_manager.spatialHashMap.removeEntity(name.id, old_hash_index);
      game_manager.spatialHashMap.addEntity(name.id, new_hash_index);
    }
  }
  return velocityObj
}

module.exports = velocity;
