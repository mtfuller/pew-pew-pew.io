// =============================================================================
// Author:  Thomas Fuller
// File:    collision-system.js
// =============================================================================
// Description:
//
// =============================================================================

// Import System base object
var system = require('./system.js');

// =============================================================================
// Velocity System
// =============================================================================
var collision = {};

collision.CollisionSystem = function(game_manager) {
  var cell_size = 10;
  var cell_height = game_manager.config_data.universe_height / cell_size;
  var cell_width = game_manager.config_data.universe_width / cell_size;

  var collisionObj = new system.System("Collision");

  // Initialization of the velocity system
  collisionObj.init = function() {
      console.log();
  }

  // Checks for a collision between multiple entities
  collisionObj.update = function(name) {
    var s = "";
    for (var i=0; i<cell_size; i++) {
      for (var j=0; j<cell_size; j++) {
        s += "["+this.hashMap2d[(i*cell_size + j)] + "] ";
      }
      s += "\n";
    }
    console.log(s);
  }

  return collisionObj;
}

module.exports = collision;
