// =============================================================================
// Author:  Thomas Fuller
// File:    app.js
// =============================================================================
// Description:
//
// =============================================================================

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server, {'pingInterval': 2000, 'pingTimeout': 5000});
var uuid = require('uuid');
var pew_game_engine = require('./game');

// Main Route
app.get('/', function(req, res) {
    res.sendfile(__dirname + '/view/index.html');
});

// Wait for incomming socket to connect
io.on('connection', function (socket) {
    var userIsValid = true;
    var user_id = uuid.v1();
    var conn_time = new Date().getTime();

    // Response that user has been connected
    socket.emit('connected', {});

    console.log(Object.keys(io.sockets.sockets));

    // Wait for client to send a request to join for the game
    socket.on('join', function (data) {
      if (new Date().getTime() - conn_time <= 5000) return;

      // Validate User
      if (userIsValid) {
          // Add player to game
          pew_game_engine.addEntity(user_id);

          console.log(pew_game_engine.getEntity(user_id).getComponent("Position"));

          // Tell user that they can begin to play
          socket.emit('authenticated', { id: user_id });

          // Wait for input from player
          socket.on('input', function (data) {
              var vel = pew_game_engine.getEntity(user_id).getComponent("Velocity");
              vel.theta = data.theta;
          });

          // When player asks for update
          socket.on('update', function () {

              socket.emit('game_data', pew_game_engine.getClientData(user_id));
          });
        } else {
          socket.disconnect();
        }
    });

    // When User disconnects
    socket.on('disconnect', function () {
        socket.emit('disconnected');
        pew_game_engine.removeEntity(user_id);
        console.log("The user ("+user_id+") has disconnected.");
    });
});

server.listen(3000, function(){
  console.log('SERVER START - Serving on port 3000');
  // Server START
  // Setup Game
  pew_game_engine.setupGame();
  pew_game_engine.startGame();
});
