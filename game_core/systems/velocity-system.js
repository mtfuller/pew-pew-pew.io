var system = require('./system.js');

var velocity = {};

velocity.VelocitySystem = function(config_data) {
  velocity = new system.System("Velocity");
  this.MIN_X = 0;
  this.MIN_Y = 0;
  this.MAX_X = config_data.universe_width;
  this.MAX_Y = config_data.universe_height;

  this.init = function() {
      console.log();
  }

  this.addEntity = function(entity_name) {
      this.entities.push(entity_name);
  }

  this.update = function(name) {
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
}

module.exports = velocity;
