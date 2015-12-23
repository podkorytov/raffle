var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/raffle2');

var userSchema = new mongoose.Schema({
    name: String,
    img_url: String,
    in_corp: Boolean,
    code: Number
});

userSchema.statics.getRandom = function getRandom (criteria, callback) {
	var random = Math.random();
	this.count(criteria, function(err, cnt) {
		if (err) {
			callback(err);
		} else {
	        this.find(criteria).limit(1).skip(Math.round(random * (cnt - 1))).exec(callback);
		}
    });
};

var victorineSchema = new mongoose.Schema({
    winner: userSchema,
    type: String
});

module.exports = {
    User: mongoose.model('User', userSchema),
    Victorine: mongoose.model('Victorine', victorineSchema)
};
