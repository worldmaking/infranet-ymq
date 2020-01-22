const fs = require("fs"), 
    path = require("path"),
    assert = require("assert")

let datapath = "m_SampleNData.json"

let json = fs.readFileSync(datapath, "utf-8")
let data = JSON.parse(json)
let elements = data.elements

let nodes = {}

let areas = []
let ways = []
let buildings = []
let tagList = {}

let skipkeys = [
    'building:levels', 'height', 'repair',
    "attraction", "highway",
]


for (let e of elements) {

    // remove all the tags that we want to keep
    if (e.tags) {
		for (let k of skipkeys) {
			delete e.tags[k];
		}
    }
    
}

//get list of all tags to be removed
for (let e of elements) {
    let tag = e.tags; 
    for(let t in tag){
      if(tagList[t] != true){
        tagList[t]++;
    }  
}
    
}
var sortable = [];
//Converts to array
for (var t in tagList) {
    sortable.push(t);
}
sortable.sort();

//Converts back to list
var objSorted = {}
sortable.forEach(function(item){
    objSorted[item[0]]=item[1]
})
//console.log(tagSet);
fs.writeFile("tagsList.json", JSON.stringify(sortable, null, "  "),  (err) => {
    if (err) throw err;
    console.log('Data written to file');
});