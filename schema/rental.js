let m = require('mongoose');
let Schema = m.Schema;
let rental = new Schema({
	rental_id: Number,
            rental_date: Date,
            inventory: {
                type: m.Schema.Types.ObjectId,
                ref: 'Inventory'
            },
            customer: {
                type: m.Schema.Types.ObjectId,
                ref: 'Customer'
            },
            return_date: Date,
            staff: {
                type: m.Schema.Types.ObjectId,
                ref: 'Staff'
            },
            last_update: Date
});

module.exports = m.model('Rental', rental);