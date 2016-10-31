var List = require('../../app/models/listItem.js')

module.exports.deleteItem = function(req, res){
	List.remove({
		_id: req.params.id
	}, function(err){
		if(err){
			res.send(err);
		}
	});
}