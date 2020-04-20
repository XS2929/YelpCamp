var campGround = require("../models/campground");
var comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		campGround.findById(req.params.id, function(err, foundCampground){
			if(err || !foundCampground){
				req.flash("error", "Permission denied");
				res.redirect("back");
			} else {
				if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin){
					next();
				} else {
					req.flash("error", "Permission denied");
					res.redirect("back!");
				}
			}
		});
	} else {
		req.flash("error", "Please Login");
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		comment.findById(req.params.comment_id, function(err, foundComment){
			if(err || !foundComment){
				req.flash("err", "Permission denied");
				res.redirect("back");
			} else {
				if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
					next();
				} else {
					res.redirect("back!");
				}
			}
		});
	} else {
		req.flash("error", "Permission denied");
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "Please Login");
	res.redirect("/login");
}


module.exports = middlewareObj;