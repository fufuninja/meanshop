var List = require('../../app/models/listItem.js')
var Users = require('../../app/models/user.js');
var Messages = require('../../app/models/messages.js');

module.exports.viewCart = function(req, res){
	var myCartItems = [];
	for (var i = 0, len = req.body.cart.length; i < len; i++){
		myCartItems.push({_id: req.body.cart[i].itemId});
	}
	List.find({$or: myCartItems})
	.sort({date: -1})
	.exec(function(err, allItems){
					if (err){
						res.send(err);
					} else {
						res.json(allItems);
					}
				})
}

module.exports.removeFromCart = function(req, res){
	var userId = req.body.userId;
	var itemId = req.body.itemId;

	Users.findById(userId, function(err, data){
			var cart = data.local.cart;
			var index = cart.findIndex(function(item, i){
				return item.itemId === itemId;
			})
			if(index > -1){
				data.local.cart.splice(index, 1);
				data.save();
			}
			else{
				console.log("error")
			}
			if (err){
				console.log(err);
			}
		
	})

	List.findById(itemId, function(err, data){
		if(err){
			res.error(error);
		}
		var sentOnceUsers = data.sentOnce;
		console.log(sentOnceUsers);
		var index = sentOnceUsers.findIndex(function(item, i){
				return item.userId === userId;
			})

		if(index > -1){
			data.sentOnce.splice(index, 1);
			data.save();
		}
	})

	Messages.find({$and:[{sellerId: req.body.sellerId}, {itemId: req.body.itemId}]})
		.remove()
		.exec(function(err, updatedMessages){
			if(err){
				console.log(err);
			}
			else{
				console.log("success remove of message");
			}
		})
};