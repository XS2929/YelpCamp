var express = require("express");
var router = express.Router({mergeParams: true});
var campGround = require("../models/campground"),
	comment = require("../models/comment");

// comments routes
router.get("/new", isLoggedIn, function(req, res){
	
	campGround.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground});
		}
	});
	
});

router.post("/", isLoggedIn, function(req,res){
	//lookup campground using ID
	campGround.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			//create new comment
			//connect new comment to campground
			comment.create(req.body.comment, function(err, addedComment){
				if(err){
					console.log(err);
				} else {
					campground.comments.push(addedComment);
					campground.save();
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
	
});

//middleware
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;

