//Color
function Color(magnitude) {
    if  (magnitude >= 5)  return  'red';
    if  (magnitude >= 4)  return 'orange';
    if  (magnitude >= 3)  return '#FFB700';
    if  (magnitude >= 2)  return '#FFFB0A'; 
    if  (magnitude >= 1)  return '#AAFF0D';
    return '#2FFF0A' ;
}
//Popup and info
function createFeatures(earthquakeData) {
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
        "</h3>Magnitude: <b>" + feature.properties.mag + 
        "</b><hr><p>"  + new Date(feature.properties.time) + "</p>");
    }

//circle
    const earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function(feature, latlng) {
            return new L.CircleMarker(latlng, {
                radius: feature.properties.mag * 5,
                fillColor: Color(feature.properties.mag),
                fillOpacity: 0.75,
                weight: 1,
                color: "black"
            });
        },        
        onEachFeature: onEachFeature
    });
    // send it to map
    createMap(earthquakes);
}
//legend
function createLegend() {
    // Create a legend to define magnitude colors
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        let div = L.DomUtil.create('div', 'info legend');
        labels = [];
        mag_categories = ['0-1', '1-2', '2-3', '3-4', '4-5', '5+'];
        mag_categories_color = [0.5, 1.5, 2.5, 3.5, 4.5, 5.5];
        var legendInfo = '<strong>Magnitude</strong>'
        div.innerHTML = legendInfo;
        labels = mag_categories.map((val, index) => {
            return "<li style=\"background-color: " + Color(mag_categories_color[index]) +
                "\"> " + val + " </li>"
        })
        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
    };
    return legend;
}

function createMap(earthquakes) {

    // Define streetmap layers
    const streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: API_KEY
    });


    // Define a baseMaps object to hold our base layers
    const baseMaps = {
        "Streets Map": streetmap
    };

    // Create overlay object to hold our overlay layer
    const overLayers = {
        "Earthquakes": earthquakes
    };

    
    const myMap = L.map("map", {
        center: [40, -100],
        zoom: 3,
        layers: [streetmap, earthquakes]
    });

  
    L.control.layers(baseMaps, overLayers, {
        collapsed: false
    }).addTo(myMap);
    const legend = createLegend()
    legend.addTo(myMap);
    
}

(async function() {
    const queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
    const data = await d3.json(queryUrl);

    createFeatures(data.features);
})()
