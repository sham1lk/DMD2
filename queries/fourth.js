const XlsxPopulate = require('xlsx-populate');
let mongoose = require('mongoose');
let Film = require('../schema/film.js');
let Category = require('../schema/category.js');
let Rental = require('../schema/rental.js');
let Inventory = require('../schema/inventory.js');
let Customer = require('../schema/customer.js');
mongoose.connect('mongodb://localhost:27017/dvdrental', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            bufferCommands: false});
var readlineSync = require('readline-sync');
 


main();


async function main(){
	var cust = readlineSync.question('enter customer id ');
	
	cus = await Customer.findOne({'customer_id': cust});

	list =await Rental.find({'customer': cus._id}).populate([
        {
          path: 'inventory',
          model: 'Inventory',
          populate: {
          	path: 'film',
          	model: 'Film',
          }
        },
      ]);
	let cat = await Category.find();
	let cats = new Array(cat.length);

	for (var i = 0; i < cat.length; i++) {
		cats[i] = new Array(2);
		cats[i][0] = cat[i]._id;
		cats[i][1] = 0;
	}
	for (var i = 0; i < list.length; i++) {
		for (var k = 0; k < cats.length; k++) {
			if(String(cats[k][0]) == String(list[i].inventory.film.category._id))
				{cats[k][1]++;
					break;}
		}
	}
	cats.sort();

	let film = await Rental.find({}).populate([
        {
          path: 'inventory',
          model: 'Inventory',
          populate: {
          	path: 'film',
          	model: 'Film',
          }
        },
      ]);

	let exit = 0;
	let t =0;
	while(exit == 0)
	{	
		t = Number.parseInt(Math.random() * film.length);
		if((String(film[t].inventory.film.category._id) == String(cats[0][0]))&&(list.indexOf(film[t]))<0){
		cats[0][1]--;
		cats.sort();
		console.log(film[t].inventory.film.title);
		exit = readlineSync.question('enter 0 if you want new recomendation ');

		}

	}
	await mongoose.disconnect();

}