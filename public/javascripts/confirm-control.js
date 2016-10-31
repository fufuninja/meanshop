var Users = require('../../app/models/user.js');
var Messages = require('../../app/models/messages.js');

module.exports.confirmSell = function(req, res){
	var itemId = req.body.itemId;
	var buyerId = req.body.buyerId;
	var myId = req.body.myId;
	var messageId = req.body.messageId;
	var confirmSellOnce = true;

	Users.findById(myId, function(err, data){
		if (err){
			res.error(err);
		}
		data.local.sell.push({itemId: itemId, buyerId: buyerId});
		data.save();
	})

	Messages.findById(messageId, function(err, data){
		if(err){
			res.error(error);
		}
		data.confirmSellOnce = confirmSellOnce;
		data.content.push({messageOwnerId:"System", messages: "Seller has confirmed to sell. Waiting for buyer."})
		data.save();
	})
}

module.exports.decline = function(req, res){
	var itemId = req.body.itemId;
	var sellerId = req.body.sellerId;
	var myId = req.body.myId;
	var messageId = req.body.messageId;
	var confirmSellOnce = false;

	Users.findById(sellerId, function(err, data){
		if (err){
			res.error(err);
		}

		var sell = data.local.sell;
		for(var i = 0, x = sell.length; i<x; i++){
			if(sell[i].itemId === itemId && sell[i].buyerId === myId){
				data.local.sell.splice(i,1);
				data.save();
			}
		}

		Messages.findById(messageId, function(err, data){
		if(err){
			res.error(error);
		}
		data.confirmSellOnce = confirmSellOnce;
		data.content.push({messageOwnerId:"System", messages: "Buyer declined."})
		data.save();
		})	
	})

}

module.exports.accept = function(req, res){
	var itemId = req.body.itemId;
	var sellerId = req.body.sellerId;
	var myId = req.body.myId;
	var messageId = req.body.messageId;

	Users.findById(myId, function(err, data){
		if(err){
			res.error(err);
		}
		data.local.buy.push({itemId: itemId, sellerId: sellerId});
		data.save();

		var cart = data.local.cart;
		for(var i = 0, x = cart.length; i<x; i++){
			if(cart[i].itemId === itemId){
				data.local.cart.splice(i,1);
				data.save();
			}
			else{
				console.log("Not found in cart. Removed.");
			}
		}
	})

	Messages.findById(messageId, function(err, data){
		if(err){
			res.error(err);
		}
		data.content.push({messageOwnerId: "System", messages: "Transaction success! Proceed by appointing a meetup OR use our delivery."});
		data.bothConfirm = true;
		data.save();
	})
}