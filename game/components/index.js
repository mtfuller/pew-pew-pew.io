const Component = require('./../lib/entity-component-system').Component;

// Position component used to keep track with each entity's position in the
// world
const Position = Component("position", {
    x: 0,
    y: 0
});

// Velocity component used to hold information on each entity's constant
// velocity
const Velocity = Component("velocity", {
    magnitude: 0.0,
    theta: 0.0
});

// Collision component specifies whether or not other entities can collide with
// the entity.
const Collision = Component("collision", {
    isCollidable: true
});

// Health component specifies how much life the entity has in game
const Health = Component("health", {
    hp: 100
});

// Gun component is used to keep track if an entity can/wants to spawn a bullet
const Gun = Component("gun", {
    trigger: false,
    coolDown: 0
});

// Bullet component is used to keep track with how long the bullet is active and
// who shot the bullet.
const Bullet = Component("bullet", {
    life: 50,
    player: ""
});

module.exports.Position = Position;
module.exports.Velocity = Velocity;
module.exports.Collision = Collision;
module.exports.Health = Health;
module.exports.Gun = Gun;
module.exports.Bullet = Bullet;