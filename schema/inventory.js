let m = require('mongoose');
let Schema = m.Schema;
let inventory = new Schema({
	inventory_id: Number,
            film: {
                type: m.Schema.Types.ObjectId,
                ref: 'Film'
            },
            store: {
                type: m.Schema.Types.ObjectId,
                ref: 'Store'
            },
            last_update: Date
});
module.exports = m.model('Inventory', inventory);