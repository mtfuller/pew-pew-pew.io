const System = require('./../lib/entity-component-system').System;
const Bullet = require('./../entities').Bullet;
const logger = require('./../../logger');

class ShootingSystem extends System {
    setup() {
        this.maxBulletLifespan = 200;
        this.bulletDecayRate = 1;
        this.maxCoolDown = 100;
        this.coolDownRate = 5;
    }

    /**
     *
     * @param id
     * @param entity
     */
    update(id, entity) {
        if (entity.hasOwnProperty("gun")) {
            if (entity.gun.trigger && entity.gun.coolDown <= 0) {
                let bulletX = (10 * Math.cos(entity.velocity.theta * (Math.PI / 180)))
                    + entity.position.x;

                let bulletY = (10 * Math.sin(entity.velocity.theta * (Math.PI / 180)))
                    + entity.position.y;

                let bullet = new Bullet({
                    position: {
                        x: bulletX,
                        y: bulletY
                    },
                    velocity: {
                        magnitude: 2,
                        theta: entity.velocity.theta
                    },
                    bullet: {
                        life: this.maxBulletLifespan,
                        player: id
                    }
                });

                this.game.addEntity(bullet);

                entity.gun.coolDown = this.maxCoolDown;
                entity.gun.trigger = false;
            } else {
                entity.gun.coolDown -= this.coolDownRate;
                entity.gun.trigger = false;
                if (entity.gun.coolDown < 0)
                    entity.gun.coolDown = 0;
            }
        } else if (entity.hasOwnProperty("bullet")) {
            if (entity.bullet.life <= 0) {
                this.game.removeEntity(id);
            } else {
                entity.bullet.life -= this.bulletDecayRate;
            }
        }
    }
}

module.exports = ShootingSystem;
