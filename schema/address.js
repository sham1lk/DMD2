let m = require('mongoose');
let Schema = m.Schema;
let address = new Schema({
	address_id: Number,
            address: String,
            address2: String,
            district: String,
            city: {
                type: m.Schema.Types.ObjectId,
                ref: 'City'
            },
            postal_code: String,
            phone: String,
            last_update: Date
});
module.exports = m.model('Address', address);