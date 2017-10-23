var PORT = process.env.PORT || 8080;
var ENV = process.env.NODE_ENV || 'development';

// setup http + express + socket.io
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server, {'log level': 0});
var rewrite = require('express-urlrewrite');

// setup deployd
require('deployd').attach(server, {
    socketIo: io,  // if not provided, attach will create one for you.
    env: ENV,
    db: {host:'localhost', port:27017, name:'dev-app'}
});

// rewrite any incoming url to /api/$1
app.use(rewrite(/^\/api\/(.*)/, '/$1'));
// After attach, express can use server.handleRequest as middleware
app.use(server.handleRequest);

// start server
server.listen(PORT);