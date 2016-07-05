var entity = require('./entity.js');
var position = require('../components/position-component.js');
var velocity = require('../components/velocity-component.js');

var newPlayer = function(id, user_id, x_pos, y_pos, theta, speed) {
    var newPlayer = new entity.Entity(id);
    newPlayer.user_id = user_id;
    var positionComponent = new position.positionComponent(x_pos, y_pos);
    var velocityComponent = new velocity.velocityComponent(theta, speed);
    entity.addComponent(newPlayer, positionComponent);
    entity.addComponent(newPlayer, velocityComponent);
    return newPlayer;
}

module.exports.Player = newPlayer;
