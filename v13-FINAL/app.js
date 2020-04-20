var express = require("express"),
	session = require("express-session"),
	MemoryStore = require('memorystore')(session),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	passport = require("passport"), 
	LocalStrategy = require("passport-local"),
	campGround =  require("./models/campground"),
	methodOverride = require("method-override"),
	comment = require("./models/comment"),
	user = require("./models/user"),
	seedDB = require("./seeds"),
	flash = require("connect-flash");
	app = express();

var commentRoutes 	 = require("./routes/comment"),
	campgroundRoutes = require("./routes/campground"),
	authRoutes 		 = require("./routes/index");

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());
app.locals.moment = require('moment');
mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true}).then(() => {
	console.log("Database Connected!"); 
}).catch(err =>{
	console.log("ERROR:", err.message);
});

// passport configuration
app.use(session({
	secret: "secret word", 
	cookie: { maxAge: 86400000 },
	resave: false,
	store: new MemoryStore({
		checkPeriod: 86400000	
	}),
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use(authRoutes);
seedDB();

var port = 3000;
app.listen(port, function(){
	console.log("YelpCamp Server running on port 3000");
});