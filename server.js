var express = require('express'),
    path = require('path'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    events = require('./events.js'),
    port = process.env.PORT || 8099;

app.use(express.static(path.join(__dirname, '/public')));

app.get('/adm', function(req, res) {
    res.sendFile(__dirname + '/templates/admin.html');
});

app.get('/reg', function(req, res) {
    res.sendFile(__dirname + '/templates/registration.html');
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/templates/raffle.html');
});

http.listen(port, function() {

});

io.on('connection', function(socket) {

    events.guestsListsToRaffle(function(error, users) {
        if (error) {
            console.log(error);
        } else {
            io.emit('guests', users);
        }
    });

    socket.on('raffle', function(msg) {
        events.raffleToAdmin(msg);
        events.raffleToRegister(msg);
    });

    socket.on('admin', function(msg) {
        events.adminToRegistration(msg);
        events.adminToRaffle(msg, function(error, viktorine) {
            if (error) {
                io.emit('admin_error', error);
            } else {
                io.emit('raffle', viktorine);
            }
        });
    });

    socket.on('registration', function(msg) {
        events.registrationToRaffle(msg, function(error, user) {
            if (error) {
                io.emit('registration_error', error);
            } else {
                io.emit('raffle', user);
            }
        });
    });
});