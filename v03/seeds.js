var mongoose = require("mongoose");
var campGround = require("./models/campground");
var comment = require("./models/comment");

var data = [
	{
		name: "camp1",
		image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTg7NyLGG17b4FB3cs_vIHXnKIATPCuA9_54HvkhwMg_BK8wua-&usqp=CAU",
		description: "this is camp1"
	},
	{
		name: "camp2",
		image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcR46t9YiVZQLj_Le82f3O8JOGb1FYBzqu3xBLpcKR9dSMCOssAA&usqp=CAU",
		description: "this is camp2"
	},
	{
		name: "camp3",
		image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcStCiaTDKzyE_aPqgQuqUkjBkauw16oOocyoZ8t7Oj9Is3CXRv6&usqp=CAU",
		description: "this is camp3"
	}
]
function seedDB(){
	
	comment.deleteMany({});
	campGround.deleteMany({}, function(err){
		if(err){
			console.log(err); 
		}
		
		console.log("remove existing campgounds!");
	
		data.forEach(function(seed){
			
			campGround.create(seed, function(err, campgound){
				if(err){
					console.log(err);
				} else {
					console.log("added a Camp Ground");
					comment.create(
						{
							text: "commet content",
							author: "fuker & lover"
						}, function(err, comment){
							if(err){
								console.log(err);
							} else {
								campgound.comments.push(comment);
								campgound.save();
								console.log("Created a new comment");
							}
						}
					);
				}
			});
		});
	});
}


module.exports = seedDB;