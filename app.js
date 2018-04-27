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

// User Management System
const UserManager = require('./auth');
const userManager = new UserManager(config);

// pew-pew-pew.io Game Engine
const GameEngine = require('./game');
const gameEngine = new GameEngine({
    clock: 30,
    worldWidth: 1000,
    worldHeight: 1000,
    maxPlayers: 2
});

// Logger module
const logger = require('./logger');

// Setup express to serve all files in the "public" directory
app.use('/static', express.static('public'));

// Define the index route, which sends the user the main view to the game
app.get('/', function(req, res) {
    res.sendfile(__dirname + '/view/index.html');
});

// Tell Socket.io to wait for any incoming connections
io.on('connection', function (socket) {
    logger.info("User connected...");

    // When a user joins, create a new player in the game
    let player = null;
    userManager.createUser().then(user => {
        player = user;

        // Add a new player to the game, under the given UUID
        logger.info("New player joining...");
        return gameEngine.addPlayer(user.uuid).then(uuid => {
            logger.info("Added player ("+uuid+") to game.");
            logger.info("Current players: " + gameEngine.getNumberOfPlayers());

            // Send back a "Join" message to the client with their JWT token
            socket.emit('join', {token: user.token});
        }).catch(err => {
            logger.error("Cannot add player");
            logger.error(err);
        });
    }).then(() => {
        // Tell Socket.io to handle incoming input messages from game clients
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
    }).catch(err => {
        // Log any encountered errors
        logger.error(err);
    });
});

// Start server on specified port
server.listen(config.port, function(){
    logger.info("Server started on port " + config.port);
    gameEngine.run();
});
