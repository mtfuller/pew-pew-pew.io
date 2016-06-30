var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  socket.emit('connected', { hello: 'world' });
  socket.on('input', function (data) {
    console.log(data);
    socket.emit('circle', { x: data.x, y: data.y });
  });
});
