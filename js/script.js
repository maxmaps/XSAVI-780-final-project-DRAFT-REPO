//adding the map and setting the tile layer:
var myMap = L.map("mapid", {
    maxZoom: 17,
    minZoom: 2,
    maxBounds: [[-85,-180.0], [85,180.0]],
}).setView([38.82259, 0], 2);
    tiles = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
                accessToken: 'pk.eyJ1Ijoic2NobWl0bWEiLCJhIjoiY2o4a3phaW11MGowMTJ2anM5d2JhMmc3ZyJ9.AUgXecxV7PFNkmL9Xdj6-g',
                id: 'mapbox.streets-satellite',
                noWrap: true
            }).addTo(myMap);

//adding GeoJSON:
var sipriReportGeoJSON;
var markers = L.markerClusterGroup({
    singleMarkerMode: true,
    spiderfyDistanceMultiplier: 1.5,
    animateAddingMarkers: true,
});
addSipriReport();

function addSipriReport() {
    $.getJSON( "data/sipri-report-explosions-geojson.geojson", function( data ) {
        var sipriReport = data;
        for (var index = 0; index < sipriReport.features.length; index++) {
            sipriReport.features[index].properties.date_long_moment = moment(sipriReport.features[index].properties.date_long, "YYYYMMDD");
        };

        // var sipriReportPointToLayer = function (feature, latlng){
        //     var sipriReportMarker = L.marker(latlng);
        //     sipriReportMarker.bindPopup("<strong>Name:</strong> " + feature.properties.name + "<br/><strong>Country:</strong> " + feature.properties.country + "<br/><strong>Region:</strong> " + feature.properties.region);
        //     markers.addLayer(sipriReportMarker);
        //     //return sipriReportMarker;
        // }
        // sipriReportGeoJSON = L.geoJson(sipriReport, {
        //     pointToLayer: sipriReportPointToLayer,
        // });
        //sipriReportGeoJSON.addTo(myMap);

        sipriReportTimeline(sipriReport);
    });
};
myMap.addLayer(markers);

var sipriReportPointToLayer = function (feature, latlng){
    var sipriReportMarker = L.marker(latlng);
    sipriReportMarker.bindPopup("<strong>Name:</strong> " + feature.properties.name + "<br/><strong>Country:</strong> " + feature.properties.country + "<br/><strong>Region:</strong> " + feature.properties.region);
    markers.addLayer(sipriReportMarker);
    //return sipriReportMarker;
    return markers;
}

//leaflet.timeline stuff:
function sipriReportTimeline(data){
    var getInterval = function(feature) {
        return {
            start: feature.properties.date_long_moment,
            end: moment("1998-05-30")  
        };
    };
    var timelineControl = L.timelineSliderControl({
        formatOutput: function(date){
            return new Date(date).toString();
        }
    });
    var timeline = L.timeline(data, {
        getInterval: getInterval,
        pointToLayer: sipriReportPointToLayer,
    });
    timelineControl.addTo(myMap);
    timelineControl.addTimelines(timeline);
    timeline.addTo(myMap);
}


//////////////////////////////////////////////////////////////////////////

//possible troubleshooting methods:
//change sipriReport in the initial function to sipriReportGeoJSON
//change the parameter detonation to either features, data, sipriReport, or sipriReportGeoJSON
//remove initial function with the var getInterval
//change the time class in said said function to something like date
//look for typos
//place this timeline codeblock earlier in code
//change dating format to something that applies to moment.min.js
//change date to date_long

/////here's the changes I made to my initial code
//1. changed detonation.properties.time to detonation.properties.date_long
//2. changed return moment(date).format("YYYYMMDD"); to return new Date(date).toString();
//3. removed     timeline.on('change', function(e){updateList(e.target);}); updateList(timeline);
//4. replaced detonation with feature