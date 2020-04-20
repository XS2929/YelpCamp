// Schema setup
var mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	price: String,
	description: String,
	createdAt: {type: Date, default: Date.now},
	address: String,
	kidsFriendly: String, 
	contact: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});

var comment = require('./comment');

module.exports = mongoose.model("Campground", campgroundSchema);
