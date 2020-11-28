let express = require("express"),
	router 	= express.Router({mergeParams: true}),
	Campground = require("../models/campground"),
	Comment = require("../models/comment"),
	middleware = require("../middleware/index")


router.get("/new", middleware.isLoggedIn , function(req, res){
	//find campground by ID
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log("The following error was encountered bla: " + err)
		} else {
			res.render("comments/new", {campground: foundCampground})
		}
	})
})

router.post("/", middleware.isLoggedIn, function(req, res){
	//lookup the campground using the req param id
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log("The following error was encountered: " + err)
		} else {
			Comment.create(req.body.comment, function(err, createdComment){
				if(err){
					console.log("The following error was encountered: " + err)
				} else {
					//add username and id to comment and then save comment
					createdComment.author.id = req.user._id;
					createdComment.author.username = req.user.username;
					
					createdComment.save(function(err){
						if(err){
							console.log("The following error was encountered: " + err)
						} else {
							foundCampground.comments.push(createdComment)
							foundCampground.save(function(err){
								if(err){
									console.log("The following error was encountered: " + err)
								} else {
									req.flash("success", "New comment added successfully!")
									console.log("new comment created successfully")
									res.redirect("/campgrounds/" + foundCampground._id)
								}
							})
							
						}
						
					})
					
				}
			})
		}
	})
	//create new commment
	//connect new comment to campground
	//redirect to campground show page
})

router.get("/:comment_id/edit", middleware.checkCommentOwnership ,function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log("The following error was encountered: " + err)
		} else {
			Comment.findById(req.params.comment_id, function(err, foundComment){
				if(err) {
					console.log("The following error was encountered: " + err)
				} else {
					res.render("comments/edit", {foundComment: foundComment, campground_id: req.params.id, foundCampground: foundCampground})
				}
			})
			
		}
	})
})

router.post("/:comment_id", middleware.checkCommentOwnership , function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			console.log("The following error was encountered: "+ err)
		} else {
			req.flash("success", "Comment updated successfully!")
			res.redirect("/campgrounds/" + req.params.id)
		}
	})
})

router.delete("/:comment_id", middleware.checkCommentOwnership , function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			console.log("The following error was encountered: " + err)
		} else {
			req.flash("success", "Comment deleted successfully!")
			res.redirect("/campgrounds/" + req.params.id)
		}
	})
})

module.exports = router;








