let Note 	= require("../models/note"),
	Comment 	= require("../models/comment")

//storing all middleware here
let middlewareObj= {};

middlewareObj.checkNoteOwnership = 
	function (req, res, next){
	if(req.isAuthenticated()){
		Note.findById(req.params.id, function(err, foundNote){
			if(err){
				req.flash("error", err)
				console.log("The following error was encountered: "+ err)
				return res.redirect("/")
			} else {
				if(foundNote.poster._id.equals(req.user._id)){
					next();
				} else {
					req.flash("error", "You don't have permission to do that")
					return res.redirect("/")
				}
			}
		})
	} else {
		req.flash("error", "You need to be logged in to do that")
		res.redirect("back")
	}
};

middlewareObj.isLoggedIn =
	function (req, res, next){
	if(req.isAuthenticated()){
		return next()
	}
	req.flash("error", "You need to be logged in to do that")
	res.redirect("/login")
};

middlewareObj.checkCommentOwnership =
	function(req, res, next){
		if(req.isAuthenticated()){
			Comment.findById(req.params.comment_id, function(err, foundComment){
				if(err){
					console.log("The following error was encountered: "+ err)
					return res.redirect("/")
				} else {
					if(foundComment.author.id.equals(req.user._id)){
						next();
					} else {
						req.flash("error", "You are not logged in as the owner of this comment.")
						return res.redirect("/")
					}
				}
			})
		} else {
			req.flash("error", "Please log in first.")
			res.redirect("back")
		}
	};

module.exports = middlewareObj;
