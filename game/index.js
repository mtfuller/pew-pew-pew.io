const Manager = require('./lib/entity-component-system').Manager;
const System = require('./systems');
const Player = require('./entities').Player;

const SpatialHashmap = require('./lib/spatial-hashmap');

const logger = require('./../logger');

class Game {
    /**
     *
     */
    constructor(config={}) {
        // Game settings
        this.running = false;
        this.clock = config.clock || 20;
        this.maxPlayers = config.maxPlayers || 10;
        this.worldWidth = config.worldWidth || 1000;
        this.worldHeight = config.worldHeight || 1000;
        this.players = {};

        // Creating new Spatial Hashmap, used for efficient collision checking
        this.spatialHashmap = new SpatialHashmap({
            width: this.worldWidth,
            height: this.worldHeight,
            cellSize: 5
        });

        // Setting up ECS system
        this.manager = new Manager(this);
        this.manager.addSystem(new System.CollisionSystem());
        this.manager.addSystem(new System.VelocitySystem());
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
        let game = this;
        return new Promise((resolve, reject) => {
            if (game.isGameFull()) reject("Game is full, please wait.");

            let playerEntity = new Player({
                position: {
                    x: 50,// + Math.floor(Math.random() * 10),
                    y: 50 //+ Math.floor(Math.random() * 10)
                },
                velocity: {
                    magnitude: 1,
                    theta: 0
                }
            });

            game.players[uuid] = {
                entity: playerEntity
            };

            game.spatialHashmap.addEntity(uuid, playerEntity.position);
            game.manager.addEntity(uuid, playerEntity);
            resolve(uuid);
        });
    }

    hasPlayer(id) {
        return this.players.hasOwnProperty(id);
    }

    /**
     *
     * @param uuid
     * @returns {Promise}
     */
    removePlayer(uuid) {
        let game = this;
        return new Promise((resolve, reject) => {
            if (!game.players.hasOwnProperty(uuid))
                reject("Can't remove player. Player ("+uuid+") does not " +
                    "exist.");
            delete game.players[uuid];
            game.spatialHashmap.removeEntity(uuid);
            game.manager.removeEntity(uuid);
            resolve(uuid);
        });
    }

    /**
     *
     * @param uuid
     * @param input
     * @returns {Promise}
     */
    updatePlayer(uuid, input) {
        return new Promise((resolve, reject) => {
            if (!this.hasPlayer(uuid)) reject("Player doesn't exist");

            if (input.hasOwnProperty("theta") && Number.isInteger(input.theta)) {
                let theta = input.theta;
                if (theta < 0 || theta > 360) reject("Theta value is invalid.");
                this.players[uuid].entity.velocity.theta = theta;
            }

            resolve(uuid);
        });
    }

    /**
     *
     * @param uuid
     * @returns {Promise} fiejwofje
     *                    {
     *                          uuid: <The UUID of the player>,
     *                          player: {
     *                              x: <x-coordinate>,
     *                              y: <y-coordinate>
     *                          },
     *                          entities: <List of nearby entities>,
     *                    }
     */
    getClientData(uuid) {
        let game = this;
        return new Promise((resolve, reject) => {
            if (!game.players.hasOwnProperty(uuid) || !game.hasPlayer(uuid))
                reject("Player ("+uuid+") does not exist.");

            let otherEntities = game.spatialHashmap
                .getOtherEntities(uuid)
                .map(uuid => game.players[uuid].entity);

            resolve({
                player: game.players[uuid].entity,
                entities: otherEntities
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