var GoogleMapsLoader    = require('google-maps');
var io                  = require('socket.io-client');
var socket              = io.connect('http://localhost:8080');

GoogleMapsLoader.KEY = 'AIzaSyCt6tCRKgtUG7sCLGvW2ot8AeGju7JeX_k';
GoogleMapsLoader.SENSOR = false;

var data;
var map;
var markers;

socket.on('data', function (data) {
    GoogleMapsLoader.load(function(google) {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {
                lat: 23.51033,
                lng: 90.24176
            },
            zoom: 8
        });

        var marker;
        var infoWindow = new google.maps.InfoWindow();
        var markers = JSON.parse(data);

        for( i = 0; i < markers.length; i++ ) {
            var position = new google.maps.LatLng(markers[i].location.lat, markers[i].location.lng);

            marker = new google.maps.Marker({
                position: position,
                map: map,
                title: markers[i].issue
            });

            google.maps.event.addListener(marker, 'click', (function(marker, i) {
                return function() {
                    infoWindow.setContent(markers[i].issue);
                    infoWindow.open(map, marker);
                }
            })(marker, i));
        }
    });

});
