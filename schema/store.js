let m = require('mongoose');
let Schema = m.Schema;
let store = new Schema({
	store_id: Number,
            manager_staff: {
                type: m.Schema.Types.ObjectId,
                ref: 'Staff'
            },
            address: {
                type: m.Schema.Types.ObjectId,
                ref: 'Address'
            },
            last_update: Number
          
});
module.exports = m.model('Store', store);
