var express = require("express");
var router = express.Router();
var campGround = require("../models/campground");
var comment = require("../models/comment");
var middleware = require("../middleware");
//INDEX - show all campgrounds
router.get("/", function(req, res){
	campGround.find({}, function(err, allCampGrounds){
		if(err){
			console.log(error);
		} else {
			res.render("campgrounds/index", {campgrounds:allCampGrounds});
		}
	});
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
	var newCampGround = { 
		name: req.body.name, 
		image : req.body.image,
		price: req.body.price,
		description: req.body.description,
		author: {id : req.user._id,
				username: req.user.username
		}
	};
	campGround.create(newCampGround, function(err, campground){
			if(err){
				console.log(err);
			} else {
				//res.redirect("campgrounds/index");
				
				res.redirect("/campgrounds");
			}
		});
		
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");	
});

router.get("/:id", function(req, res){
	campGround.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err || !foundCampground){
			console.log(err);
			req.flash("error", "Campground not found");
			res.redirect("back");
		} else{
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	campGround.findById(req.params.id, function(err, foundCampground){
		if(err){
			req.flash("error", "Campground can not be found");
			res.redirect("back");
		} else {
			res.render("campgrounds/edit", {campground: foundCampground});
		}		
	});
});

router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	campGround.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/"+ req.params.id);
		}
	});
});

//destroy campground route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	campGround.findById(req.params.id, function(err, foundCamp){
		if(err){
			res.redirect("/campgrounds");
		}
		comment.deleteMany({_id: {$in: foundCamp.comments}}, function(err){
			if(err){
				console.log(err);
			} else {
				foundCamp.deleteOne();
				req.flash("success", "Campground deleted");
			}
			res.redirect("/campgrounds");
		});
	});
});

module.exports = router;
