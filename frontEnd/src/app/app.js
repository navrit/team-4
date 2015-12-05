var GoogleMapsLoader    = require('google-maps');
var io                  = require('socket.io-client');
var socket              = io.connect('http://localhost:8080');

GoogleMapsLoader.KEY = 'AIzaSyCt6tCRKgtUG7sCLGvW2ot8AeGju7JeX_k';
GoogleMapsLoader.SENSOR = false;

var issues;
var map;
var markers = [];

socket.on('data', function (data) {
    issues = data;
    GoogleMapsLoader.load(function(google) {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {
                lat: 23.51033,
                lng: 90.24176
            },
            zoom: 2
        });

        var marker, position;
        var infoWindow = new google.maps.InfoWindow();
        var issues = JSON.parse(data);

        for(var i = 0; i < issues.length; i += 1) {
            position = new google.maps.LatLng(issues[i].location.lat, issues[i].location.lng);

            marker = new google.maps.Marker({
                position: position,
                map: map,
                title: issues[i].issue
            });

            google.maps.event.addListener(marker, 'click', (function(marker, i) {
                return function() {
                    infoWindow.setContent(issues[i].issue);
                    infoWindow.open(map, marker);
                }
            })(marker, i));

            markers.push(marker);
        }

        console.log(markers);

        var mc = new MarkerClusterer(map, markers, {
            gridSize: 50,
            maxZoom: 15
        });
    });
});

socket.on('update', function(data) {
    if (markers.length > 0) {
        console.log(data.message);
    }
});
