let m = require('mongoose');


let Schema = m.Schema;

let film = new Schema({
   film_id: Number,
            title: String,
            description: String,
            release_year: Number,
            language: {
                type: m.Schema.Types.ObjectId,
                ref: 'Language'
            },
            rental_duration: Number,	
            category: {
                _id: {
                    type: m.Schema.Types.ObjectId,
                    ref: 'Category'
                },
                last_update: Date
            },
            actors: [{
                _id: {
                    type: m.Schema.Types.ObjectId,
                    ref: 'Actor'
                },
                last_update: Date
            }],
            rental_rate: Number,
            length: Number,
            replacement_cost: Number,
            rating: String,
            last_update: Date,
            special_features: [String],
            fulltext: String
});

module.exports = m.model('Film', film);