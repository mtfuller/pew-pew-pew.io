var component = require('./component.js');

var newPositionComponent = function(x_pos, y_pos) {
    var compName = "Position";
    var positionComponent = new component.newComponent(compName);
    positionComponent.data = {
        x: x_pos,
        y: y_pos
    }
    return positionComponent;
}

module.exports.positionComponent = newPositionComponent;
