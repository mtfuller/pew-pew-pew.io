const System = require('./../lib/entity-component-system').System;
const logger = require('./../../logger');

/**
 * The HealthSystem is a system in the ECS that continuously regenerates health,
 * as well as removes entities that have no more HP.
 */
class HealthSystem extends System {
    /**
     * The setup() function that runs during instantiation.
     */
    setup() {
        this.rengerateValue = 0.25;
        this.maxHealth = 100;
    }

    /**
     * Updates the given entity. Specifically, the health system continuously
     * updates player health, as well as removes the player if they have no more
     * HP.
     *
     * @param id        The ID of the entity to update.
     * @param entity    The object of the entity to update.
     */
    update(id, entity) {
        if (entity.health) {
            if (entity.health.hp <= 0) {
                logger.info("PLAYER HAS DIED, PLEASE REMOVE!!!");
                this.game.removePlayer(id);
            } else {
                entity.health.hp += this.rengerateValue;
                if (entity.health.hp > this.maxHealth)
                    entity.health.hp = this.maxHealth;
            }
        }
    }
}

module.exports = HealthSystem;
