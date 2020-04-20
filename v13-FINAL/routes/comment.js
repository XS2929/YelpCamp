var express = require("express");
var router = express.Router({mergeParams: true});
var campGround = require("../models/campground");
var comment = require("../models/comment");
var middleware = require("../middleware");

// comments routes
router.get("/new", middleware.isLoggedIn, function(req, res){
	
	campGround.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground});
		}
	});
	
});

router.post("/", middleware.isLoggedIn, function(req,res){
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
					addedComment.author.id = req.user._id;
					addedComment.author.username = req.user.username;
					addedComment.save();
					
					campground.comments.push(addedComment);
					campground.save();
					req.flash("success", "New comment added!");
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
	
});

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	campGround.findById(req.params.id, function(err, foundCampground){
		if(err || !foundCampground){
			req.flash("error", "No Campground found");
			return res.redirect("back");
		} else {
			comment.findById(req.params.comment_id, function(err, foundComment){
				if(err || !foundComment){
					req.flash("error", "Comment not found");
					res.redirect("back");
				} else {
					res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
				}
			});
		}
	});	
});

router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
});

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		} else {
			campGround.findByIdAndUpdate(req.params.id, {
				$pull: {comments: req.params.comment_id}
			}, function(err){
				if(err){
					console.log(err);
				} else {
					req.flash("success", "Comment deleted");
					res.redirect("/campgrounds/" + req.params.id);
				}
			});			
			
		}
	});
});

module.exports = router;


