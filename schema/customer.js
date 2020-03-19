let m = require('mongoose');
let Schema = m.Schema;
let customer = new Schema({
 customer_id: Number,
            store: {
                type: m.Schema.Types.ObjectId,
                ref: 'Store'
            },
            first_name: String,
            last_name: String,
            email: String,
            address: {
                type: m.Schema.Types. ObjectId,
                ref: 'Address'
            },
            activebool: Boolean,
            create_date: String,
            last_update: Date,
            active: Number
});

module.exports = m.model('Customer', customer);