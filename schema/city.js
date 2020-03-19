let m = require('mongoose');
let Schema = m.Schema;
let city = new Schema({
	city_id: Number,
            city: String,
            country: {
                type: m.Schema.Types.ObjectId,
                ref: 'Country'
            },
            last_update: Date
});
module.exports = m.model('City', city);