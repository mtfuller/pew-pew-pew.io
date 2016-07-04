var system = require('./system.js');

module.exports = new system.System("Position");

module.exports.init = function() {
    console.log();
}

module.exports.addEntity = function(entity_name) {
    this.entities.push(entity_name);
}

module.exports.update = function(name) {
    name.components.Position.x = 55;
    name.components.Position.y = 65;
}
