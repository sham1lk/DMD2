let m = require('mongoose');
let Schema = m.Schema;
let country = new Schema({
		country_id: Number,
        country: String,
        last_update: Date
});
module.exports = m.model('Country', country);