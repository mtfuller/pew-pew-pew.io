var system = require('./system.js');

var velocity = new system.System("Velocity");

velocity.init = function() {
    console.log();
}

velocity.addEntity = function(entity_name) {
    this.entities.push(entity_name);
}

velocity.update = function(name) {
    name.components.Velocity.theta = 20;
    name.components.Velocity.velocity = 15;
}

module.exports = velocity;
