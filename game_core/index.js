// Entities


// Components


// Systems

var entity = require('./entities/entity.js');

var positionComp = require('./components/position-component.js');

var positionSystem = require('./systems/position-system.js');
var velocitySystem = require('./systems/velocity-system.js');

var player = require('./entities/player.js');

// GameManager
var return_obj = {
    entities: {},
    systems: {},
    setupGame: function() {
        console.log('Game is setup!')
        this.addSystem("Position", positionSystem);
        this.addSystem("Velocity", velocitySystem);
    },
    addEntity: function(entityId) {
        //var entityId = Math.random().toString(36).substring(12);
        this.entities[entityId] = new player.Player(entityId, 1, 100, 100, 20, 10);
        this.subscribeEntityToSystem(entityId, "Position");
        this.subscribeEntityToSystem(entityId, "Velocity");
    },
    removeEntity: function(entityId) {
      delete this.entities[entityId];
      this.unsubscribeEntityToSystem(entityId, "Position");
      this.unsubscribeEntityToSystem(entityId, "Velocity");
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
    getClientData: function() {
        var retArr = [];
        for (entity in this.entities) {
            var obj = {
                x: this.entities[entity].components.Position.x,
                y: this.entities[entity].components.Position.y,
                theta: this.entities[entity].components.Velocity.theta,
                speed: this.entities[entity].components.Velocity.velocity
            }
            retArr.push(obj);
        }
        return {data: retArr};
    }
}

module.exports = return_obj;

module.exports.startGame = function() {
    this.updateGame();
    setTimeout(function(){ return_obj.startGame(); }, 20);
}
