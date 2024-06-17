// Store our API endpoint as queryUrl.
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Pull earthquake data and log in console
d3.json(url).then(function (data) {
  console.log(data);

  createFeatures(data.features);
});

// Create marker size based on earthquake magnitude
function markerSize(magnitude) {
  return magnitude * 20000;
};

function markerColor(depth){
  if (depth < 10) return "green";
  else if (depth < 30) return "greenyellow";
  else if (depth < 50) return "yellow";
  else if (depth < 70) return "orange";
  else if (depth < 90) return "orangered";
  else return "red";
}

// Function to build markers
function createFeatures(earthquakeData) {

  // Create popup when markers are clicked on
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h4>Location: ${feature.properties.place}</h4><hr><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
  }

  // Populate map with marker
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,

    // Direct markers to correct map layer
    pointToLayer: function(feature, coords) {

      // Outline marker appearance
      let markers = {
        radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.geometry.coordinates[2]),
        fillOpacity: 0.5,
        color: "black",
        stroke: true,
        weight: 0.5
      }

      // Send the markers
      return L.circle(coords,markers);
    }
  });

  // Create the map
  createMap(earthquakes);
}

// Function to set up the map
function createMap(earthquakes) {

  // Base map code from Leaflet Documentation with attribution for copyright
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  // Load map to view at center on zoom
  let myMap = L.map("map", {
    center: [38.8026,-116.4194],
    zoom: 3,
    layers: [street, earthquakes]
  });

  // Create Legend on bottom left for better visability
 let legend = L.control({position:'bottomleft'});

legend.onAdd = () => {
    let div = L.DomUtil.create('div', 'legend');
    div.innerHTML = `
        <h1>Depth</h1>
        <h3><span style="padding:2px 10px;background:#a3f702;margin-right:5px"></span> -10 - 10</h3>
        <h3><span style="padding:2px 10px;background:#ddf400;margin-right:5px"></span> 10 - 30</h3>
        <h3><span style="padding:2px 10px;background:#f8db12;margin-right:5px"></span> 30 - 50</h3>
        <h3><span style="padding:2px 10px;background:#fab82b;margin-right:5px"></span> 50 - 70</h3>
        <h3><span style="padding:2px 10px;background:#f9a35e;margin-right:5px"></span> 70 - 90</h3>
        <h3><span style="padding:2px 10px;background:#f76065;margin-right:5px"></span> 90+</h3>
    `

    return div
};

legend.addTo(myMap);
}
