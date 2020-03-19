let m = require('mongoose');
let Schema = m.Schema;
let payment = new Schema({
	payment_id: Number,
            customer: {
                type: m.Schema.Types.ObjectId,
                ref: 'Customer'
            },
            staff: {
                type: m.Schema.Types.ObjectId,
                ref: 'Staff'
            },
            rental: {
                type: m.Schema.Types.ObjectId,
                ref: 'Rental'
            },
            amount: Number,
            payment_date: Date
});
module.exports = m.model('payment', payment);