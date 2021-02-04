// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"


// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
});

function createMap(earthquakes) {

    // Define lightmap and darkmap
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 20,
        id: "mapbox/light-v10",
        accessToken: API_KEY
    });

    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 20,
        id: "dark-v10",
        accessToken: API_KEY
    });

    // Define a baseMaps object to hold our base layers
    var baseMap = {
        "Light Map": lightmap,
        "Dark Map": darkmap
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    // Create map and  give it the lightmap and earthquakes layers to display
    var myMap = L.map("map", {
        center: [
            36.7, -120.4
        ],
        zoom: 5,
        layers: [lightmap, earthquakes]
    });

    // Add the layer control to the map
    L.control.layers(baseMap, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

// legend
    var legend = L.control({ position: "bottomleft" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "Earthquake Info Legend ");
        var limits = [5,4,3,2,1,0];
        var colors = ["#f06465", "#f0936b", "#f3ba4e", "#f3db4c", "#c7f34c",'#74f34d'];
        var labels = [];


        var legendInfo = "<h1>Earthquake Info Legend</h1>" +
            "<div class=\"labels\">" + "</div>";

        div.innerHTML = legendInfo;

        limits.forEach(function(limit, index) {
            labels.push("<li style=\"background-color: "
                + colors[index] + "\">"
                + limit + "-" + (limit+1) + "</li>");
        });

        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
    };
    legend.addTo(myMap);
}

function createFeatures(quakeData) {
    function onEachFeature(feature, layer) {
        layer.bindPopup('<h4><p>Location: '
            + feature.properties.place +"</p>"
            + '</hr><hr>Date: '
            + new Date(feature.properties.time)
            + "<hr><p>Magnitude: "
            + feature.properties.mag +"</p>"
        )}

    const ToMap = L.geoJSON(quakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: function(feature, latlng) {
            let radius = feature.properties.mag * 4;

            if (feature.properties.mag > 5) {
                fillcolor = '#f06465';}

            else if (feature.properties.mag >= 4) {
                fillcolor = '#f0936b';}

            else if (feature.properties.mag >= 3) {
                fillcolor = '#f3ba4e';}

            else if (feature.properties.mag >= 2) {
                fillcolor = '#f3db4c';}

            else if (feature.properties.mag >= 1) {
                fillcolor = '#c7f34c';}

            else  fillcolor = '#74f34d';

            return L.circleMarker(latlng, {
                radius: radius,
                color: '#000000',
                fillOpacity: 0.8,
                fillColor: fillcolor,
                weight: .5
            });
        }
    });
    createMap(ToMap);
}