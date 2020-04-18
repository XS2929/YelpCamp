var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	campGround =  require("./models/campground"),
	comment = require("./models/comment"),
	seedDB = require("./seeds");



app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser: true, useUnifiedTopology: true});

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
	})
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
app.get("/campgrounds/:id/comment/new", function(req, res){
	
	campGround.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground});
		}
	});
	
});

app.post("/campgrounds/:id/comments", function(req,res){
	//lookup campground using ID
	campGround.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			//create new comment
			//connect new comment to camground
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



app.listen(3000, function(){
	console.log("YelpCamp Server running on port 3000");
});