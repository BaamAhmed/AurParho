let mongoose = require("mongoose");

let noteSchema = new mongoose.Schema({
	title: String,
	subject: String,
    grade: String,
    noteLink: String,
    image: String,
    contributor: String,
    videoLink: String,
    poster: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
    },
    fileName: String
})

let Note = mongoose.model("Note", noteSchema)

module.exports = Note;