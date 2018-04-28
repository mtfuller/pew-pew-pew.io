const Component = require('./../components');
const Entity = require('./../lib/entity-component-system').Entity;

/**
 * Defining the Player entity. Players have a position/velocity in the world, as
 * well as an ammount of health that keeps them alive in the world.
 */
class Player extends Entity {
    setup() {
        this.addComponent(Component.Position());
        this.addComponent(Component.Velocity());
        this.addComponent(Component.Collision());
        this.addComponent(Component.Health());
        this.addComponent(Component.Gun());
    }
}

/**
 * Defining the Bullet entity. Bullets have a position/velocity in the world,
 * but will eventually despawn after a certain amount of time.
 */
class Bullet extends Entity {
    setup() {
        this.addComponent(Component.Position());
        this.addComponent(Component.Velocity());
        this.addComponent(Component.Collision());
        this.addComponent(Component.Bullet());
    }
}

module.exports.Player = Player;
module.exports.Bullet = Bullet;