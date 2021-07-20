//GENERAL IMPORTS
let express = require("express"),
	router 	= express.Router(),
	Note = require("../models/note"),
	middleware = require("../middleware/index")
	fs = require('fs')
	path = require('path')
	formidable = require('formidable')



const dirPath = path.join(__dirname, '../', "public/documents");


const files = fs.readdirSync(dirPath).map(name => {
	return {
	name: path.basename(name, ".pdf"),
	url: `/documents/${name}`
	};
});

//ALL NOTES
router.get("/", function(req, res){
	req.user
	Note.find({}, function(err, allNotes){
		if(err){
			console.log("error encountered")
		} else {
			res.render("notes/index", {notes: allNotes, nonNotePage: true})
		}
	})
})

function stringEscape(s) {
		return s ? s.replace(/\\/g,'').replace(/\{\}/g,'').replace(/\[\]/g,'').replace(/\+/g,'').replace(/\n/g,'').replace(/\t/g,'').replace(/\v/g,'').replace(/'/g,"").replace(/"/g,'').replace(/[\x00-\x1F\x80-\x9F]/g,hex) : s;
		function hex(c) { var v = '0'+c.charCodeAt(0).toString(16); return '\\x'+v.substr(v.length-2); }
}

router.get("/contactus", function(req, res) {
	res.render("notes/contactform", {nonNotePage: true})
})
router.get("/requestnote", function(req, res) {
	res.render("notes/requestnote", {nonNotePage: true})
})

router.get("/browse", function(req, res){
	let search = req.query.searchTerm;
	let sanitisedSearch = stringEscape(search);
	// console.log(sanitisedSearch)
	// console.log(req.query.subject)
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
			res.render("notes/browse", {notes: allNotes, resultsFor: sanitisedSearch, nonNotePage: true})
		}
	})
})


//NEW CAMPGROUND FORM
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("notes/new", {nonNotePage: true})
})

router.post('/upload', (req, res, next)=> {
	const form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
  
        var oldPath = files.fileName.path;
        var newPath = path.join(__dirname, '../public/documents')
                + '/'+files.fileName.name
        var rawData = fs.readFileSync(oldPath)
      
        fs.writeFile(newPath, rawData, function(err){
            if(err) console.log(err)
            return res.send("Successfully uploaded")
        })
  })
})

//NEW CAMPGROUND FORM POST REQUEST
router.post("/", middleware.isLoggedIn, function(req, res){
    // let newNote = req.body.note;
	// newNote.fileName = req.body.fileName
	// console.log(newNote.fileName)
	// let name = req.body.name;
	// let imageURL = req.body.image;
	// let campDesc = req.body.campDesc;
	// let price = req.body.price;
	// let poster = req.user;
	// let newCampground = {name: name, image: imageURL, description: campDesc, poster: poster, price: price};
	// campgrounds.push(newCampground)
	//instead create new campground and save to database
	const form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files){

		console.log(fields)
		fields.fileName = files.actualFile.name
		var oldPath = files.actualFile.path;
		var newPath = path.join(__dirname, '../public/documents')
				+ '/'+files.actualFile.name
		var rawData = fs.readFileSync(oldPath)
	
		fs.writeFile(newPath, rawData, function(err){
			if(err) console.log(err)
			Note.create(fields, function(err, newlyCreated){
				if(err){
					console.log("error encountered");
					console.log(err)
				} else {
					console.log("everything running smoothly")
					return res.redirect("/notes")
					// req.flash("success", "New note added successfully!")
				}
			})
			
			// return res.send("Successfully uploaded")
		})
	})
	// Note.create(newNote, function(err, newlyCreated){
	// 	if(err){
	// 		console.log("error encountered");
	// 		console.log(err)
	// 	} else {
			
	// 		// req.flash("success", "New note added successfully!")
			
	// 	}
	// })
})



//ONE PARTICULAR NOTE
router.get("/:id", function(req, res){
	//find the note with provided ID
	Note.findById(req.params.id).populate("comments").exec(function(err, foundNote){
		if(err){
			console.log("error encountered")
		} else {
			// console.log(foundCampground)
			let splitting = foundNote.title.split(":")
			let specialTitle = foundNote.title.split(":");
			let topic;
			if(splitting.length > 1) {
				topic = splitting[1].trim()
				specialTitle[1] = specialTitle[1].trim()
			} else {
				topic = "";
			}
			Note.find({'title': {$regex: topic, $options: 'i'},'subject': foundNote.subject}, function(err, relatedNotes)
			{
				if(err)
				{
					console.log("BRo error: ", err)
					res.redirect("/");
				} else {
					let n;
					if(relatedNotes.length > 4)
					{
						n = 4
					} else {
						n = relatedNotes.length
					}
					if (foundNote.fileName.indexOf(' + ') !== -1){
						foundNote.fileName = foundNote.fileName.replace(' + ', '+%2B+')
					}
					res.render("notes/showReal", {note: foundNote, relatedNotes: relatedNotes, n:n, specialTitle: specialTitle, nonNotePage: false})
				}
			})
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
			if (foundNote.videoLink != undefined && foundNote.videoLink != "")
			{
				let videoLinkBool = true
				res.render("notes/edit", {note: foundNote, videoLinkBool: videoLinkBool, nonNotePage: true})
			} else {
				let videoLinkBool = false
				res.render("notes/edit", {note: foundNote, videoLinkBool: videoLinkBool, nonNotePage: true})
			}
		}
	})
})

//update campground route
router.post("/:id/edit", middleware.isLoggedIn , function(req, res){
	const form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files){

		console.log(fields)
		fields.fileName = files.actualFile.name
		var oldPath = files.actualFile.path;
		var newPath = path.join(__dirname, '../public/documents')
				+ '/'+files.actualFile.name
		var rawData = fs.readFileSync(oldPath)
	
		fs.writeFile(newPath, rawData, function(err){
			if(err) console.log(err)
			Note.findByIdAndUpdate(req.params.id, fields, function(err, updatedNote){
				if(err){
					console.log('The following error was encountered: ', err)
				} else {
					res.redirect('/notes/'+ req.params.id)
				}
			})
			// return res.send("Successfully uploaded")
		})
	})

	// Note.findByIdAndUpdate(req.params.id, req.body.note, function(err, updatedNote){
	// 	if(err){
	// 		console.log("The following error was encountered: " + err)
	// 	} else {
	// 		res.redirect("/notes/" + req.params.id)
	// 	}
	// })
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