const System = require('./../lib/entity-component-system').System;
const logger = require('./../../logger');

class HealthSystem extends System {
    setup() {
        this.rengerateValue = 0.25;
        this.maxHealth = 100;
    }

    /**
     *
     * @param id
     * @param entity
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
