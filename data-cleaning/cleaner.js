const fs = require("fs");
const path = require("path");

let name = "all";
let elements = JSON.parse(fs.readFileSync(path.join( name + ".raw.json"), "utf8")).elements;

let skipkeys = {

}

function mergekinds(tags, kinds) {
	for (let k in tags) {
		let v = tags[k];
		if (!kinds[k]) {
			kinds[k] = { 
				TOTAL: 1,
				PAIRS: {}
			};
		} else {
			kinds[k].TOTAL++;
		}
		if (!kinds[k][v]) {
			kinds[k][v] = 1;
		} else {
			kinds[k][v]++;
		}

		for (let j in tags) {
			if (j == k) continue;
			if (!kinds[k].PAIRS[j]) {
				kinds[k].PAIRS[j] = 1;
			} else {
				kinds[k].PAIRS[j]++;
			}
		}
	}
}

let ways = [];
let buildings = [];
let areas = [];
let nodes = {};

let waykinds = {};
let buildingkinds = {};
let areakinds = {};
let nodekinds = {};

let nodes_referenced = {};


let all_ids = {};

// get a list of all the node ids:
for (let e of elements) {
	if (e.type == "node") {
		all_ids[e.id] = "node";
	} else {
		all_ids[e.id] = "way";
	}
}

