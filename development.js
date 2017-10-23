// production.js
var deployd = require('deployd');

var server = deployd({
  port: process.env.PORT || 8080,
  env: 'development',
  db: {
    host: 'localhost',      // Our mongo instance runs in our server itself. Remember? (127.0.0.1)
    port: 27017,            // Update this line,
    name: 'deployd',          // this line,
    credentials: {
      username: 'deployd', // this line,
      password: 'deployd'  // and this line.
    }
  }
});

server.listen();

server.on('listening', function() {
  console.log("Server is listening");
});

server.on('error', function(err) {
  console.error(err);
  process.nextTick(function() { // Give the server a chance to return an error
    process.exit();
  });
});
