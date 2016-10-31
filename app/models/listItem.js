var mongoose = require('mongoose');

module.exports = mongoose.model('listItem', {
    user: String,
    userId: String,
    itemImage: String,
    itemName: String,
    itemQuantity: String,
    itemDescription: String,
    itemPrice : String,
    sentOnce: [{userId: String}],
    date: {type: Date, default: Date.now},
})