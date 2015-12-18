var db = require('./db_model.js');

module.exports.raffleToAdmin = function(msg) {
    io.emit('admin', 'Можно начать новый конкурс');
};

module.exports.raffleToRegister = function(msg) {
    io.emit('registration', 'Регистрация открыта');
};

module.exports.adminToRegistration = function(msg) {
    io.emit('registration', 'Регистрация приостановлена');
};

module.exports.adminToReffle = function(msg) {
    io.emit('raffle', 'Старт лотереи');
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