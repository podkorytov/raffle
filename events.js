var locks = require('locks'),
    mutex = locks.createMutex(),
    db = require('./db_model.js'),
    filesystem = require('./filesystem');

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
    if (mutex.tryLock()) {
        var type = msg.type,
            criteria = {};

        switch (type) {
            case 'iphone':
                criteria.in_corp = true;
                break;
            case 'uniq':
                criteria.is_winner = false;
                break;
            default:
                break;
        }

        db.User.getRandom(criteria, function(err, winner) {
            if (winner) {
                var victorine = new db.Victorine({winner: winner, type: type});
                winner.is_winner = true;
                winner.save();
                victorine.save(callback);
            } else {
                callback('Нет пользователей для проведения этого типа розыгрыша (' + type + ').');
            }
            setTimeout(function() {
                mutex.unlock();
            }, 20000);
        });
    } else {
        callback('Нужно подождать завершения предыдущего розыгрыша.');
    }
};

var registrationToAdmin = function(msg) {

};

var checkCode = function(code) {
    var validCodes = ['bad', '34786', '94586', '78290', '85932', '38157', '96853', '19234', '20317', '75319', '58194', '79642', '81549', '32815', '64593', '42370', '85732', '35826', '41927', '72958', '65318', '34950', '38974', '45378', '16427', '85314', '79643', '78462', '83416', '58396', '28435', '21965', '18253', '98745', '13967', '95638', '56390', '12347', '98150', '74386', '47352', '64529', '47582', '42975', '62549', '59487', '24357', '17536', '78546', '82534', '48759', '31927', '60134', '89430', '42039', '69143', '56321', '89476', '12438', '34791', '29374', '87619', '40365', '96832', '39701', '68975', '46207', '82376', '97245', '82634', '46213', '85196', '13479', '72986', '26743', '64879', '24187', '92587', '34571', '57829', '58610', '57320', '21738', '27865', '67450', '73296', '83201', '46329', '16975', '16483', '87514', '65834', '48352', '86173', '32967', '12750', '14369', '76059', '73856', '83542', '81395', '65392', '73286', '21467', '13572', '21793', '15762', '27916', '53684', '35784', '82743', '91835', '48765', '54796', '28567', '84569', '76345', '28967', '41530', '82679', '45721', '24389', '94180', '97485', '75342', '69134', '57961', '42895', '35714', '94178', '86574', '71046', '86459', '73921', '19578', '81539', '71859', '13529', '97852', '63748', '58372', '24539', '45987', '37856', '56789'];
    return validCodes.indexOf(code);
};

var registrationToRaffle = function(data, callback) {
    var msg = JSON.parse(data),
        code = msg.code,
        pos = checkCode(code);
    if (pos > 0) {
        var img_name = pos + '.png';
        var img_content = msg.img_content;

        db.User.findOne({code: code}, function(err, user) {
            if (err) {
                callback({code: code, message: err});
            } else {
                if (user) {
                    callback({code: code, message: 'Извините, данный код уже был использован.'});
                } else {
                    filesystem.saveFromBase64(img_content, img_name, function(img_url) {
                        msg.img_url = img_url;
                        msg.is_winner = false;
                        user = new db.User(msg);
                        user.save(callback);
                    });
                }
            }
        });
    } else {
        callback({code: code, message: 'Данный код недействительный. Укажите верный код.'});
    }
};

var checkQRCode = function(code, callback) {
    db.User.findOne({code: code}, function(err, user) {
        if (user) {
            user.in_corp = true;
            user.save(callback);
        } else {
            callback(err || {});
        }
    });
};

var guestsListsToRaffle = function(callback) {
    db.User.find({}, callback);
};

module.exports = {
    raffleToAdmin: raffleToAdmin,
    raffleToRegister: raffleToRegister,
    adminToRegistration: adminToRegistration,
    adminToRaffle: adminToRaffle,
    registrationToAdmin: registrationToAdmin,
    registrationToRaffle: registrationToRaffle,
    guestsListsToRaffle: guestsListsToRaffle,
    checkQRCode: checkQRCode
};