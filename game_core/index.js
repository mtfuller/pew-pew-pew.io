// =============================================================================
// Author:  Thomas Fuller
// File:    index.js
// =============================================================================
// Description:
//
// =============================================================================

// Define Entities
var entity = require('./entities/entity.js');
var player = require('./entities/player.js');

// Define Systems
var velocitySystem = require('./systems/velocity-system.js');

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
    // void setupGame()
    // =========================================================================
    // Description:
    // Sets up the game by setting up all game systems.
    // =========================================================================
    setupGame: function() {
        console.log('Game is setup!')
        this.addSystem("Velocity",
          new velocitySystem.VelocitySystem(this.config_data));
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
            for (i = 0; i < this.systems[system].entities.length; i++) {
                this.systems[system].update(this.entities[this.systems[system].entities[i]]);
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
