var app = require('express')(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    events = require('./events.js'),
    port = process.env.PORT || 8099;


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