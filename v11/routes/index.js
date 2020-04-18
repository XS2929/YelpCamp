var express = require("express");
var passport = require("passport");
var router = express.Router();
var user = require("../models/user");


router.get("/", function(req, res){
	res.render("landing");
});

// auth routes
router.get("/register", function(req, res){
	res.render("register");
});

router.post("/register", function(req, res){
	var newUser = new user({username: req.body.username});
	user.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash("error", err.message);
			return res.render("register");
		} 
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to YelpCamp " + user.username);
			res.redirect("/campgrounds");						   
		});
	});
});

router.get("/login", function(req, res){
	res.render("login");
});

// app.post("login", middleware, callback)
router.post("/login", passport.authenticate("local",
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login",
		failureFlash: true,
        successFlash: 'Welcome!'
	}), function(err, req, res){
});

router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect("/campgrounds");
});

router.get("*", function(req, res){
	res.render("landing");
});

module.exports = router;
