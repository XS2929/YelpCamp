var express = require("express"),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	campGround =  require("./models/campground"),
	methodOverride = require("method-override"),
	comment = require("./models/comment"),
	user = require("./models/user"),
	seedDB = require("./seeds"),
	app = express();

var commentRoutes 	 = require("./routes/comment"),
	campgroundRoutes = require("./routes/campground"),
	authRoutes 		 = require("./routes/index");

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

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

app.use("/campgrounds/:id/comments", commentRoutes);
app.use(authRoutes);
app.use("/campgrounds", campgroundRoutes);

app.listen(3000, function(){
	console.log("YelpCamp Server running on port 3000");
});