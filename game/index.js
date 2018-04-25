const Manager = require('./lib/entity-component-system').Manager;
const System = require('./systems');
const Player = require('./entities').Player;

const SpatialHashmap = require('./lib/spatial-hashmap');

const logger = require('./../logger');

class Game {
    /**
     *
     */
    constructor() {
        // Game settings
        this.running = false;
        this.clock = 20;
        this.maxPlayers = 10;
        this.players = {};

        // Creating new Spatial Hashmap, used for efficient collision checking
        this.spatialHashmap = new SpatialHashmap();

        // Setting up ECS system
        this.manager = new Manager(this);
        this.manager.addSystem(System.CollisionSystem);
        this.manager.addSystem(System.VelocitySystem);
    }

    addOnUpdateHandler(uuid, func) {
        this.players[uuid].update = func;
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
     * @returns {Promise}
     */
    addPlayer(uuid) {
        logger.info("Player joining...");
        let game = this;
        return new Promise((resolve, reject) => {
            if (game.isGameFull()) reject("Game is full, please wait.");
            game.players[uuid] = {
                entity: new Player({})
            };
            game.spatialHashmap.addEntity(uuid, game.players[uuid].entity.position);
            logger.info("Added new player!");
            resolve(uuid);
        });
    }

    /**
     *
     * @param uuid
     * @returns {Promise}
     */
    removePlayer(uuid) {
        logger.info("Kicking player...");
        let game = this;
        return new Promise((resolve, reject) => {
            if (!game.players.hasOwnProperty(uuid))
                reject("Can't remove player. Player ("+uuid+") does not " +
                    "exist.");
            delete game.players[uuid];
            game.spatialHashmap.removeEntity(uuid);
            logger.info("Removed player!");
            resolve(uuid);
        });
    }

    /**
     *
     * @param uuid
     * @param input
     */
    updatePlayer(uuid, input) {

    }

    /**
     *
     * @param uuid
     */
    getClientData(uuid) {
        logger.info("Getting client data...");
        let game = this;
        return new Promise((resolve, reject) => {
            if (!game.players.hasOwnProperty(uuid))
                reject("Player ("+uuid+") does not exist.");

            resolve({
                uuid: uuid,
                data: game.players[uuid]
            });
        });
    }

    /**
     *
     */
    getNumberOfPlayers() {
        return Object.keys(this.players).length;
    }

    /**
     *
     */
    isGameFull(){
        return this.players.length >= this.maxPlayers;
    }

    /**
     *
     */
    onUpdate() {
        for (let player in this.players) {
            this.getClientData(player).then(data => {
                this.players[player].update(data)
            }).catch(err => {
                logger.error(err);
            });
        }
    }

    /**
     *
     */
    update() {
        this.manager.update();
        this.onUpdate();
        if (this.running) {
            setTimeout(() => {
                this.update();
            }, this.clock);
        }
    }
}

module.exports = Game;