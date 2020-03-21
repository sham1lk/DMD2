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
         }

     }
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

console.log(g);
let k =1;
for (var i = 1; i < g.length; i++) {

	if(String(g[i].customer)==String(g[i-1].customer)&&String(g[i].customer)!=String(g[i+1].customer)){
		console.log(k + "   " + await Customer.findOne({_id: g[i].customer}));
		k++;
	}
	
}

console.log(await Rental.find({customer: '5e73e753ea47bb2c0109cc55'}))

}


main();