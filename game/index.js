const Manager = require('./lib/entity-component-system').Manager;
const System = require('./systems');
const Entity = require('./entities');

const SpatialHashmap = require('./lib/spatial-hashmap');
const logger = require('./../logger');

class Game {
    /**
     *
     */
    constructor() {
        this.running = false;
        this.spatialHashmap = new SpatialHashmap();
        this.clock = 20;

        this.manager = new Manager(this);
        this.manager.addSystem(System.CollisionSystem);
        this.manager.addSystem(System.VelocitySystem);
    }

    /**
     *
     */
    run() {
        logger.info('Starting game...');
        this.running = true;
        this.update();
    }

    /**
     *
     */
    stop() {
        this.running = false;
    }

    /**
     *
     * @param uuid
     */
    addPlayer(uuid) {
        logger.info("Player joining...");
    }

    /**
     *
     * @param uuid
     */
    removePlayer(uuid) {
        logger.info("Kicked player...");
    }

    getClientData(uuid) {

    }

    /**
     *
     */
    update() {
        this.manager.update();
        if (this.running) {
            setTimeout(() => {
                this.update();
            }, this.clock);
        }
    }
}

module.exports = Game;