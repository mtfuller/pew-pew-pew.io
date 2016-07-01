var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var number = 1;
var entities = {
    ent1: {
        x: 50,
        y: 50
    },
    ent2: {
        x: 200,
        y: 200
    }
}
var global_x = 50;
var global_y = 50;

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

// Wait for incomming socket to connect
io.on('connection', function (socket) {

    // Response that user has been connected
    socket.emit('connected', { hello: 'world' });

    // Check if new player can be created
    if (true) {
        // Validate User
        socket.emit('authenticated', { id: number });
        number++;

        // Add player

        socket.on('input', function (data) {
            if (data.id == 1) {
                entities.ent1.x = data.x;
                entities.ent1.y = data.y;
            } else if (data.id == 2) {
                entities.ent2.x = data.x;
                entities.ent2.y = data.y;
            } else {

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
