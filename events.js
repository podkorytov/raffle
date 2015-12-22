var db = require('./db_model.js'),
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
    var type = msg.type;

    var criteria = {};
    switch (type) {
        case 'main': criteria.in_corp = true;break;
        default: break;
    }

    db.User.getRandom(criteria, function(err, docs) {
        if (docs.length > 0) {
            var victorine = new db.Victorine({winner: docs[0], type: type, prize: 'Iphone'});
            victorine.save(callback);
        } else {
            callback('Нет пользователей для проведения этого типа розыгрыша (' + type + ').');
        }
    });
};

var registrationToAdmin = function(msg) {

};

var checkCode = function(code) {
    var validCodes = ['bad', '34786', '94586', '78290', '85932', '38157', '96853', '19234', '20317', '75319', '58194', '79642', '81549', '32815', '64593', '42370', '85732', '35826', '41927', '72958', '65318', '34950', '38974', '45378', '16427', '85314', '79643', '78462', '83416', '58396', '28435', '21965', '18253', '98745', '13967', '95638', '56390', '12347', '98150', '74386', '47352', '64529', '47582', '42975', '62549', '59487', '24357', '17536', '78546', '82534', '48759', '31927', '60134', '89430', '42039', '69143', '56321', '89476', '12438', '34791', '29374', '87619', '40365', '96832', '39701', '68975', '46207', '82376', '97245', '82634', '46213', '85196', '13479', '72986', '26743', '64879', '24187', '92587', '34571', '57829', '58610', '57320', '21738', '27865', '67450', '73296', '83201', '46329', '16975', '16483', '87514', '65834', '48352', '86173', '32967', '12750', '14369', '76059', '73856', '83542', '81395', '65392', '73286', '21467', '13572', '21793', '15762', '27916', '53684', '35784', '82743', '91835', '48765', '54796', '28567', '84569', '76345', '28967', '41530', '82679', '45721', '24389', '94180', '97485', '75342', '69134', '57961', '42895', '35714', '94178', '86574', '71046', '86459', '73921', '19578', '81539', '71859', '13529', '97852', '63748', '58372', '24539', '45987', '37856', '56789'];
    return validCodes.indexOf(code);
};

var registrationToRaffle = function(data, callback) {
    var msg = JSON.parse(data),
        pos = checkCode(msg.code);
    if (pos > 0) {
        var img_name = pos + '.png';
        var img_content = msg.img_content;

        filesystem.saveFromBase64(img_content, img_name, function(img_url) {
            msg.img_url = img_url;
            var user = new db.User(msg);
            user.save(callback);
        });
    } else {
        callback('Сорян, но чото такого кода нет :(');
    }
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
    guestsListsToRaffle: guestsListsToRaffle
};