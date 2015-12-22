var db = require('./db_model.js');
var filesystem = require('./filesystem');

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
    msg = JSON.parse(msg);
    var img_name = msg.code + '.png';
    console.log(img_name);
     var img_content = msg.img_content;

    filesystem.saveFromBase64(img_content, img_name, function(img_url) {
        msg.img_url = img_url;
        var user = new db.User(msg);
        user.save(function(err) {
            if (err) {
                console.log(err);
            } else {
                callback(user);
            }
        });
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