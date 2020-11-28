//GENERAL IMPORTS
let express = require("express"),
	router 	= express.Router(),
	Campground = require("../models/campground"),
	middleware = require("../middleware/index")



//ALL CAMPGROUNDS
router.get("/", function(req, res){
	req.user
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log("error encountered")
		} else {
			res.render("campgrounds/index", {campgrounds: allCampgrounds})
		}
	})
})

//NEW CAMPGROUND FORM
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new")
})

//NEW CAMPGROUND FORM POST REQUEST
router.post("/", middleware.isLoggedIn, function(req, res){
	let name = req.body.name;
	let imageURL = req.body.image;
	let campDesc = req.body.campDesc;
	let price = req.body.price;
	let poster = req.user;
	let newCampground = {name: name, image: imageURL, description: campDesc, poster: poster, price: price};
	// campgrounds.push(newCampground)
	//instead create new campground and save to database
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log("error encountered");
			console.log(err)
		} else {
			req.flash("success", "New campground added successfully!")
			console.log("everything running smoothly")
			res.redirect("/campgrounds")
		}
	})
})


//ONE PARTICULAR CAMPGROUND
router.get("/:id", function(req, res){
	//find the campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log("error encountered")
		} else {
			// console.log(foundCampground)
			res.render("campgrounds/show", {campground: foundCampground})
		} 
	})
	
	//render the show page for that specific item with that specific ID
})

//edit campground route

router.get("/:id/edit", middleware.checkCampgroundOwnership,function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log("The following error was encountered: "+ err)
		} else {
			res.render("campgrounds/edit", {campground: foundCampground})
		}
	})
})

//update campground route
router.post("/:id/edit", middleware.checkCampgroundOwnership , function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			console.log("The following error was encountered: " + err)
		} else {
			res.redirect("/campgrounds/" + req.params.id)
		}
	})
})

router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log("The following error was encountered: " + err)
		} else {
			req.flash("success", "Campground deleted successfully!")
			res.redirect("/campgrounds")
		}
	})
})
//EXPORT
module.exports = router;