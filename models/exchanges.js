const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const exchangeSchema = new Schema({
        initiator_id: {type: Schema.Types.ObjectId, ref: 'User'},
        owner_id: {type: Schema.Types.ObjectId, ref: 'User'},
        item_id: {type: Schema.Types.ObjectId, ref: "Game"},
        exchange_item_id: {type: Schema.Types.ObjectId, ref: "Game"}
    },
    {timestamps: true}
);

//collection name is games in database

const Exchanges = mongoose.model('Exchange', exchangeSchema);

module.exports = Exchanges;