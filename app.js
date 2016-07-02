var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var uuid = require('node-uuid');

var number = 1;
var entities = {};

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

// Wait for incomming socket to connect
io.on('connection', function (socket) {

    var user_id = uuid.v1();
    console.log(user_id);

    // Response that user has been connected
    socket.emit('connected', { id: user_id });

    // Check if new player can be created
    if (true) {
        // Validate User
        //socket.emit('authenticated', { id: number });
        //number++;

        // Add player

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

        socket.on('update', function () {
            socket.emit('circle', entities);
        });
    } else {

    };
});

server.listen(3000, function(){
  console.log('SERVER START - Serving on port 3000')
  // Server START
  // Setup Game
});
