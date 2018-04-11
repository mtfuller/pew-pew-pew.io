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
    if (name.components.Collision.isCollidable) {
      // Get entities near current entity
      var x1 = name.components.Position.x;
      var y1 = name.components.Position.y;
      var hash_index = game_manager.spatialHashMap.hash(x1,y1);
      var entities = game_manager.spatialHashMap.getEntitiesNearPlayer(name);

      // Check collisions for all passed in enetities
      for (entity in entities) {
        if (entity.components.Collision.isCollidable) {
          var x2 = entity.components.Position.x;
          var y2 = entity.components.Position.y;

          // Check collision

        }
      }

      /*var s = "";
      for (var i=0; i<cell_size; i++) {
        for (var j=0; j<cell_size; j++) {
          s += "["+game_manager.spatialHashMap.hashMap2d[(i*cell_size + j)] + "] ";
        }
        s += "\n";
      }
      console.log(s);*/
    }
  }

  return collisionObj;
}

module.exports = collision;
