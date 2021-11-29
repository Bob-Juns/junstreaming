const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	userName: { type: String, required: true },
	userId: { type: String, required: true, unique: true, trim: true },
	userEmail: { type: String, required: true, unique: true, trim: true },
	password: { type: String, required: true },
	isAdmin: { type: Boolean, default: false },
});

module.exports = mongoose.model('user', userSchema);
