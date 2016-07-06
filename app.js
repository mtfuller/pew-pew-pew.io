var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var uuid = require('node-uuid');
var hello = require('./game_core');

var number = 1;
var entities = {};

// Main Route
app.get('/', function(req, res) {
    res.sendfile(__dirname + '/view/index.html');
});

// Wait for incomming socket to connect
io.on('connection', function (socket) {


    var user_id = uuid.v1();
    console.log(socket.id);

    // Response that user has been connected
    socket.emit('connected', { id: user_id });

    // Check if new player can be created
    if (true) {
        // Validate User
        //socket.emit('authenticated', { id: number });
        //number++;

        // Add player to game


        // Wait for input from player
        socket.on('input', function (data) {
            if (entities.hasOwnProperty(data.id)) {
                entities[data.id].x = data.x;
                entities[data.id].y = data.y;
            } else {
                entities[data.id] = {
                    x: data.x,
                    y: data.y
                }
            }
        });

        // When player asks for update
        socket.on('update', function () {
            socket.emit('circle', entities);
            socket.emit('render', hello.getClientData());
        });
    } else {

    };

    // When User disconnects
    socket.on('disconnect', function () {
        socket.emit('disconnected');
        delete entities[user_id];
        console.log(entities);
    });

});

server.listen(3000, function(){
  console.log('SERVER START - Serving on port 3000')
  // Server START
  // Setup Game
  hello.setupGame();
  hello.addEntity();
  hello.startGame();
});
