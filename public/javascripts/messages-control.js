var Messages = require('../../app/models/messages.js');
var List = require('../../app/models/listItem.js')

module.exports.sendMessages = function(req, res){
	var itemId = req.body.itemId;
	var sellerId = req.body.sellerId;
	var userId = req.body.userId;
	var content = req.body.content;
	var confirmSellOnce = false;
	var bothConfirm = false;
	
	var messages = new Messages(req.body);
	messages.save();
}

module.exports.getMessagesToMe = function(req, res){
	var userId = req.body.userId;

	Messages.find({$or:[{userId: req.body.userId}, {sellerId: req.body.userId}]})
		.sort({date: -1}).exec(function(err, allMessagesToMe){
			if(err){
				res.error(error);
			}
			else{
				res.json(allMessagesToMe);
			}
	});
}

module.exports.getMicroMessages = function(req, res){
	var messageId = req.body.messageId;

	Messages.findById(messageId, function(err, data){
		if(err){
			res.error(err);
		}
		else{
			res.json(data);
		}
	})
}

module.exports.addMicroMessages = function(req, res){
	var messageId = req.body.messageId;
	var messageOwnerId = req.body.messageOwnerId;
	var messages = req.body.messages;

	Messages.findById(messageId, function(err, data){
		if(err){
			res.error(err);
		}
		console.log(messages);
		
		data.content.push({messageOwnerId: messageOwnerId, messages: messages});
		data.save();
	})
}

module.exports.avoidDuplicateMessages = function(req, res){
	var userId = req.body.userId;
	var itemId = req.body.itemId;

	List.findById(itemId, function(err, data){
		if(err){
			res.error(error);
		}

		var myArray = [];
		
		data.sentOnce.forEach(function(item){
			if(item.userId === userId){
				myArray.push("exist!");
			}
		})

		if(myArray.length < 1){
			data.sentOnce.push({userId: userId});
			data.save();
		}
		else{
			console.log("already exist");
		}
	})

}