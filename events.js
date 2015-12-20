var db = require('./db_model.js');

module.exports.raffleToAdmin = function(msg) {
//    io.emit('admin', 'Можно начать новый конкурс');
};

module.exports.raffleToRegister = function(msg) {
//    io.emit('registration', 'Регистрация открыта');
};

module.exports.adminToRegistration = function(msg) {
//    io.emit('registration', 'Регистрация приостановлена');
};

module.exports.adminToRaffle = function(msg, callback) {
    var type = msg.type;

    db.User.getRandom(function(err, docs) {
        var victorine = new db.Victorine({winner: docs[0], type: type, prize:'Iphone'});
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

module.exports.registrationToAdmin = function(msg) {
 
};

module.exports.registrationToRaffle = function(msg, callback) {
    var user = new db.User(msg);
    user.save(function(err) {
        if (err) {
            console.log(err);
        } else {
            callback(user);
        }
    });
};