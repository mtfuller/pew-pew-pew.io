// Entities


// Components


// Systems

var entity = require('./entities/entity.js');

var velocitySystem = require('./systems/velocity-system.js');

var player = require('./entities/player.js');

// GameManager
var return_obj = {
    config_data: {
        universe_width: 500,
        universe_height: 500
    },
    entities: {},
    systems: {},
    setupGame: function() {
        console.log('Game is setup!')
        this.addSystem("Velocity", new velocitySystem.VelocitySystem(this.config_data));
    },
    addEntity: function(entityId) {
        var x = Math.round(Math.random() * 1001);
        var y = Math.round(Math.random() * 501)
        this.entities[entityId] = new player.Player(entityId, 1, x, y, 20, 5);
        this.subscribeEntityToSystem(entityId, "Velocity");
    },
    removeEntity: function(entityId) {
      delete this.entities[entityId];
      this.unsubscribeEntityToSystem(entityId, "Velocity");
    },
    getEntity: function(entityId) {
      return this.entities[entityId];
    },
    addSystem: function(name, system) {
        if (name != null && !this.systems.hasOwnProperty(name)) {
            this.systems[name] = system;
        } else {
            console.log("DEBUG | ERR - System name is either already taken or "+
            "empty.");
        }
    },
    registerPlayer: function() {},
    subscribeEntityToSystem: function(entityId, systemName) {
        this.systems[systemName].addEntity(entityId);
    },
    unsubscribeEntityToSystem: function(entityId, systemName) {
        this.systems[systemName].removeEntity(entityId);
    },
    updateGame: function() {
        for (system in this.systems) {
            for (i = 0; i < this.systems[system].entities.length; i++) {
                this.systems[system].update(this.entities[this.systems[system].entities[i]]);
            }
        }
    },
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

module.exports = return_obj;

module.exports.startGame = function() {
    this.updateGame();
    setTimeout(function(){ return_obj.startGame(); }, 20);
}
