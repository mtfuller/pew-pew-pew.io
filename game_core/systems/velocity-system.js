var system = require('./system.js');

var velocity = new system.System("Velocity");

velocity.MIN_X = 0;
velocity.MIN_Y = 0;
velocity.MAX_X = 1000;
velocity.MAX_Y = 500;

velocity.init = function() {
    console.log();
}

velocity.addEntity = function(entity_name) {
    this.entities.push(entity_name);
}

velocity.update = function(name) {
    /*if (name.components.Velocity.theta >= 360) {
        name.components.Velocity.theta = 0;
    } else {
        name.components.Velocity.theta += 1;
    }*/
    name.components.Position.x += Math.round(name.components.Velocity.velocity
      * Math.cos(name.components.Velocity.theta * (Math.PI / 180)));
    name.components.Position.y += Math.round(name.components.Velocity.velocity
      * Math.sin(name.components.Velocity.theta * (Math.PI / 180)));
    if (name.components.Position.x > velocity.MAX_X) {
      name.components.Position.x = velocity.MAX_X
    }
    if (name.components.Position.x < velocity.MIN_X) {
      name.components.Position.x = velocity.MIN_X
    }
    if (name.components.Position.y > velocity.MAX_Y) {
      name.components.Position.y = velocity.MAX_Y
    }
    if (name.components.Position.y < velocity.MIN_Y) {
      name.components.Position.y = velocity.MIN_Y
    }
}

module.exports = velocity;
