const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const wishListSchema = new Schema({
        user_id: {type: Schema.Types.ObjectId, ref: 'User'},
        item_id: {type: Schema.Types.ObjectId, ref: 'Game'},
        item_name: {type: String},
        exchange_id: {type: Schema.Types.ObjectId, ref: "Exchange", default: null}
    },
    {timestamps: true}
);

//collection name is games in database

const WishList = mongoose.model('WishList', wishListSchema, "wishlist");

module.exports = WishList;