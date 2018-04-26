const Component = require('./../components');
const Entity = require('./../lib/entity-component-system').Entity;

class Player extends Entity {
    setup() {
        this.addComponent(Component.Position());
        this.addComponent(Component.Velocity());
        this.addComponent(Component.Collision());
    }
}

module.exports.Player = Player;