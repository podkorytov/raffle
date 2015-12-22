var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/raffle');

var userSchema = new mongoose.Schema({
	name: String,
	img_url: String,
	in_corp: Boolean,
	code: Number
});

userSchema.statics.getRandom = function getRandom (callback) {
	var random = Math.random();
	this.count({}, function(err, cnt) {
		if (err) {
			callback(err);
		} else {
	        this.find({}).limit(1).skip(Math.round(random * (cnt - 1))).exec(callback);
		}
    });
};

var victorineSchema = new mongoose.Schema({
	winner: userSchema,
	prize: String,
	type: Number
});

module.exports.User = mongoose.model('User', userSchema);
module.exports.Victorine = mongoose.model('Victorine', victorineSchema); 
