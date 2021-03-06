var fs = require('fs');

module.exports.saveFromBase64 = function(content, img_name, callback) {
    var base64Data = content.replace(/^data:image\/png;base64,/, "").replace(/^data:image\/jpeg;base64,/, ""),
        img_url = 'public/avatars/' + img_name;
    fs.writeFile(img_url, base64Data, 'base64', function(err) {
        if (err) {
            console.log(err);
        } else {
            callback('avatars/' + img_name);
        }
    });
};