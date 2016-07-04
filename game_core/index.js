// Entities


// Components


// Systems

var entity = require('./entities/entity.js');
var tester;

var positionComp = require('./components/position-component.js');

var positionSystem = require('./systems/position-system.js');
// GameManager

var return_obj = {
    entities: {},
    systems: {},
    setupGame: function() {

    },
    addEntity: function() {
        var entityId = Math.random().toString(36).substring(12);
        tester = entityId;
        this.entities[entityId] = new entity.Entity(entityId);
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
        var newComp = new positionComp.positionComponent(22,22);
        this.entities[entityId].addComponent(newComp);
    },
    updateGame: function() {
        for (system in this.systems) {
            for (i = 0; i < this.systems[system].entities.length; i++) {
                this.systems[system].update(this.entities[this.systems[system].entities[i]]);
            }
        }
    }
}

return_obj.addEntity();
return_obj.addSystem("Position", positionSystem);
return_obj.subscribeEntityToSystem(tester, "Position");

console.log(return_obj);

return_obj.updateGame();



/*

entity = {
    id: XXXXX
    Components: {
        position: {
            x: 123,
            y: 123
        },
        velocity: {
            angle: 23.4,
            velocity: 0.28
        }
    }
}

GameManager = {
    Entities: {
        obj1: {
            id: XXXXX
            Components: {
                position: {
                    x: 123,
                    y: 123
                },
                velocity: {
                    angle: 23.4,
                    velocity: 0.28
                }
            }
        },
        obj2 = {}
    },
    Systems: {
        System1: {
            subscribed_entities: [obj1, obj2]
            paused: false
            init: function(x) {
                x.Components.position = {
                    x: 123,
                    y: 123
                }
            }
            update: function(x) {
                x.Components.position.x += 1
                x.Components.position.y += 1
            }
        },
        System2: {
            subscribed_entities: [obj1]
            paused: false
            update: function() {

            }
        }
    },
    setupGame: function() {

    },
    registerPlayer: function() {

    }
}
*/



// Helper Methods
    // addSystem()
    // p

// API Methods
    // module.exports.setupGame = function(config) {}
    // module.exports.registerPlayer = function(id) {}
