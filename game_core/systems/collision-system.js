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

collision.CollisionSystem = function(config_data) {
  var cell_size = 10;
  var cell_height = config_data.universe_height / cell_size;
  var cell_width = config_data.universe_width / cell_size;

  var collisionObj = new system.System("Collision");

  // Initialize the spatial hashmap
  collisionObj.hashMap2d = new Array(cell_size*cell_size);
  for (var i=0; i<cell_size*cell_size; i++) {
    collisionObj.hashMap2d[i] = [];
  }

  collisionObj.hash = function(x,y) {
    x = Math.round(x / cell_width);
    y = Math.round(y / cell_height);
    return (y*cell_size + x);
  };

  collisionObj.getEntitiesNearPlayer = function(entity) {
    var entities = [];
    x = Math.round(entity.components.Position.x / cell_width);
    y = Math.round(entity.components.Position.y / cell_width);
    var posX = [-1,0,1];
    var posY = [-1,0,1];
    if (x == 0) {
      var i = posX.indexOf(-1);
      posx[i] = cell_size - 1;
    } else if (x == cell_size - 1) {
      var i = posX.indexOf(1);
      posx[i] = 0;
    }
    if (y == 0) {
      var i = posY.indexOf(-1);
      posx[i] = cell_size - 1;
    } else if (y == cell_size - 1) {
      var i = posY.indexOf(1);
      posx[i] = 0;
    }
    posX.forEach(function(ix) {
      posY.forEach(function(iy) {
        this.hashMap2d[((y+iy)*cell_size + (x+ix))].forEach(function(iz) {
          entities.push(iz);
        })
      });
    });
  };

  // Initialization of the velocity system
  collisionObj.init = function() {
      console.log();
  }

  // Checks for a collision between multiple entities
  collisionObj.update = function(name) {
    console.table(this.hashMap2d);
  }
  return collision
}

module.exports = collision;
