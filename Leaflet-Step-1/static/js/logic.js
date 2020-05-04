// confirmation to console that file was loaded
console.log("loaded logic.js");

// function that creates the map object
function createMap(earthquakes) {
    // background
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  // object to hold the lightmap layer
  var baseMaps = {
    "Light Map": lightmap
  };

  // object to hold the earthquakes layer
  var overlayMaps = {
    "Earthquakes": earthquakes
  };

  // create the map object
  var map = L.map("map", {
    center: [40.73, -74.0059],
    zoom: 12,
    layers: [lightmap, earthquakes]
  });

  // create and add layercontrol to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);
}

// function that creates the markers
function createMarkers(response) {

    // pull out features from the response
    var features = response.features;

    // create an array to hold earthquakeMarkers
    var earthquakeMarkers = [];

    // loop through the features array
    for (var i = 0; i < features.length; i++) {
        var feature = features[i];

        var lat = feature.geometry.coordinates[1];
        var lng = feature.geometry.coordinates[0];

        var earthquakeMarker = L.marker([lat, lng])
            .bindPopup('<h3>' + feature.geometry);
        
        earthquakeMarkers.push(earthquakeMarker);
    }
    createMap(L.layerGroup(earthquakeMarkers));
}

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", createMarkers);
