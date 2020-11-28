let mongoose = require("mongoose");

let noteSchema = new mongoose.Schema({
	title: String,
	subject: String,
    grade: String,
    noteLink: String,
    image: String,
    poster: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
    }
})

let Note = mongoose.model("Note", noteSchema)

module.exports = Note;