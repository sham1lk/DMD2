const XlsxPopulate = require('xlsx-populate');
let Film = require('../schema/film.js');
let Category = require('../schema/category.js');
let Rental = require('../schema/rental.js');
let Inventory = require('../schema/inventory.js');
let Customer = require('../schema/customer.js');
let mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/dvdrental', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            bufferCommands: false});
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

async function main(){

	let a = await Rental.aggregate(
	   [
	     {
	       $project:
	         {
	           year: { $year: "$rental_date" },
	           customer: "$customer",
	           inventory : "$inventory",
	      }},

	   ]
	);

	let max = 0;
	for (var i = 0; i < a.length; i++) {
		if(max<a[i].year)
		max = a[i].year;
	}

	let cyear = [];

	for (var i = 0; i < a.length; i++) {
		if(a[i].year == max)
			cyear.push(a[i]);
	}
	
	let g = cyear.sort(function(x,y) {
		return String(x.customer) < String(y.customer) ? -1 : String(x.customer) > String(y.customer) ? 1 : 0;
	});
	let k =1;
	let ifcat = 0;

	for (var i = 0; i < g.length-1; i++) {

		if(String(g[i].customer)!=String(g[i+1].customer)){
			
			if(ifcat == 1){
				console.log(k + "   " + await Customer.findOne({_id: g[i].customer}));
				k++;
			}	

			ifcat =0;
		}
		else
		{	
			let f = await Inventory.findOne({_id: g[i].inventory}).populate([
			{
				path: 'film',
				model: 'Film',
			}]);

			let f1 = await Inventory.findOne({_id: g[i+1].inventory}).populate([
			{
				path: 'film',
				model: 'Film',
			}]);

			if(String(f.film.category._id) != String(f1.film.category._id))
				ifcat = 1;

		}

	}
	await mongoose.disconnect();

}


main();