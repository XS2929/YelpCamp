var mongoose = require("mongoose");
var campGround = require("./models/campground");
var comment = require("./models/comment");
var user = require("./models/user");

var ipsum = "Ipsum nunc aliquet bibendum enim. Nam at lectus urna duis convallis convallis tellus. Sagittis aliquam malesuada bibendum arcu vitae elementum curabitur vitae. Vitae tortor condimentum lacinia quis. Arcu dui vivamus arcu felis bibendum ut tristique et. Egestas diam in arcu cursus euismod quis viverra nibh. Ultrices tincidunt arcu non sodales neque sodales ut. Vitae congue eu consequat ac felis donec et odio. Nisi lacus sed viverra tellus. Viverra nibh cras pulvinar mattis. Luctus venenatis lectus magna fringilla. Elementum integer enim neque volutpat ac tincidunt. Pretium aenean pharetra magna ac placerat vestibulum lectus. Sed viverra tellus in hac habitasse. Tellus molestie nunc non blandit massa enim nec dui.";

var data = [
	{
		name: "camp1",
		image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTg7NyLGG17b4FB3cs_vIHXnKIATPCuA9_54HvkhwMg_BK8wua-&usqp=CAU",
		description: ipsum,
		author: {
			id: "5e96a825e4c48b03d5645cd6",
			username: "Admin"
		}
	},
	{
		name: "camp2",
		image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcR46t9YiVZQLj_Le82f3O8JOGb1FYBzqu3xBLpcKR9dSMCOssAA&usqp=CAU",
		description: ipsum,
		author: {
			id: "5e96a825e4c48b03d5645cd6",
			username: "Admin"
		}
	},
	{
		name: "camp3",
		image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcStCiaTDKzyE_aPqgQuqUkjBkauw16oOocyoZ8t7Oj9Is3CXRv6&usqp=CAU",
		description: ipsum,
		author: {
			id: "5e96a825e4c48b03d5645cd6",
			username: "Admin"
		}
	}
]


function seedDB(){
	
	comment.deleteMany({}, function(err){
		if(err){
			console.log(err);
		}

	});
	campGround.deleteMany({}, function(err){
		if(err){
			console.log(err); 
		}
			
		data.forEach(function(seed){
			
			campGround.create(seed, function(err, campground){
				if(err){
					console.log(err);
				} else {
					comment.create(
						{
							text: "default comment",
							author: {
								id: "5e96a825e4c48b03d5645cd6",
								username: "Admin"
							}
						}, function(err, comment){
							if(err){
								console.log(err);
							} else {
								campground.comments.push(comment);
								campground.save();
							}
						}
					);
				}
			});
		});
	});
}


module.exports = seedDB;