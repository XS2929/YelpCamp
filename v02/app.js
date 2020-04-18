var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser: true, useUnifiedTopology: true});

// Schema setup
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
});

var campGround = mongoose.model("Campground", campgroundSchema);


app.get("/", function(req, res){
	res.render("landing.ejs");
});

//INDEX - show all campgrounds
app.get("/campgrounds", function(req, res){
	campGround.find({}, function(err, allCampGrounds){
		if(err){
			consol.log(error);
		} else {
			res.render("index", {campgrounds:allCampGrounds});
		}
	})
});

//CREATE - add new camground to DB
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
				res.redirect("index");
			}
		});
		
});

//NEW - show form to create new camground
app.get("/campgrounds/new", function(req, res){
	res.render("new");	
});

app.get("/campgrounds/:id", function(req, res){
	campGround.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log(err);
		} else{
			res.render("show", {campground: foundCampground});
		}
	})
});




app.listen(3000, function(){
	console.log("YelpCamp Server running on port 3000");
});