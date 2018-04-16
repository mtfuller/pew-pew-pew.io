// =============================================================================
// Author:  Thomas Fuller
// File:    index.js
// =============================================================================
// Description:
//
// =============================================================================

// Define Entities
var entity = require('../lib/entity-component-system/entity.js');
var player = require('./entities/player.js');

// Define Systems
var velocitySystem = require('./systems/velocity-system.js');
var collisionSystem = require('./systems/collision-system.js');

// =============================================================================
// Game Manager object
// =============================================================================
var game_manager = {

    // Default configuration data for the game
    config_data: {
        universe_width: 500,
        universe_height: 500
    },

    entities: {},     // Holds all entities that exist in the game
    systems: {},      // Holds all currently-running game systems

    // =========================================================================
    // Spatial HashMap
    // =========================================================================
    spatialHashMap: {
      cell_size: 10,
      cell_width: 100,
      cell_height: 100,
      hashMap2d: new Array(),
      init: function() {
        this.cell_height = game_manager.config_data.universe_height / this.cell_size;
        this.cell_width = game_manager.config_data.universe_width / this.cell_size;
        this.hashMap2d = new Array(this.cell_size*this.cell_size);
        for (var i=0; i<this.hashMap2d.length; i++) {
          this.hashMap2d[i] = [];
        }
      },
      hash: function(x,y) {
        x = Math.floor(x / this.cell_width);
        y = Math.floor(y / this.cell_height);
        console.log("(x,y) = "+x+", "+y);
        return (y*this.cell_size + x);
      },
      addEntity: function(entityId, i) {
        console.log("most recent:");
        console.log("i: "+i);
        console.log(this.hashMap2d[i]);
        this.hashMap2d[i].push(entityId);
      },
      removeEntity: function(entityId, i) {
        var t = this.hashMap2d[i].indexOf(entityId)
        this.hashMap2d[i].splice(t,1);
      },
      getEntitiesNearPlayer: function(entity) {
        var entities = [];
        x = Math.round(entity.components.Position.x / this.cell_width);
        y = Math.round(entity.components.Position.y / this.cell_width);
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
      }
    },

    // =========================================================================
    // void setupGame()
    // =========================================================================
    // Description:
    // Sets up the game by setting up all game systems.
    // =========================================================================
    setupGame: function() {
        console.log('Game is setup!')
        this.spatialHashMap.init();
        this.addSystem("Velocity",
          new velocitySystem.VelocitySystem(this));
        this.addSystem("Collision",
          new collisionSystem.CollisionSystem(this));
    },

    // =========================================================================
    // void addEntity(entityId)
    // =========================================================================
    // Description:
    // Adds a new entity to the game, under the specified entity id, it also
    // subscribes the entity to the appropriate systems.
    // =========================================================================
    addEntity: function(entityId) {
        var x = Math.round(Math.random() * 1001);
        var y = Math.round(Math.random() * 501)
        this.entities[entityId] = new player.Player(entityId, 1, x, y, 20, 5);
        this.subscribeEntityToSystem(entityId, "Velocity");
        this.subscribeEntityToSystem(entityId, "Collision");
    },

    // =========================================================================
    // void removeEntity(entityId)
    // =========================================================================
    // Description:
    // Removes the entity at the specified entity id, also unsubscribes it from
    // all game systems.
    // =========================================================================
    removeEntity: function(entityId) {
      delete this.entities[entityId];
      this.unsubscribeEntityToSystem(entityId, "Velocity");
      this.unsubscribeEntityToSystem(entityId, "Collision");
    },

    // =========================================================================
    // EntityObject getEntity(entityId)
    // =========================================================================
    // Description:
    // Returns the entity object, found at the given entity id.
    // =========================================================================
    getEntity: function(entityId) {
      return this.entities[entityId];
    },

    // =========================================================================
    // void addSystem(name, system)
    // =========================================================================
    // Description:
    // Adds a game system to the current game, under the given name.
    // =========================================================================
    addSystem: function(name, system) {
        if (name != null && !this.systems.hasOwnProperty(name)) {
            this.systems[name] = system;
        } else {
            console.log("DEBUG | ERR - System name is either already taken or "+
            "empty.");
        }
    },

    // =========================================================================
    // void subscribeEntityToSystem(entityId, systemName)
    // =========================================================================
    // Description:
    // Subscribes the entity under the given entity id, to the system found
    // under the system name.
    // =========================================================================
    subscribeEntityToSystem: function(entityId, systemName) {
        this.systems[systemName].addEntity(entityId);
    },

    // =========================================================================
    // void unsubscribeEntityToSystem(entityId, systemName)
    // =========================================================================
    // Description:
    // Unubscribes the entity under the given entity id, from the system found
    // under the system name.
    // =========================================================================
    unsubscribeEntityToSystem: function(entityId, systemName) {
        this.systems[systemName].removeEntity(entityId);
    },

    // =========================================================================
    // void updateGame()
    // =========================================================================
    // Description:
    // Goes through and updates each system, and all of their subscribed
    // entities in the currently-running game.
    // =========================================================================
    updateGame: function() {
        for (system in this.systems) {
          for (entity in this.systems[system].entities) {
            this.systems[system].update(this.entities[this.systems[system].entities[entity]]);
          }
        }
    },

    // =========================================================================
    // Object getClientData(user_id)
    // =========================================================================
    // Description:
    // Returns the client information for all visible entities for the specified
    // user id.
    // =========================================================================
    getClientData: function(user_id) {
        var retArr = [];
        var playerEntityPos = this.entities[user_id].getComponent("Position");
        for (entity in this.entities) {
            var obj = {
                x: this.entities[entity].components.Position.x - playerEntityPos.x,
                y: this.entities[entity].components.Position.y - playerEntityPos.y,
                theta: this.entities[entity].components.Velocity.theta
            }
            retArr.push(obj);
        }
        return {
          data: retArr
        };
    }
}

module.exports = game_manager;        // Returns the game manager object to
                                      // calling app

// =============================================================================
// void startGame()
// =============================================================================
// Description:
// Sets up a timer to continuously update the currently-running game.
// =============================================================================
module.exports.startGame = function() {
    this.updateGame();
    setTimeout(function(){ game_manager.startGame(); }, 20);
}
