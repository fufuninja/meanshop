var Users = require('../../app/models/user.js');

module.exports.getUsers = function(req, res){
	Users.find({}, function(err, UsersData){
		if(err){
			res.error(error);
		}
		else{
			res.json(UsersData);
		}
	});
}

module.exports.followUser = function(req, res){
	var userId = req.body.userId;
	var followId = req.body.followId;

	Users.findById(followId, function(err, data){
		data.local.followers.push({userId:userId});
		data.save();
	});

	Users.findById(userId, function(err, data){
		data.local.following.push({userId:followId});
		data.save();
	})
}

module.exports.unfollowUser = function(req, res){
	var myId = req.body.userId;
	var IdThatIFollow = req.body.followId;

	Users.findById(myId, function(err, data){
		var followings = data.local.following;
		var index = followings.findIndex(function(item, i){
			return item.userId === IdThatIFollow;
		})
		data.local.following.splice(index);
		data.save();
		if (err){
			console.log(err);
		}
	})

	Users.findById(IdThatIFollow, function(err, data){
		var follows = data.local.followers;
		var index_1 = follows.findIndex(function(item, i){
			return item.userId === myId;
		})
		data.local.followers.splice(index_1);
		data.save();
		if (err){
			console.log(err);
		}
	})
}