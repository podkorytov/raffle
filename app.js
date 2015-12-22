var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var events = require('./events.js');
app.use(express.static(path.join(__dirname, '/')));

app.get('/a', function(req, res){
  res.sendfile('templates/admin.html');
});
app.get('/r', function(req, res){
  res.sendfile('templates/registration.html');
});
app.get('/', function(req, res){
  res.sendfile('templates/raffle.html');
});


http.listen(3000, function(){

});


io.on('connection', function(socket){
  socket.on('raffle', function(msg){
    events.raffleToAdmin(msg);
    events.raffleToRegister(msg);
  });
});

io.on('connection', function(socket){
  socket.on('admin', function(msg){
    events.adminToRegistration(msg);
    events.adminToRaffle(msg, function(viktorine) {
      io.emit('raffle', viktorine);
    });
  });
});

io.on('connection', function(socket){
  socket.on('registration', function(msg){
      events.registrationToRaffle(msg, function(user) {
        io.emit('raffle', user);
      });
  });
});