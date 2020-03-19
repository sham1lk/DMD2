let m = require('mongoose');
let Schema = m.Schema;
let staff = new Schema({
 staff_id: Number,
	    first_name: String,
	    last_name: String,
	    address: {
	        type: m.Schema.Types.ObjectId,
	        ref: 'Address'
	    },
	    email: String,
	    store: {
	        type: m.Schema.Types.ObjectId,
	        ref: 'Store'
	    },
	    active: Boolean,
	    username: String,
	    password: String,
	    last_update: Date,
	    picture: Buffer
});
module.exports = m.model('Staff', staff);