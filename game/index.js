const Manager = require('/lib/entity-component-system');
const System = require('./systems');
const Entity = require('./entities');

const SpatialHashmap = require('/lib/spatial-hashmap');
const logger = require('/lib/logger');

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
        update();
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

    /**
     *
     */
    update() {
        logger.info('Updating game...');
        this.manager.update();
        if (this.running) {
            setTimeout(() => {
                this.update();
            }, this.clock);
        }
    }
}

module.exports = Game;