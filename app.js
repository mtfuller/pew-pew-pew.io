// Import settings
const config = require('./config.json');

// Express and Socket.io Imports
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
    'pingInterval': 2000,
    'pingTimeout': 5000
});

// Setup express to serve all files in the "public" directory
app.use('/static', express.static('public'));

// User Management System
const UserManager = require('./auth');
const userManager = new UserManager(config);

// pew-pew-pew.io Game Engine
const GameEngine = require('./game');
const gameEngine = new GameEngine({
    clock: config.clock,
    worldWidth: config.worldWidth,
    worldHeight: config.worldHeight,
    maxPlayers: config.maxPlayers
});

// Logger module
const logger = require('./logger');

function joinGame(socket) {
    // When a user joins, create a new player in the game
    let player = null;
    userManager.createUser().then(user => {
        player = user;

        // Add a new player to the game, under the given UUID
        logger.info("New player joining...");
        return gameEngine.addPlayer(player.uuid);
    }, err => {
        logger.error("COULD NOT CREATE USER");
        return Promise.reject(err);
    }).then(uuid => {
        logger.info("Added player (" + uuid + ") to game.");
        logger.info("Current players: " + gameEngine.getNumberOfPlayers());

        // Send back a "Join" message to the client with their JWT token
        socket.emit('join', {token: player.token});

        // Tell Socket.io to receive input messages from client to control their
        // ship
        socket.on('input', function (data) {
            userManager.verifyUser(data.token).then(decoded => {
                return gameEngine.updatePlayer(decoded.id, data.input);
            }).then(uuid => {}).catch(err => {
                logger.error("Could not verify token: " + err);
            });
        });

        // Set the handler callback, which is called at each tick of the game
        gameEngine.addOnUpdateHandler(player.uuid, function () {
            gameEngine.getClientData(player.uuid).then(data => {
                socket.emit('update', {
                    token: player.token,
                    score: data.score,
                    player: data.player,
                    entities: data.entities
                });
            }).catch(err => {
                logger.error(err);
            });
        });

        // Set the handler callback, which is called at each tick of the game
        gameEngine.addPlayerLoseHandler(player.uuid, function () {
            socket.emit("game_over", {});
            socket.disconnect(true);
        });

        // Tell Socket.io how to handle a player disconnecting from the game
        socket.on('disconnect', function () {
            socket.emit('disconnected');
            logger.info("Player ("+player.uuid+") disconnected...");

            // Remove the player from the game
            gameEngine.removePlayer(player.uuid).then(uuid => {
                logger.info("Current players: " + gameEngine.getNumberOfPlayers());
            }).catch(err => {
                logger.error(err);
            });
        });
    }, err => {
        logger.error(err);
        socket.emit('game_full', {});
    });
}

// Define the index route, which sends the user the main view to the game
app.get('/', function(req, res) {
    res.sendfile(__dirname + '/view/index.html');
});

// Tell Socket.io to wait for any incoming connections
io.on('connection', function (socket) {
    logger.info("User connected...");
    joinGame(socket);
});

// Start server on specified port
server.listen(config.port, function(){
    logger.info("Server started on port " + config.port);
    gameEngine.run();
});
