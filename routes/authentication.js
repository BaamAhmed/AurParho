let express = require("express"),
	router 	= express.Router(),
	passport= require("passport"),
	User	= require("../models/user"),
	Note	= require("../models/note")
	middleware = require("../middleware/index");


router.get("/", function(req,res){
	res.redirect("notes")
	
})

// router.get("/register", function(req, res){
// 	res.render("register")
// })

// router.post("/register", function(req, res){
// 	let newUser = new User({username: req.body.username})
// 	User.register(newUser, req.body.password, function(err, newUser){
// 		if(err){
// 			req.flash("error", err.message)
// 			console.log("The following error was encountered: " + err)
// 			// return res.render("register")
// 			res.redirect("/register")
// 		} else {
// 			passport.authenticate("local")(req, res, function(){
// 				req.flash("success", "Account created successfully. Welcome to YelpCamp, " + newUser.username)
// 				res.redirect("/notes")
// 			})
// 		}
// 	})
// })


router.get("/superSpecialLogin", function(req, res){
	res.render("login")
})

router.get("/about", function(req, res){
	res.render("about")
})

router.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/notes",
		failureRedirect: "/login"
	}),
function(req, res){
	console.log("do smth")
})

router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "User logged out successfully")
	res.redirect("/notes")
})

module.exports = router;
