const System = require('./../lib/entity-component-system').System;
const logger = require('./../../logger');

class ShootingSystem extends System {
    setup() {
        this.maxBulletLifespan = 50;
        this.maxCoolDown = 100;
    }

    /**
     *
     * @param id
     * @param entity
     */
    update(id, entity) {

    }
}

module.exports = ShootingSystem;
