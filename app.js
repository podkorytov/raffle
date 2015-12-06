#!/usr/bin/nodejs

var app = require('express')(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    port = process.env.PORT || 8065;

server.listen(port);

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/public/index.html');
});

io.on('connection', function(socket) {

    socket.emit('hello', { hello: 'world' });

    socket.on('new_guy', function(data) {
        console.log(data);
        console.log(data.room);
        socket.emit('success', { ok: 'doc' });
    });

});