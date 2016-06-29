var express = require('express');
var app = express();
var test = require("./game_file");

app.get('/', function (req, res) {
  res.send(test.foo());
});

app.get('/Wow', function (req, res) {
  res.send('Wow!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
