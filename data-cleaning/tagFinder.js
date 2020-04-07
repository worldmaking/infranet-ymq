const fs = require("fs"), 
    path = require("path"),
    assert = require("assert")

let datapath = "m_Data.json"

let json = fs.readFileSync(datapath, "utf-8")
let data = JSON.parse(json)
let elements = data.elements

let nodes = {}
let areas = []
let ways = []
let buildings = []

let tagList = {}
let tagArray = []
let tagAList = {}
var num = 0;

// Number of each tag
for (let e of elements){
    let tag = e.tags;
    for(let t in tag){
        if(tagArray.indexOf(t) == -1){
            tagArray.push(t, 1);
        }
        else if(tagArray.indexOf(t) != -1){
            tagArray[tagArray.indexOf(t) + 1]++;
        }
    }
}
var aSort = {}
for(var i = 0; i < tagArray.length; i++){
    if(i % 2 == 0){
    aSort[tagArray[i]]++;
    aSort[tagArray[i]] = tagArray[i + 1];
    }
}

var aSortable = [];
for (var a in aSort) {
    aSortable.push([a, aSort[a]]);
}

aSortable.sort(function(a, b) {
    return a[1] - b[1];
});
var aObjSorted = {}
aSortable.forEach(function(item){
    aObjSorted[item[0]]=item[1]
})

fs.writeFile("tagSet.json", JSON.stringify(aObjSorted, null, "  "),  (err) => {
    if (err) throw err;
    console.log('Data written to file');
});
let skipkeys = [

    'power', 'natural', 'landuse', 'shop', 'leisure', 'service',
    'amenity', 'aeroway', 'height', 'area', 'cycleway:left', 
    'cycleway:right', 'cycleway', 'footway', 'sidewalk', 'railway', 
    'building:levels', 'lanes', 'lane', 'oneway', 'highway', 
    'building', 'area:highway', 'area:aeroway', 'building:area',
    'historic', 'school', 'place', 'office', 'buildings', 'shelter',
    'information', 'man_made', 'healthcare', 'craft', 'toilets',
    'military', 'public_transport', 'station', 'bridge', 'tourism'
    
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
 //       tagList[t] = 1;
      }
        else if(tagList[t] == true){
 //           tagList[t]++;
        }  
}
    
}

//console.log(tagList);
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