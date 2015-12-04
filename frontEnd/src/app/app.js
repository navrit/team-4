var GoogleMapsLoader = require('google-maps');
var map;

GoogleMapsLoader.load(function(google) {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 23.51033,
            lng: 90.24176
        },
        zoom: 8
    });
});
