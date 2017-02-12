var system = require('./system.js');

var velocity = {};

velocity.VelocitySystem = function(config_data) {
  var velocityObj = new system.System("Velocity");
  velocityObj.MIN_X = 0;
  velocityObj.MIN_Y = 0;
  velocityObj.MAX_X = config_data.universe_width;
  velocityObj.MAX_Y = config_data.universe_height;

  console.log("MAX: "+velocityObj.MAX_X+", "+velocityObj.MAX_Y);

  velocityObj.init = function() {
      console.log();
  }

  velocityObj.addEntity = function(entity_name) {
      this.entities.push(entity_name);
  }

  velocityObj.update = function(name) {
      /*if (name.components.Velocity.theta >= 360) {
          name.components.Velocity.theta = 0;
      } else {
          name.components.Velocity.theta += 1;
      }*/
      name.components.Position.x += Math.round(name.components.Velocity.velocity
        * Math.cos(name.components.Velocity.theta * (Math.PI / 180)));
      name.components.Position.y += Math.round(name.components.Velocity.velocity
        * Math.sin(name.components.Velocity.theta * (Math.PI / 180)));

      if (name.components.Position.x > velocityObj.MAX_X) {
        name.components.Position.x = velocityObj.MIN_X
      }
      if (name.components.Position.x < velocityObj.MIN_X) {
        name.components.Position.x = velocityObj.MAX_X
      }
      if (name.components.Position.y > velocityObj.MAX_Y) {
        name.components.Position.y = velocityObj.MIN_Y
      }
      if (name.components.Position.y < velocityObj.MIN_Y) {
        name.components.Position.y = velocityObj.MAX_Y
      }

      console.log("New Position:");
      console.log("X:"+name.components.Position.x);
      console.log("MAX X:"+velocityObj.MAX_X);
  }
  return velocityObj
}

module.exports = velocity;
