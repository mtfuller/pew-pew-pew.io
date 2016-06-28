var http = require('http');

http.createServer(function (request, response) {
  response.writeHead(200, {
  	'Content-Type': 'text/plain'
  });
  response.end('Hello World!\n');
}).listen(3000);

console.log('Server running at http://192.168.33.10:3000/');
