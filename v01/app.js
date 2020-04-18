var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

var campgrounds = [ 
		{name:"camp1", image:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcR1O71J_F3oAiyFW445F0OvgxFd_Y_mAh47e_x3-f2kFScs4UGC"},
		{name:"camp2", image:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTg7NyLGG17b4FB3cs_vIHXnKIATPCuA9_54HvkhwMg_BK8wua-"},
		{name:"camp3", image:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRJFVN7fA31F-LcmMltiR_NLPRRHgBAvO7zuwCtlT_O1QI_Fya2"},
		{name:"camp1", image:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcR1O71J_F3oAiyFW445F0OvgxFd_Y_mAh47e_x3-f2kFScs4UGC"},
		{name:"camp2", image:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTg7NyLGG17b4FB3cs_vIHXnKIATPCuA9_54HvkhwMg_BK8wua-"},
		{name:"camp3", image:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRJFVN7fA31F-LcmMltiR_NLPRRHgBAvO7zuwCtlT_O1QI_Fya2"},
		{name:"camp1", image:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcR1O71J_F3oAiyFW445F0OvgxFd_Y_mAh47e_x3-f2kFScs4UGC"},
		{name:"camp2", image:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTg7NyLGG17b4FB3cs_vIHXnKIATPCuA9_54HvkhwMg_BK8wua-"},
		{name:"camp3", image:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRJFVN7fA31F-LcmMltiR_NLPRRHgBAvO7zuwCtlT_O1QI_Fya2"}
	];

app.get("/", function(req, res){
	res.render("landing.ejs");
})

app.get("/campgrounds", function(req, res){
	res.render("campgrounds", {campgrounds:campgrounds});
})

app.post("/campgrounds", function(req, res){
	var name = req.body.name;
	var image = req.body.image;
	campgrounds.push({name: name, image: image});
	res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res){
	res.render("new.ejs");	
})


app.listen(3000, function(){
	console.log("YelpCamp Server running on port 3000");
})