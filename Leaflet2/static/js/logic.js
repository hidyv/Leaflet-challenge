let earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
let tectonicplateURL ="https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"


// Create two layerGroups
let earthquakes = L.layerGroup();
let tectonicPlates = L.layerGroup();


// Create the tile layer that will be the background of our map.
let streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

let baseMaps = {
  "Street Map": streetMap,
  "Topographic Map": topo
};
let overlayMaps = {
  "Earthquakes": earthquakes,
  "Tectonic Plates": tectonicPlates
};

// Create a map object.


let myMap = L.map("map", {
  center: [39.73, -104.98],
  zoom: 5,
  layers:[ streetMap, earthquakes]
});

// Pass our map layers to our layer control.
// Add the layer control to the map.
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);





 

// Use url link to get the GeoJSON data.

d3.json(earthquakeURL).then(function(response) {

  //console.log(response);
  features = response.features;

  console.log(features);

  


  for (let i = 0; i < features.length; i++) {

    let location = features[i].geometry;

     // assign color for earthquake depth

    function chooseColor(depth){
      if (depth > 90) return "RGB(255, 0, 0)";
      else if (depth > 70) return "RGB(255,127,80)";
      else if (depth > 50) return "RGB(255,165,0)";
      else if (depth > 30) return "RGB(255,255,0)";
      else if (depth > 10) return "RGB(154,205,50)";
      else  return "RGB(0,255,0)";

    }

    
    if(location){
      L.circle([location.coordinates[1], location.coordinates[0]],{
        stroke: true,
        color: "black",
        fillColor: chooseColor(location.coordinates[2]),
        fillOpacity:0.75,
        radius:(features[i].properties.mag) * 10000,
        weight : 0.5

      }).bindPopup(`<h3>Location: ${features[i].properties.place}</h3> <hr> <h3> Magnitude: ${features[i].properties.mag}
        </h3><hr><h3> Depth : ${location.coordinates[2]}</h3><hr><p>${new Date(features[i].properties.time)}</p>`).addTo(earthquakes);
    }

  }
});
// Sending our earthquakes layer to the createMap function
earthquakes.addTo(myMap);

// Get the tectonic plate data from tectonicplateURL
d3.json(tectonicplateURL, function(data) {
  console.log(data);
  L.geoJSON(data, {
    color: "orange",
    weight: 2
  }).addTo(tectonicPlates);
  tectonicPlates.addTo(myMap); 
});



  // Add legend
  let legend = L.control({ position : "bottomright"});
  // When the layer control is added, insert a div with the class of "legend".
  legend.onAdd = function(){
    let div = L.DomUtil.create("div", "info legend");
    let labels = [];
    let limits = [
      '-10 - 10',
      '10 - 30',
      '30 -50',
      '50-70',
      '70-90',
      '90+'
    ];
    let colors = [
      "RGB(0,255,0)",
      "RGB(154,205,50)",
      "RGB(255,255,0)",
      "RGB(255,165,0)",
      "RGB(255,127,80)",
      "RGB(255, 0, 0)"     
    ];
    // Legend heading
    let legendInfo = "<h3>EarthQuake Depth</h3>" 
;

    div.innerHTML = legendInfo;
    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>" + limit);
    });
   
    div.innerHTML += "<ul>" + labels.join("") +"</ul>";
    return div;
  };
 
   
 legend.addTo(myMap);
  




 



















