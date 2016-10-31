var mongoose = require('mongoose');

module.exports = mongoose.model('messages', {
	itemId: String,
	itemName: String,
	itemImage: String,
    userId: String,
    sellerId: String,
    confirmSellOnce: Boolean,
    bothConfirm: Boolean,
    content: [{messageOwnerId: String, date: {type: Date, default: Date.now}, messages: String}]
})