const fs = require("fs"), 
    path = require("path"),
    assert = require("assert")

let datapath = "ymq_testdata.json"
//let datapath = "dummy.json"

let json = fs.readFileSync(datapath, "utf-8")
let data = JSON.parse(json)
let elements = data.elements

let nodes = {}

let areas = []
let ways = []
let buildings = []

let skipkeys = [
    'is_in:continent', 'is_in:country', 'is_in:country_code',
    "addr:housenumber",
    "addr:street",
    "name",
    "email", "website",
]


// get a list of all the node ids:
let all_ids = {};
for (let e of elements) {
	if (e.type == "node") {
		all_ids[e.id] = "node";
	} else {
		all_ids[e.id] = "way";
	}
}



for (let e of elements) {

    // remove all the tags we don't care about
    if (e.tags) {
		for (let k of skipkeys) {
			delete e.tags[k];
		}
    }
    
    if (e.type == "way") {

    } else if (e.type == "node") {

    } else {
        error("unexpected type")
    }
    
}

let outpath = "cleaned.json"
fs.writeFileSync(outpath, JSON.stringify(data, null, "  "), "utf-8")