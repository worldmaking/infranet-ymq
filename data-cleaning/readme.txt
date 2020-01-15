https://www.overpass-api.de/api/interpreter?data=[out:json];area[name=%22Montr%C3%A9al%22];area[%22ISO3166-1%22=%22CA%22][admin_level=2];(node(area);way(area););out;
https://www.overpass-api.de/api/interpreter?data=[out:json];area[name=%22Montr%C3%A9al%22];(node(area);way(area););out;


https://www.overpass-api.de/api/interpreter?data=[out:json];area[name=%22Montr%C3%A9al%22];(node[amenity](area);way[amenity](area);relation[amenity](area););out;
Montréal

https://www.overpass-api.de/api/interpreter?data=[out:json];area[name=%22Montr%C3%A9al%22];(node[amenity](area);way[amenity](area););out;


https://www.overpass-api.de/api/interpreter?data=[out:json];area[name="Montréal"];(node[amenity](area);way[amenity](area););out;

https://www.overpass-api.de/api/interpreter?data=[out:json];area[name="Laval"];(node[amenity](area);way[amenity](area););out;

https://www.overpass-api.de/api/interpreter?data=[out:json];area[name="Montréal"];(node[amenity](area);way[amenity](area););out;area[name="Laval"];(node[amenity](area);way[amenity](area););out;


https://www.overpass-api.de/api/interpreter?data=[out:json];(area[name="Montréal"];)->.a;(area["ISO3166-1"="CA"][admin_level=2];)->.a;(node[amenity](area);way[amenity](area););out;

https://www.overpass-api.de/api/interpreter?data=[out:json];(area[name="Montréal"];)->.a;(area[name="Laval"])->.a;(node[amenity](area.a);way[amenity](area.a););out;


This Works!!
https://www.overpass-api.de/api/interpreter?data=[out:json];(area[name="Montréal"];)->.a;(area[name="Laval"];)->.a;(node(area.a)(45.2,-74.2,45.7,-72.1);way(area.a)(45.2,-74.2,45.7,-72.1););out;


https://www.overpass-api.de/api/interpreter?data=[out:json];area[name="Montréal"];(node(area)(45.2,-74.2,45.7,-72.1);way(area)(45.2,-74.2,45.7,-72.1););out;area[name="Laval"];(node(area)(45.2,-74.2,45.7,-72.1);way(area)(45.2,-74.2,45.7,-72.1););out;
