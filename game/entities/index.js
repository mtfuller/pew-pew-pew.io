const Component = require('./../components');
const Entity = require('./../lib/entity-component-system').Entity;

class Player extends Entity {
    setup() {
        this.addComponent(Component.Position());
        this.addComponent(Component.Velocity());
        this.addComponent(Component.Collision());
        this.addComponent(Component.Health());
        this.addComponent(Component.Gun());
    }
}

class Bullet extends Entity {
    setup() {
        this.addComponent(Component.Position());
        this.addComponent(Component.Velocity());
        this.addComponent(Component.Collision());
        this.addComponent(Component.Bullet());
    }
}

module.exports.Player = Player;
module.exports.Player = Bullet;