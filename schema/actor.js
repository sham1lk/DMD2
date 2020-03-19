let m = require('mongoose');
let Schema = m.Schema;
let actor = new Schema({
	actor_id: Number,
            first_name: String,
            last_name: String,
            last_update: Date
});
module.exports = m.model('Actor', actor);