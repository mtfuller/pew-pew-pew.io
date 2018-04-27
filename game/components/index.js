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

const Health = Component("health", {
    hp: 100
});

const Gun = Component("gun", {
    trigger: false,
    coolDown: 1000
});

const Bullet = Component("bullet", {
    life: 50
});

module.exports.Position = Position;
module.exports.Velocity = Velocity;
module.exports.Collision = Collision;
module.exports.Health = Health;
module.exports.Gun = Gun;
module.exports.Gun = Bullet;