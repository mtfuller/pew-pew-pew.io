var system = require('./system.js');

var position = new system.System("Position");

position.init = function() {
    console.log();
}

position.addEntity = function(entity_name) {
    this.entities.push(entity_name);
}

position.update = function(name) {
}

module.exports = position;
