var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/raffle');

var userSchema = {
	name: String,
	img_url: String,
	in_corp: Boolean,
	code: Number
};

var victorineSchema = {
	winner: Number,
	prize: String
};

module.exports.User = mongoose.model('User', userSchema);
module.exports.Victorine = mongoose.model('Victorine', victorineSchema); 
