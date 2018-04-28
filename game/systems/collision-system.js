const System = require('./../lib/entity-component-system').System;
const logger = require('./../../logger');

/**
 * The CollisionSystem is a system in the ECS that continously checks for
 * collision among entities in the world. The CollisionSystem utilizes the
 * SpatialHashmap for more efficient collision detection.
 */
class CollisionSystem extends System {
    /**
     * The setup function that is run at instantiation.
     */
    setup() {
        this.entitySize = 8;
    }

    /**
     * Updates the given entity. Specifically, the collision system will check
     * to see if the given entity is colliding with any other entities.
     *
     * @param id        The ID of the entity to update.
     * @param entity    The object of the entity to update.
     */
    update(id, entity) {
        if (entity.collision.isCollidable) {
            // Get entities near current entity
            let x1 = entity.position.x;
            let y1 = entity.position.y;
            let entities = this.game.spatialHashmap
                .getNearbyEntities(id)
                .map(uuid => this.game.entities[uuid]);

            // Check collisions for all passed in entities
            for (let other of entities) {
                if (other.collision.isCollidable) {
                    let x2 = other.position.x;
                    let y2 = other.position.y;

                    let distance = Math.sqrt(Math.pow((x1-x2),2) + Math.pow((y1-y2),2));
                    if (distance <= this.entitySize) {
                        if (entity.hasOwnProperty("health")) {
                            if (other.hasOwnProperty("bullet")) {
                                entity.health.hp -= 25;
                                other.bullet.life = 0;
                                if (entity.health.hp <= 0) {
                                    this.game.addPlayerScore(other.bullet.player, 100);
                                } else {
                                    this.game.addPlayerScore(other.bullet.player, 5);
                                }
                            } else {
                                entity.health.hp = 0;
                                other.health.hp = 0;
                            }
                        }
                    }
                }
            }
        }
    }
}

module.exports = CollisionSystem;
