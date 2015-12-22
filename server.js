var express = require('express'),
    path = require('path'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    events = require('./events.js'),
    port = process.env.PORT || 8099;

app.use(express.static(path.join(__dirname, '/public')));

app.get('/adm', function(req, res) {
    res.sendfile('templates/admin.html');
});

app.get('/reg', function(req, res) {
    res.sendfile('templates/registration.html');
});

app.get('/', function(req, res) {
    res.sendfile('templates/raffle.html');
});

http.listen(port, function() {

});

io.on('connection', function(socket) {
    socket.on('raffle', function(msg) {
        events.raffleToAdmin(msg);
        events.raffleToRegister(msg);
    });

    socket.on('admin', function(msg) {
        events.adminToRegistration(msg);
        events.adminToRaffle(msg, function(viktorine) {
            io.emit('raffle', viktorine);
        });
    });

    socket.on('registration', function(msg) {
        events.registrationToRaffle(msg, function(user) {
            io.emit('raffle', user);
        });
    });
});