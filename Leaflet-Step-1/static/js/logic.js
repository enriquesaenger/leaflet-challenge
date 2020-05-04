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
    center: [25, 0],
    zoom: 2.5,
    layers: [lightmap, earthquakes]
  });

  // create and add layercontrol to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);

  // create a legend
  var legend = L.control({position: 'bottomright'});
  
  legend.onAdd = function (map) {
      var div = L.DomUtil.create('div', 'info legend'),
      grades = [0, 1, 2, 3, 4, 5];

      // had to put the color function here again so that the for loop has access to it
      function getColor(m) {
        return m > 5 ? '#bd0026' :
        m > 4 ? '#f03b20' :
        m > 3 ? '#fd8d3c' :
        m > 2 ? '#feb24c' :
        m > 1 ? '#fed976' :
        '#ffffb2' ;
      }

      // loop through and create the html with proper colors
      for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
      return div;
  };

  legend.addTo(map);

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

        // pull out the specific properties of the feature
        var lat = feature.geometry.coordinates[1];
        var lng = feature.geometry.coordinates[0];
        var place = feature.properties.place;
        var mag = feature.properties.mag;
        var time = feature.properties.time;

        // function to determine the color
        function getColor(m) {
            return m > 5 ? '#bd0026' :
            m > 4 ? '#f03b20' :
            m > 3 ? '#fd8d3c' :
            m > 2 ? '#feb24c' :
            m > 1 ? '#fed976' :
            '#ffffb2' ;
        }

        // function to resize
        function getSize(m) {
            return m * 5;
        }

        // marker options for various things
        var markerOptions = {
            radius: getSize(mag),
            fillColor: getColor(mag),
            color: '#252525',
            weight: 1,
            fillOpacity: 1
        }

        // label for the pop-up
        var earthquakeMarker = L.circleMarker([lat, lng], markerOptions)
            .bindPopup('<h3> Magnitude: ' + mag + '</h3>' + '<h3> Location: ' + place + '</h3>' + '<h3> Date & Time: ' + new Date(time) + '</h3>');
        
        // push the markers to the marker layer
        earthquakeMarkers.push(earthquakeMarker);
    }
    
    // call the create map function and pass through the markers created
    createMap(L.layerGroup(earthquakeMarkers));
}

// get the data and call createMarkers after getting it
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", createMarkers);
