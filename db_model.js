var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/raffle');

var userSchema = new mongoose.Schema({
    name: String,
    img_url: String,
    in_corp: Boolean,
    is_winner: Boolean,
    code: Number
});

userSchema.statics.getRandom = function(criteria, callback) {
    this.count(criteria, function(err, count) {
        if (err) {
            callback(err);
        } else {
            var rand = Math.floor(Math.random() * count);
            this.findOne(criteria).skip(rand).exec(callback);
        }
    }.bind(this));
};

var victorineSchema = new mongoose.Schema({
    winner: userSchema,
    type: String
});

module.exports = {
    User: mongoose.model('User', userSchema),
    Victorine: mongoose.model('Victorine', victorineSchema)
};
