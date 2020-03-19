let m = require('mongoose');
let Schema = m.Schema;
let language = new Schema({
	language_id: Number,
            name: String,
            last_update: Date
});
module.exports = m.model('Language', language);