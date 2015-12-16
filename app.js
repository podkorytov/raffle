#!/usr/bin/nodejs

var express = require('express'),
    app = express(),
    server = require('http').Server(app),
    wss = new require('ws').Server({port: process.env.WS_PORT || 8095}),
    port = process.env.PORT || 8065;

server.listen(port);
app.use(express.static('public'));

app.get('/reg', function(req, res) {
    res.sendfile(__dirname + '/public/index.html');
});

app.get('/veiw', function(req, res) {
    res.sendfile(__dirname + '/public/view.html');
});

wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        client.send(data);
    });
};

wss.on('connection', function (ws) {
    var allGuests = [
        {
            name: 'Вася',
            ava: '/sjdasjdasjd.jpg',
            is_online: true,
            inside: '24 декабря'
        }
    ];

    ws.send(JSON.stringify(allGuests));

    ws.on('message', function (message) {
        console.log(message);
    });
});