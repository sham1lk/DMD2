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
 
  let bfs = (graph, root) => {
  let nodesLen = {};

  for(let i = 0; i < graph.length; i++){
    nodesLen[i] = 100; // Idicates that a node is not reachable from the start node
  }
  nodesLen[root] = 0; // The distance of the root node from the root node is set to 0

  let queue = [root] // Keep track of nodes we visit
  let current; // Keep track of the current node we are traversing

  // This loop will keep traversing nodes in the queue until we have no other node to traverse
  while(queue.length != 0){
    current  = queue.shift(); // Removes the first element in the array

    let curConnected = graph[current]; // We get all the nodes connected to the current node
    let neighborIdx = [];
    let idx = curConnected.indexOf(1); // Gets the index of the first node connected to the current node because the number one in our array shows that the node is connected to anothe node on that index

    // If there is no node at the index of one, the index variable will be set to -1. 
    while(idx != -1){
      neighborIdx.push(idx); // So while index does not equals to -1, push our index onto our list of neighbors.
      idx = curConnected.indexOf(1, idx + 1); // This line searches for the next connected node.
    }

    // Now that we know all the nodes connected to the current node, we loop through this connected nodes, and get the distance
    for ( let j = 0; j < neighborIdx.length; j++){
      if (nodesLen[neighborIdx[j]] == 100){ // This line we haven't set the distance from the nodesLen[neighborIdx[j]] yet so we will set now. 
        nodesLen[neighborIdx[j]] = nodesLen[current] + 1;
        queue.push(neighborIdx[j]); // We push the neighbor to the queue so the next time we go through the while loop, we will check the neighbors of that node too.
      }
    }
  }

  return nodesLen
}


let an = Object.values(bfs(table, 9));
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

main();