for (let e of elements) {

	let tags = e.tags;
	let kind;

	// delete all skippable keys:
	// if (tags) {
	// 	for (let k in skipkeys) {
	// 		delete e.tags[k];
	// 	}
	// }

	if (e.type == "way") {
		let numnodes = e.nodes.length;
		let first = e.nodes[0];
		let last = e.nodes[numnodes-1];
		let isloop = first == last;

		// is this an area, rather than a way?
		if (tags && isloop 
			&& !tags.highway
			&& !(tags.leisure == "track")
			&& !(tags.aeroway == "taxiway")
			&& !(tags.railway == "rail")) {
			
			// skip some unusable entries:
			if (tags.leisure == "yes"
		 	|| tags.amenity == "parking_space"
			|| tags.amenity == "water_point"
			|| tags.barrier == "fence"
			) continue;

			// fix some bugs:
			if (tags.high) {
				tags.height = tags.high;
				delete tags.high;
			}
			if (tags['building:level']) {
				tags.height = tags['building:level'];
				delete tags['building:level'];
			}
			if (tags['building:levels']) {
				tags.height = tags['building:levels'];
				delete tags['building:levels'];
			}
			if (tags['area:highway']) {
				tags.highway = tags['area:highway'];
				delete tags['area:highway'];
			}
			if (tags['area:aeroway']) {
				tags.aeroway = tags['area:aeroway'];
				delete tags['area:aeroway'];
			}
			if (tags.service == "repair") {
				tags.shop = "repair";
				delete tags.service;
			}
			if (tags.attraction) {
				tags.tourism = tags.attraction;
				delete tags.attraction;
			}

			// power buildings:
			if (tags.power) {
				kind = "power";
				tags.building = "power";
				delete tags.substation;
				delete tags.landuse;
				delete tags.building;
			}
			if (tags.industrial == "electrical") {
				kind = "power";
				tags.power = "industrial";
				delete tags.industrial;
			}

			if (tags.bridge) {
				tags.building = tags.bridge;
				delete tags.bridge;
			}
			if (tags.school) {
				tags.building = tags.school;
				delete tags.school;
			}

			if (tags.information == "office") {
				tags.office = "touristinformation";
				delete tags.information;
			}
			if (tags.office) {
				tags.building = "office";
				delete tags["building:levels"];
				delete tags.level;
				delete tags.area;
				delete tags.government;
				if (tags.office == "yes") delete tags.office;
			}

			if (tags["leisure"] == "stadium") {
				tags.building = "stadium";
			}
			if (!tags.building && tags.amenity) {
				tags.building = tags.amenity;
			}
			if (!tags.building && tags.railway) {
				tags.building = tags.railway;
			}
			if (!tags.building && tags.public_transport) {
				tags.building = tags.public_transport;
			}

			if (!tags.building && tags.man_made && tags.man_made != "bridge") {
				tags.building = tags.man_made;
			}

			if (tags.leisure == "ice_rink"
				|| tags.leisure == "fitness_centre"
				|| tags.leisure == "swimming_pool"
				|| tags.leisure == "sports_centre") {
				if (!tags.building) tags.building = "leisure";
			}
			if (!tags.building && tags.tourism == "museum") {
				tags.building = "museum";
			}
			if (!tags.building && tags.shop) {
				tags.building = "shop";
			}
			if (!tags.building && tags.parking) {
				tags.building = "parking";
			}

			if (tags.building == "yes") {
				if (tags.amenity) {
					tags.building = tags.amenity;
				} else if (tags.public_transport) {
					tags.building = "public_transport";
				} else if (tags.railway) {
					tags.building = "public_transport";
				} else if (tags.aerialway) {
					tags.building = "public_transport";
				} else if (tags.tourism) {
					tags.building = tags.tourism;
				} else if (tags.leisure) {
					tags.building = tags.leisure;
				} else if (tags.historic) {
					tags.building = tags.historic;
				} else if (tags.aeroway) {
					tags.building = "aeroway";
				} else if (tags.shop) {
					tags.building = "shop";
				} else if (tags.place) {
					tags.building = tags.place;
				} else if (tags.healthcare) {
					tags.building = "healthcare";
				} else if (tags.craft) {
					tags.building = "craft";
				} else if (tags.toilets) {
					tags.building = "toilets";
					delete tags.toilets;
				}
				// "man_made": "works"
				// man_made: wastewater_plant:
				// product: food
			}

			// mark all nodes used:
			let safenodes = [];
			for (let n of e.nodes) {
				if (all_ids[n]) {
					nodes_referenced[n] = true;
					safenodes.push(n);
					if (all_ids[n] != "node") {
						console.log('wrong id', n, all_ids[n])
					}
				} else {
					//console.log('missing id', n)
				}
			}

			if (tags.building) {

				if (tags.building == "apartments") {
					kind = "homes";

				} else if (tags.building == "works"
					|| tags.building == "office"
					|| tags.shop) {
					kind = "works";

						
				} else if (tags.leisure
					|| tags.tourism
					|| tags.building == "university"
					|| tags.building == "school"
					|| tags.building == "kindergarten") {
					kind = "culture";

				} else if (tags.building == "yes") {
					continue;
					
				} else {

					//console.log(tags);
					//break;
				}

				mergekinds(tags, buildingkinds);

				buildings.push({
					//kind: kind,
					tags: tags,
					//id: e.id,
					nodes: safenodes,
				});
			} else {

				if (tags.natural == "water"
				|| tags.natural == "wetland"
				|| tags.waterway) {
					kind = "water";
					delete tags.natural;


				} else if (tags.natural == "grassland" 
				|| tags.natural == "heath" 
				|| tags.natural == "fell" 
				|| tags.wetland == "marsh"
				|| tags.landuse == "grass"
				|| tags.landuse == "farmland"
				|| tags.landuse == "farmyard"
				|| tags.landuse == "allotments"
				|| tags.landuse == "greenfield"
				|| tags.place == "farm"
				|| tags.landuse == "meadow"
				|| tags.landuse == "cemetery"
				|| tags.leisure == "park"
				|| tags.leisure == "garden"
				|| tags.leisure == "pitch"
				|| tags.leisure == "golf_course"
				|| tags.leisure == "miniature_golf") {
					kind = "grass";

				} else if (tags.landuse == "forest"
				|| tags.landuse == "orchard"
				|| tags.natural == "wood") {
					kind = "trees";
					
				} else if (tags.natural == "sand"
				|| tags.leisure == "playground"
				|| tags.leisure == "fitness_station"
				|| tags.landuse == "military"
				|| tags.military
				|| tags.landuse == "construction"
				|| tags.landuse == "railway") {
					kind = "sand";

				} else if (tags.landuse == "industrial"
				|| tags.landuse == "commercial"
				|| tags.landuse == "greenhouse_horticulture"
				|| tags.landuse == "garages"
				|| tags.aeroway
				|| tags.landuse == "retail"
				|| tags.power) {
					kind = "works";

				} else if (tags.landuse == "residential") {
					kind = "homes";
					
				} else if (tags.historic
					|| tags.tourism
					|| tags.landuse == "religious") {
					kind = "culture";
					
					
				} else {

					//console.log(tags)
					continue;
				}

				mergekinds(tags, areakinds);

				areas.push({
					kind: kind,
					tags: tags,
					//id: e.id,
					nodes: safenodes,
				});
			}
			

		} else if (tags) {
			// skip ways that are not really ways
			if (tags.barrier
				|| tags.handrail
				|| tags.admin_level 
				|| tags.construction
				|| tags['construction:railway']
				|| tags.building == "yes") {
				// skip these items
				continue;
			}
			if (tags.railway == "construction") continue;
			if (tags.highway == "construction") continue;
			if (tags.natural == "tree_row") continue;

			for (let k in tags) {
				if (tags[k] == "no") {
					delete tags[k];
				}
			}
			delete tags.bicycle;

			// way kinds:
			// pathway
			// highway
			// railway
			// waterway
			// powerway

			let kind = undefined;

			if (tags.railway) {
				kind = "railway";
				delete tags.tracks;
			} else if (tags.waterway) {
				kind = "waterway";
				delete tags.highway;
			} else if (tags.power) {
				delete tags.power;
				kind = "powerway";
				delete tags.cables;
				//delete tags.circuits;
				delete tags.line;
			} else if (tags.aeroway) {
				kind = "pathway";
				
			} else if (tags.highway) {

				delete tags.service;
				//delete tags.surface;
				// distinguish foot/cycle paths from car highways?
				if (tags.highway == "pedestrian"
					|| tags.highway == "footway"
					|| tags.highway == "bridleway"
					|| tags.highway == "cycleway"
					|| tags.highway == "steps"
					|| tags.highway == "path") {
					kind = "pathway";

				} else {
					kind = "highway";
				}
			} else if (tags.leisure == "track"
			|| tags.aerialway) {
				kind = "pathway";

			} else {
				// nothing gets here
				continue;
			}

			mergekinds(tags, waykinds);

			// mark all nodes used:
			let safenodes = [];
			for (let n of e.nodes) {
				if (all_ids[n]) {
					nodes_referenced[n] = true;
					safenodes.push(n);
					if (all_ids[n] != "node") {
						console.log('wrong id', n, all_ids[n])
					}
				} else {
					//console.log('missing id', n)
				}
			}
			if (safenodes.length > 1) {
				ways.push({
					kind: kind,
					tags: tags,
					id: e.id,
					nodes: safenodes,
				});
			}
		} else {
			//console.log("mysterious looped way with no tags");
			continue;
		}

	} else if (e.type == "node") {
		// even a single node can be a building:
		
		let tags = e.tags;
		if (!tags) continue;
		if (tags.amenity) {
			tags.building = tags.amenity;
		} else if (tags.station) {
			tags.building = "public_transport";
		}else if (tags.shop) {
			tags.building = "shop";
		}

		if (tags.building) {
			nodes_referenced[e.id] = true;
			buildings.push({
				//kind: kind,
				tags: tags,
				//id: e.id,
				nodes: [e.id],
			});
		}
	}
}
for (let e of elements) {
	if (e.type == "node") {
		if (!nodes_referenced[e.id]) continue;

		if (e.tags) {
			mergekinds(e.tags, nodekinds);
		}

		nodes[e.id] = [e.lon, e.lat];
		
	}
}
let kinds = {
	ways: waykinds,
	areas: areakinds,
	nodes: nodekinds,
}

let everything = {
	nodes: nodes,
	ways: ways,
	areas: areas,
	buildings: buildings,
}


fs.writeFileSync(path.join( name + ".data.cleaned.min.json"), JSON.stringify(everything), "utf8")
fs.writeFileSync(path.join( name + ".data.cleaned.json"), JSON.stringify(everything, null, 2), "utf8")