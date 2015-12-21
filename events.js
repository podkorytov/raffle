var db = require('./db_model.js');

 var raffleToAdmin = function(msg) {
//    io.emit('admin', 'Можно начать новый конкурс');
};

var raffleToRegister = function(msg) {
//    io.emit('registration', 'Регистрация открыта');
};

var adminToRegistration = function(msg) {
//    io.emit('registration', 'Регистрация приостановлена');
};

var adminToRaffle = function(msg, callback) {
    var type = msg.type;

    db.User.getRandom(function(err, docs) {
        var victorine = new db.Victorine({winner: docs[0], type: type, prize: 'Iphone'});
        victorine.save(function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log(victorine);
                callback(victorine);
            }
        });
    });
};

var registrationToAdmin = function(msg) {

};

var registrationToRaffle = function(msg, callback) {
    var user = new db.User(msg);
    user.save(function(err) {
        if (err) {
            console.log(err);
        } else {
            callback(user);
        }
    });
};

module.exports = {
    raffleToAdmin: raffleToAdmin,
    raffleToRegister: raffleToRegister,
    adminToRegistration: adminToRegistration,
    adminToRaffle: adminToRaffle,
    registrationToAdmin: registrationToAdmin,
    registrationToRaffle: registrationToRaffle
};