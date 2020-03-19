let m = require('mongoose');
let Schema = m.Schema;
let category = new Schema({
	  category_id: Number,
            name: String,
            last_update: Date
});
module.exports = m.model('Category', category);