var express = require("express");
var router = express.Router();
var campGround = require("../models/campground");

//INDEX - show all campgrounds
router.get("/", function(req, res){
	campGround.find({}, function(err, allCampGrounds){
		if(err){
			consol.log(error);
		} else {
			res.render("campgrounds/index", {campgrounds:allCampGrounds});
		}
	});
});

//CREATE - add new campground to DB
router.post("/", isLoggedIn, function(req, res){
	var newCampGround = { 
		name: req.body.name, 
		image : req.body.image,
		description: req.body.description
	};
	campGround.create( newCampGround, function(err, campground){
			if(err){
				console.log(err);
			} else {
				//res.redirect("campgrounds/index");
				res.render("campgrounds/show", {campground: campground});
			}
		});
		
});

//NEW - show form to create new campground
router.get("/new", isLoggedIn, function(req, res){
	res.render("campgrounds/new");	
});

router.get("/:id", function(req, res){
	campGround.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		} else{
			res.render("campgrounds/show", {campground: foundCampground});
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
