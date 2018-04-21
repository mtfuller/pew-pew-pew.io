const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
    'pingInterval': 2000,
    'pingTimeout': 5000
});

const UserManager = require('./auth');
const userManager = new UserManager();

const GameEngine = require('./game');
const gameEngine = new GameEngine();

const logger = require('./logger');


// Main Route
app.get('/', function(req, res) {
    res.sendfile(__dirname + '/view/index.html');
});

// Wait for incomming socket to connect
io.on('connection', function (socket) {
    logger.info("USER CONNECTED");

    // Response that user has been connected
    userManager.createUser().then(token => {
        socket.emit('join', {token: token});
    });

    socket.on('input', function (data) {
        userManager.verifyUser(data.token).then(payload => {
            logger.info("Updating player input with id: " + payload.id);
        }).catch(err => {
            logger.error("Could not verify token: " + err);
        });
    });

    // When player asks for update
    socket.on('update', function (data) {
        userManager.verifyUser(data.token).then(payload => {
            logger.info("Updating player with id: " + payload.id)
            //socket.emit('game_data', gameEngine.getClientData(user_id));
        }).catch(err => {
            logger.error("Could not verify token: " + err);
        });
    });

    // When User disconnects
    socket.on('disconnect', function () {
        socket.emit('disconnected');
        //pew_game_engine.removeEntity(user_id);
        logger.info("USER DISCONNECTED");
    });
});

server.listen(8080, function(){
    logger.info("Server started on port 8080");
    gameEngine.run();
});
