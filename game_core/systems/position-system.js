var system = require('./system.js');

var position = new system.System("Position");

position.init = function() {
    console.log();
}

position.addEntity = function(entity_name) {
    this.entities.push(entity_name);
}

position.update = function(name) {
    name.components.Position.x = 55;
    name.components.Position.y = 65;
}

module.exports = position;
