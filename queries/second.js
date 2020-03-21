const XlsxPopulate = require('xlsx-populate');
let mongoose = require('mongoose');
let Actor = require('../schema/actor.js');
let Film = require('../schema/film.js');


mongoose.connect('mongodb://localhost:27017/dvdrental', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            bufferCommands: false});

mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


async function countActors(){
	return Actor.countDocuments({});
}

async function main(){
	let num = await countActors();
	let table = new Array(num);
	for (let i=1; i <=num; i++) 
		table[i] = new Array(num);
	for (let i = 1; i <= num; i++) {
		for (let j = 0; j < num; j++) {
			table[i][j]=0;
		}
	}
	let films = await Film.find();
	for(let i=0; i< films.length;i++){
		for(let j = 0;j<films[i].actors.length;j++){
			let f = await Actor.
                where({_id: films[i].actors[j]._id}).
                findOne();
			for(let k = j+1; k< films[i].actors.length;k++){
                let s = await Actor.
                where({_id: films[i].actors[k]._id}).
                findOne();
                table[f.actor_id][s.actor_id]++;
                table[s.actor_id][f.actor_id]++;


			}
		}
	}
	

	await mongoose.disconnect();
 
// Load a new blank workbook
	await XlsxPopulate.fromBlankAsync()
    .then(workbook => {
        // Modify the workbook.
        workbook.sheet(0).cell("A1").value(table);
        return workbook.toFileAsync("./second.xlsx");
    });

	console.log("done");
}

main();


