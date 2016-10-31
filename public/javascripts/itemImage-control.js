var fs = require('fs-extra');
var path = require('path');
var List = require('../../app/models/listItem.js')

module.exports.uploadImage = function(req, res){
    var file = req.files.file;
	var userId = req.body.userId;
    console.log("User " + userId + " is submitting " , file);

    var uploadDate = new Date().toISOString;
    var tempPath = file.path;
    var targetPath = path.join(__dirname, "../../uploads/" + userId + uploadDate + file.name);
    var savePath = "/uploads/" + userId + uploadDate + file.name;
    
	    fs.rename(tempPath, targetPath, function (err){
	    if (err){
	        console.log(err)
	    } else {
	   		List.findById(userId, function(err, userData){
	   			var user = userData;
	   			user.itemImage = savePath;
	   			user.save(function(err){
	   				if(err){
	   					console.log("save failed");
	   				}
	   				else{
	   					console.log("image update successs");
	   				}
	   			});
	   		});
	    };
	});
}

module.exports.updateBio = function(req, res){
	var userId = req.body.userId;
	var bio = req.body.bio;

	User.findById(userId, function(err, userData){
		var user = userData;
		user.local.bio = bio;

		user.save(function(err){
			if(err){
				console.log("failed to save bio");
				res.json({status:500});
			}
			else{
				console.log("bio saved.");
				res.json({status:200});
			}
		})
	})
}