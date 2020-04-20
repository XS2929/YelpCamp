var mongoose = require("mongoose");
var campGround = require("./models/campground");
var comment = require("./models/comment");
var passport = require("passport");
var user = require("./models/user");

var data = [
	{
		name: "Yosemite National Park",
		image: "https://raw.githubusercontent.com/XS2929/YelpCamp/master/Images/aniket-deole-M6XC789HLe8-unsplash.jpg",
		description: "Yosemite National Park is in California’s Sierra Nevada mountains. It’s famed for its giant, ancient sequoia trees, and for Tunnel View, the iconic vista of towering Bridalveil Fall and the granite cliffs of El Capitan and Half Dome. In Yosemite Village are shops, restaurants, lodging, the Yosemite Museum and the Ansel Adams Gallery, with prints of the photographer’s renowned black-and-white landscapes of the area.",
		price: "26",
		address: "Tuolumne, Mariposa, Mono, & Madera counties, California, United States",
		contact: "2093720200",
		kidsFriendly: "YES",
		author: {
			id: "12",
			username: "ADMIN"
		}
	},
	{
		name: "Crater Lake National Park",
		image: "https://raw.githubusercontent.com/XS2929/YelpCamp/master/Images/vlad-shapochnikov-A--cz3cxstI-unsplash.jpg",
		description: "Crater Lake National Park is in the Cascade Mountains of southern Oregon. It’s known for its namesake Crater Lake, formed by the now-collapsed volcano, Mount Mazama. Wizard Island is a cinder cone near the western edge of the lake. The Rim Drive, a road surrounding the lake, offers views of the park’s volcanic formations. The park’s numerous trails include Sun Notch, with views of the Phantom Ship, a small island.",
		price: "5.00",
		address: "Klamath County, Oregon, United States",
		contact: "5415943000",
		kidsFriendly: "YES",
		author: {
			id: "12",
			username: "ADMIN"
		}
	},
	{
		name: "Yellowstone National Park",
		image: "https://raw.githubusercontent.com/XS2929/YelpCamp/master/Images/nicolasintravel-oN3U95O4cag-unsplash.jpg",
		description: "Yellowstone National Park is a nearly 3,500-sq.-mile wilderness recreation area atop a volcanic hot spot. Mostly in Wyoming, the park spreads into parts of Montana and Idaho too. Yellowstone features dramatic canyons, alpine rivers, lush forests, hot springs and gushing geysers, including its most famous, Old Faithful. It's also home to hundreds of animal species, including bears, wolves, bison, elk and antelope.",
		price: "15",
		address: "Yellowstone National Park, Wyoming, United States",
		contact: "3073447381",
		kidsFriendly: "YES",
		author: {
			id: "12",
			username: "ADMIN"
		}
	}
]


function seedDB(){
	var admin = {
			username: "ADMIN",
			isAdmin: true
	}
	
	comment.deleteMany({}, function(err){
		if(err){
			console.log(err);
		}
	});	
	
	user.deleteMany({}, function(err){
		if(err){
			console.log(err);
		} else {	
			user.register(admin, "password", function(err, newUser){
				if(err){
					console.log(err);
				} else {
					campGround.deleteMany({}, function(err){
						if(err){
							console.log(err); 
						} else {
							data.forEach(function(seed){
								seed.author.id = newUser._id;
								campGround.create(seed, function(err, campground){
									if(err){
										console.log(err);
									} else {
										comment.create(
											{
												text: "Yes, we can! We will make campgrounds great again! God bless..." + seed.name + "!!!",
												author: {
													id: newUser._id,
													username: "ADMIN"
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
						}		
					});									
				}
			});			
		}	
	});
}


module.exports = seedDB;