var List = require('../../app/models/listItem.js')

module.exports.listAll = function(req, res){
	if(req.body.itemId){
		var itemId = req.body.itemId;
		List.find({_id:itemId})
			.sort({date: -1}).exec(function(err, allItems){
				if(err){
					res.error(error);
				}
				else{
					res.json(allItems);
				}
			})
	}
	else{
	List.find({})
			.sort({date: -1}).exec(function(err, allItems){
				if(err){
					res.error(error);
				}
				else{
					res.json(allItems);
				}
			})
		};
}