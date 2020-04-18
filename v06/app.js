var express = require("express"),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	campGround =  require("./models/campground"),
	comment = require("./models/comment"),
	user = require("./models/user"),
	seedDB = require("./seeds"),
	app = express();



app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser: true, useUnifiedTopology: true});

// passport configuration
app.use(require("express-session")({
	secret: "cant stand the CCP", 
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

seedDB();


app.get("/", function(req, res){
	res.render("landing");
});

//INDEX - show all campgrounds
app.get("/campgrounds", function(req, res){
	campGround.find({}, function(err, allCampGrounds){
		if(err){
			consol.log(error);
		} else {
			res.render("campgrounds/index", {campgrounds:allCampGrounds});
		}
	});
});

//CREATE - add new campground to DB
app.post("/campgrounds", function(req, res){
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
app.get("/campgrounds/new", function(req, res){
	res.render("campgrounds/new");	
});

app.get("/campgrounds/:id", function(req, res){
	campGround.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		} else{
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

// comments routes
app.get("/campgrounds/:id/comment/new", isLoggedIn, function(req, res){
	
	campGround.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground});
		}
	});
	
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req,res){
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

// auth routes
app.get("/register", function(req, res){
	res.render("register");
});

app.post("/register", function(req, res){
	var newUser = new user({username: req.body.username});
	user.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("register");
		} 
		passport.authenticate("local")(req, res, function(){
			res.redirect("/campgrounds");						   
		});
	});
});

app.get("/login", function(req, res){
	res.render("login");
});

// app.post("login", middleware, callback)
app.post("/login", passport.authenticate("local",
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}), function(req, res){
});

app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/campgrounds");
});

//middleware
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

app.listen(3000, function(){
	console.log("YelpCamp Server running on port 3000");
});