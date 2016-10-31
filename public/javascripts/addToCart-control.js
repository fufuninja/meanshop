var Users = require('../../app/models/user.js');

module.exports.addToCart = function(req, res){
	var userId = req.body.userId;
	var itemId = req.body.itemId;

	Users.findById(userId, function(err, data){
		data.local.cart.push({itemId: itemId});
		data.save();
	})


}