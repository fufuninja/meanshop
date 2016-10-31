var List = require('../../app/models/listItem.js')

module.exports.addItem = function(req, res){
	var list = new List(req.body);
	list.save();

	List.find({userId: req.body.userId})
		.sort({date: -1}).exec(function(err, allItems){
		if(err){
			res.error(error);
		}
		else{
			res.json(allItems);
		}
	});
}

module.exports.getAllItem = function(req, res){
	if(!req.body.following){
		List.find({userId: req.body.userId})
			.sort({date: -1}).exec(function(err, allItems){
				if(err){
					res.error(error);
				}
				else{
					res.json(allItems);
				}
			})
	}
	else {
		 var requestedList = [];
		 for (var i = 0, len = req.body.following.length; i < len; i++){
		 	requestedList.push({userId: req.body.following[i].userId});
		 }
	 	List.find({$or: requestedList})
			.sort({date: -1})
			.exec(function(err, allItems){
							if (err){
								res.error(err)
							} else {
								res.json(allItems);
							}
							})
	 };
}

