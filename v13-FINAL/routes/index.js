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
	if(req.body.adminCode === "Admin"){
		newUser.isAdmin = true;
	}
	user.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash("error", err.message);
			return res.render("register");
		} 
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to YelpCamp, " + user.username);
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
        successFlash: 'Welcome to YelpCamp!'
	}), function(err, req, res){
});

router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logout Success");
	res.redirect("/campgrounds");
});

router.get("/about", function(req, res){
	res.render("about");
})

router.get("*", function(req, res){
	res.render("landing");
});

module.exports = router;
