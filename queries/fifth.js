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
	for (let i=0; i <num; i++) 
		table[i] = new Array(num);
	for (let i = 0; i < num; i++) {
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
                table[f.actor_id-1][s.actor_id-1]=1;
                table[s.actor_id-1][f.actor_id-1]=1;

			}
		}
	}
	

	await mongoose.disconnect();
 

	let an = Object.values(await bfs(table, 199)); //id of the actor
	let ans = new Array(num);
	for(let i = 0; i<num;i++){
		ans[i] = new Array(2);
		ans[i][0] = i+1;
		ans[i][1] = an[i];
}


await mongoose.disconnect();
 
// Load a new blank workbook
	await XlsxPopulate.fromBlankAsync()
    .then(workbook => {
        // Modify the workbook.
        workbook.sheet(0).cell("A1").value(ans);
        return workbook.toFileAsync("./fifth.xlsx");
    });

	console.log("done");

}


async function bfs(graph, root){
  let nodesLen = {};

  for(let i = 0; i < graph.length; i++){
    nodesLen[i] = 100; 
  }
  nodesLen[root] = 0; 

  let queue = [root];
  let current; 
  
  while(queue.length != 0){
    current  = queue.shift(); 

    let curConnected = graph[current];
    let neighborIdx = [];
    let idx = curConnected.indexOf(1);

    while(idx != -1){
      neighborIdx.push(idx);
      idx = curConnected.indexOf(1, idx + 1);
    }

    for ( let j = 0; j < neighborIdx.length; j++){
      if (nodesLen[neighborIdx[j]] == 100){ 
        nodesLen[neighborIdx[j]] = nodesLen[current] + 1;
        queue.push(neighborIdx[j]); 
      }
    }
  }

  return nodesLen;
}
main();

