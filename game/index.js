// Import the uuid module, used to generate unique player ids
const uuid = require('node-uuid');

// Import several ECS modules
const Manager = require('./lib/entity-component-system').Manager;
const System = require('./systems');
const Player = require('./entities').Player;

// Import the SpatialHashmap class, used for efficiently storing entities within
// a spatial grid.
const SpatialHashmap = require('./lib/spatial-hashmap');

// Logging system
const logger = require('./../logger');

/**
 * The Game class is used to manage an instance of the pew-pew-pew.io game.
 */
class Game {
    /**
     * Inits a Game object using a config object.
     *
     * @param config    An object that contains several config properties.
     *                  Available config parameters:
     *                      {
     *                          clock:  The number of millis in between game
     *                                  updates
     *                          maxPlayers: The maximum number of players that
     *                                      can play in this game instance.
     *                          worldWidth: The width of the entire board.
     *                          worldHeight: The height of the entire board.
     *                      }
     */
    constructor(config={}) {
        // Game settings
        this.running = false;
        this.clock = config.clock || 20;
        this.maxPlayers = config.maxPlayers || 10;
        this.worldWidth = config.worldWidth || 1000;
        this.worldHeight = config.worldHeight || 1000;

        // Initialize player and entity containers
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
     * Set up the given function to run every time the player of the given uuid
     * is updated.
     *
     * @param uuid  The UUID of the player.
     * @param func  The function to be called when the player is updated.
     */
    addOnUpdateHandler(uuid, func) {
        this.players[uuid].update = func;
    }

    /**
     * Set up the given function to run when the player of the given uuid has
     * lost the game.
     *
     * @param uuid  The UUID of the player.
     * @param func  The function to be called when the player has lost.
     */
    addPlayerLoseHandler(uuid, func) {
        this.players[uuid].lose = func;
    }

    /**
     * Runs the instance of the pew-pew-pew.io game.
     */
    run() {
        logger.info('Starting game...');
        this.running = true;
        this.update();
    }

    /**
     * Stops the instance of the pew-pew-pew.io game.
     */
    stop() {
        this.running = false;
    }

    /**
     * Returns true if there exists a player for the given UUID.
     *
     * @param uuid
     * @returns {boolean}
     */
    hasPlayer(uuid) {
        return this.players.hasOwnProperty(uuid);
    }

    /**
     * Returns a Promise which, when fulfilled, adds a new player to the game,
     * under the given UUID.
     *
     * @param uuid          The UUID of the player that is to be added.
     * @returns {Promise}
     */
    addPlayer(uuid) {
        let game = this;
        return new Promise((resolve, reject) => {
            // Makes sure UUID is valid and player can join.
            if (game.isGameFull()) reject("Game is full, please wait.");
            if (!uuid) reject("UUID is not valid");
            if (game.hasPlayer(uuid)) reject("Player already is in game");

            // Create new player entity
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

            // Final sanity check to make sure game is not full before adding
            // player.
            if (!game.isGameFull()) {
                game.players[uuid] = {
                    score: 0,
                    entity: playerEntity
                };
                game.addEntity(playerEntity, uuid);
            }

            resolve(uuid);
        });
    }

    /**
     * Returns a Promise which, when fulfilled, removes the player under the
     * given UUID.
     *
     * @param uuid          The UUID of the player to remove.
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

    /**
     * Adds the entity to the game, under the given ID.
     *
     * @param entity    The Entity object to be added to the game.
     * @param id        The ID that will be associated with the entity.
     */
    addEntity(entity, id=uuid.v1()) {
        this.entities[id] = entity;
        this.spatialHashmap.addEntity(id, entity.position);
        this.manager.addEntity(id, entity);
    }

    /**
     * Removes the entity, associated with the given id, from the game.
     *
     * @param id    The ID of the entity to be removed.
     */
    removeEntity(id) {
        delete this.entities[id];
        this.spatialHashmap.removeEntity(id);
        this.manager.removeEntity(id);
    }

    /**
     * Returns the score of the player of the given UUID. If no player exists,
     * return null;
     *
     * @param uuid  The UUID of the player.
     * @returns {Number|null}
     */
    getPlayerScore(uuid) {
        if (this.hasPlayer(uuid)) {
            return this.players[uuid].score;
        } else {
            return null;
        }
    }

    /**
     * Adds a number of points to the score of the player under the given UUID.
     *
     * @param uuid      The UUID of the player.
     * @param points    The number of points to add to the player's score.
     */
    addPlayerScore(uuid, points) {
        if (this.hasPlayer(uuid)) {
            this.players[uuid].score += points;
        }
    }

    /**
     * Returns a Promise which, when fulfilled, updates the player entity under
     * the given UUID.
     *
     * @param uuid          The UUID of the player.
     * @param input         An object containing update data from the client.
     *                      There are two available controlling properties:
     *                          {
     *                              theta:      the angle, in degrees, the ship
     *                                          should face.
     *                              trigger:    a boolean that specifies if the
     *                                          gun's trigger should be pulled
     *                                          or not.
     *                          }
     * @returns {Promise}
     */
    updatePlayer(uuid, input) {
        return new Promise((resolve, reject) => {
            if (!this.hasPlayer(uuid))
                reject("Player doesn't exist");

            // If the input object has a "theta" property, update their ship's
            // direction.
            if (input.hasOwnProperty("theta") && Number.isInteger(input.theta)) {
                let theta = input.theta;
                if (theta < 0 || theta > 360) reject("Theta value is invalid.");
                this.players[uuid].entity.velocity.theta = theta;
            }

            // If the input object has a "trigger" property, set their ship's
            // gun to that value.
            if (input.hasOwnProperty("trigger") && typeof(input.trigger) === "boolean") {
                this.players[uuid].entity.gun.trigger = input.trigger;
            }

            resolve(uuid);
        });
    }

    /**
     * Returns a Promise which, when fulfilled, resolves with an object
     * containing client data for the player under the given UUID.
     *
     * @param uuid          The UUID of the player.
     * @returns {Promise}
     */
    getClientData(uuid) {
        let game = this;
        return new Promise((resolve, reject) => {
            if (!game.hasPlayer(uuid))
                reject("Player ("+uuid+") does not exist.");

            // Collect all of the other entities, excluding the player of the
            // given UUID
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
     * Returns the number of players currently playing on the game instance.
     */
    getNumberOfPlayers() {
        return Object.keys(this.players).length;
    }

    /**
     * Returns true if the current game instance is full.
     */
    isGameFull(){
        return Object.keys(this.players).length >= this.maxPlayers;
    }

    /**
     * Iterate through all players in the instance of the game and call each
     * individual's update function, which will send client data back to the
     * user.
     */
    onUpdate() {
        let game = this;
        for (let player in this.players) {
            this.getClientData(player).then(data => {
                if (game.players[player].update)
                    game.players[player].update(data)
            }).catch(err => {
                logger.error(err);
            });
        }
    }

    /**
     *
     */
    update() {
        // Update the game and send client data
        this.manager.update();
        this.onUpdate();

        // If the game is still running, wait a certain amount of time and run
        // update again.
        if (this.running) {
            setTimeout(() => {
                this.update();
            }, this.clock);
        }
    }
}

module.exports = Game;