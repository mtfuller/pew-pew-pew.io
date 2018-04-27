const uuid = require('node-uuid');

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
        this.entities = {};

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
        this.manager.addSystem(new System.HealthSystem());
        this.manager.addSystem(new System.ShootingSystem());
    }

    /**
     *
     * @param uuid
     * @param func
     */
    addOnUpdateHandler(uuid, func) {
        this.players[uuid].update = func;
    }

    /**
     *
     * @param uuid
     * @param func
     */
    addPlayerLoseHandler(uuid, func) {
        this.players[uuid].lose = func;
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

    hasPlayer(uuid) {
        return this.players.hasOwnProperty(uuid);
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
                    x: Math.floor(Math.random() * this.worldWidth),
                    y: Math.floor(Math.random() * this.worldHeight)
                },
                velocity: {
                    magnitude: 1,
                    theta: 0
                }
            });

            game.players[uuid] = {
                score: 0,
                entity: playerEntity
            };
            game.addEntity(playerEntity, uuid);

            resolve(uuid);
        });
    }

    /**
     *
     * @param uuid
     * @returns {Promise}
     */
    removePlayer(uuid) {
        let game = this;
        return new Promise((resolve, reject) => {
            if (!game.hasPlayer(uuid))
                reject("Can't remove player. Player ("+uuid+") does not " +
                    "exist.");


            let lose = null;
            if (game.players[uuid].hasOwnProperty("lose"))
                lose = game.players[uuid].lose;

            delete game.players[uuid];
            if (lose) lose();
            game.removeEntity(uuid);

            resolve(uuid);
        });
    }

    addEntity(entity, id=uuid.v1()) {
        this.entities[id] = entity;
        this.spatialHashmap.addEntity(id, entity.position);
        this.manager.addEntity(id, entity);
    }

    removeEntity(entityId) {
        delete this.entities[entityId];
        this.spatialHashmap.removeEntity(entityId);
        this.manager.removeEntity(entityId);
    }

    getPlayerScore(uuid) {
        if (this.hasPlayer(uuid)) {
            return this.players[uuid].score;
        } else {
            return null;
        }
    }

    addPlayerScore(uuid, points) {
        if (this.hasPlayer(uuid)) {
            this.players[uuid].score += points;
        }
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

            if (input.hasOwnProperty("trigger") && typeof(input.trigger) === "boolean") {
                this.players[uuid].entity.gun.trigger = input.trigger;
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
                .map(uuid => game.entities[uuid]);

            resolve({
                score: game.getPlayerScore(uuid),
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
        return Object.keys(this.players).length >= this.maxPlayers;
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