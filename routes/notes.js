//GENERAL IMPORTS
let express = require("express"),
	router 	= express.Router(),
	Note = require("../models/note"),
	middleware = require("../middleware/index")



//ALL NOTES
router.get("/", function(req, res){
	req.user
	Note.find({}, function(err, allNotes){
		if(err){
			console.log("error encountered")
		} else {
			res.render("notes/index", {notes: allNotes})
		}
	})
})

function stringEscape(s) {
		return s ? s.replace(/\\/g,'').replace(/\{\}/g,'').replace(/\[\]/g,'').replace(/\+/g,'').replace(/\n/g,'').replace(/\t/g,'').replace(/\v/g,'').replace(/'/g,"").replace(/"/g,'').replace(/[\x00-\x1F\x80-\x9F]/g,hex) : s;
		function hex(c) { var v = '0'+c.charCodeAt(0).toString(16); return '\\x'+v.substr(v.length-2); }
}

router.get("/contactus", function(req, res) {
	res.render("notes/contactform")
})
router.get("/requestnote", function(req, res) {
	res.render("notes/requestnote")
})

router.get("/browse", function(req, res){
	let search = req.query.searchTerm;
	let sanitisedSearch = stringEscape(search);
	console.log(sanitisedSearch)
	console.log(req.query.subject)
	if(req.query.subject === "All" || req.query.subject == undefined){
		req.query.subject = '';
	}
	if(sanitisedSearch == undefined){
		sanitisedSearch = '';
	}
	if(req.query.grade == undefined){
		req.query.grade = '';
	}
	// let regex = new RegExp(escapeRegex(req.query.searchTerm), "i")
	Note.find({'title': {$regex: sanitisedSearch, $options: 'i'}, 'subject':{$regex: req.query.subject, $options: 'i'}, 'grade':{$regex: req.query.grade, $options: 'i'}}, function(err, allNotes){
		if(err){
			console.log("error encountered")
			console.log(err)
		} else {
			res.render("notes/browse", {notes: allNotes})
		}
	})
})


//NEW CAMPGROUND FORM
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("notes/new")
})

//NEW CAMPGROUND FORM POST REQUEST
router.post("/", middleware.isLoggedIn, function(req, res){
    let newNote = req.body.note;
	// let name = req.body.name;
	// let imageURL = req.body.image;
	// let campDesc = req.body.campDesc;
	// let price = req.body.price;
	// let poster = req.user;
	// let newCampground = {name: name, image: imageURL, description: campDesc, poster: poster, price: price};
	// campgrounds.push(newCampground)
	//instead create new campground and save to database
	Note.create(newNote, function(err, newlyCreated){
		if(err){
			console.log("error encountered");
			console.log(err)
		} else {
			req.flash("success", "New note added successfully!")
			console.log("everything running smoothly")
			res.redirect("/notes")
		}
	})
})


//ONE PARTICULAR CAMPGROUND
router.get("/:id", function(req, res){
	//find the campground with provided ID
	Note.findById(req.params.id).populate("comments").exec(function(err, foundNote){
		if(err){
			console.log("error encountered")
		} else {
			// console.log(foundCampground)
			res.render("notes/showReal", {note: foundNote})
		} 
	})
	
	//render the show page for that specific item with that specific ID
})

//edit campground route

router.get("/:id/edit", middleware.isLoggedIn, function(req, res){
	Note.findById(req.params.id, function(err, foundNote){
		if(err){
			console.log("The following error was encountered: "+ err)
		} else {
			res.render("notes/edit", {note: foundNote})
		}
	})
})

//update campground route
router.post("/:id/edit", middleware.isLoggedIn , function(req, res){
	Note.findByIdAndUpdate(req.params.id, req.body.note, function(err, updatedNote){
		if(err){
			console.log("The following error was encountered: " + err)
		} else {
			res.redirect("/notes/" + req.params.id)
		}
	})
})

router.delete("/:id", middleware.isLoggedIn, function(req, res){
	Note.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log("The following error was encountered: " + err)
		} else {
			req.flash("success", "Note deleted successfully!")
			res.redirect("/notes")
		}
	})
})
//EXPORT
module.exports = router;