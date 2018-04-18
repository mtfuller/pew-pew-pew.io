const System = require('/lib/entity-component-system').System;
const logger = require('/lib/logger');

class CollisionSystem extends System {
    setup() {
        this.entitySize = 1;
    }

    /**
     *
     * @param id
     * @param entity
     */
    update(id, entity) {
        if (entity.collision.isCollidable) {
            // Get entities near current entity
            let x1 = entity.position.x;
            let y1 = entity.position.y;
            let entities = this.game.spatialHashMap.getEntitiesNearPlayer(id);

            // Check collisions for all passed in enetities
            for (let other in entities) {
                if (other.collision.isCollidable) {
                    let x2 = other.position.x;
                    let y2 = other.position.y;

                    let distance = Math.sqrt(Math.pow((x1-x2),2) + Math.pow((y1-y2),2));
                    if (distance <= this.entitySize)
                        logger.info('Collision!!!');
                }
            }
        }
    }
}

module.exports = CollisionSystem;
