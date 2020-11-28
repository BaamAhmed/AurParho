let mongoose = require("mongoose");

let campgroundSchema = new mongoose.Schema({
	name: String,
	price: String,
	image: String,
	description: String,
	comments:
	[
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	],
	poster: {
		_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String,
	}
})


let noteSchema = new mongoose.Schema({
	title: String,
	subject: String,
	grade: String,
	image: String
})

// let Note = mongoose.model("Note", noteSchema)
let Campground = mongoose.model("Campground", campgroundSchema)

module.exports = Campground;
