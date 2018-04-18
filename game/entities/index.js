const Component = require('../components');

class Player extends Entity {
    setup() {
        this.addComponent(Component.Position);
        this.addComponent(Component.Velocity);
        this.addComponent(Component.Collision);
    }
}

module.exports.Player = Player;