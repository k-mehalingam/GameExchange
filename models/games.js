const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameSchema = new Schema({
        name: {type: String, required: [true, 'Name is required']},
        category: {type: String, required: [true, 'Category is required']},
        // device_type: {type: String, required: [true, 'device type is required']},
        description: {type: String, required: [true, 'description is required'],
        minLength: [10, 'Atleast 10 characters needed']},
        image: {type: String},
        created_by: {type: Schema.Types.ObjectId, ref: 'User'}
        
    },
    {timestamps: true}
);

//collection name is games in database

const Games = mongoose.model('Game', gameSchema);

module.exports = Games;