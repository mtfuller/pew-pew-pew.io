const Component = require('./../lib/entity-component-system').Component;

const Position = Component("position", {
    x: 0,
    y: 0
});

const Velocity = Component("velocity", {
    magnitude: 0.0,
    theta: 0.0
});

const Collision = Component("collision", {
    isCollidable: true
});

module.exports.Position = Position;
module.exports.Velocity = Velocity;
module.exports.Collision = Collision;