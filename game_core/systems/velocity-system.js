var system = require('./system.js');

var velocity = new system.System("Velocity");

velocity.init = function() {
    console.log();
}

velocity.addEntity = function(entity_name) {
    this.entities.push(entity_name);
}

velocity.update = function(name) {
    /*
    if (name.components.Velocity.theta >= 360) {
        name.components.Velocity.theta = 0;
    } else {
        name.components.Velocity.theta += 1;
    }
    name.components.Velocity.velocity = 15;
    */
}

module.exports = velocity;
