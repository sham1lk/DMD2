const XlsxPopulate = require('xlsx-populate');
let mongoose = require('mongoose');
let Film = require('../schema/film.js');
let Category = require('../schema/category.js');
let Rental = require('../schema/rental.js');
let Inventory = require('../schema/inventory.js');
mongoose.connect('mongodb://localhost:27017/dvdrental', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            bufferCommands: false});

main();


async function main(){

list = Rental.find().populate([
        {
          path: 'inventory',
          model: 'Inventory',
        },
      ]);
films = await Film.find().populate([
{
		path: 'category._id',
		model: 'Category',
}]);

let t = await list.find();
let col = new Array(t.length);
for(let i = 0;i< t.length;i++)
{
	col[i] = t[i].inventory.film;
}	
ans = new Array(films.length);
for (var i = 0; i < films.length; i++) {
	ans[i] = new Array(3);
	ans[i][0] = films[i].title;
	ans[i][1] = films[i].category._id.name;
	ans[i][2] = col.filter(h => String(h)==String(films[i]._id)).length;
}

await mongoose.disconnect();
 
// Load a new blank workbook
	await XlsxPopulate.fromBlankAsync()
    .then(workbook => {
        // Modify the workbook.
        workbook.sheet(0).cell("A1").value(ans);
        return workbook.toFileAsync("./third.xlsx");
    });

	console.log("done");


}