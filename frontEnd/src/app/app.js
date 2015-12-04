var GoogleMapsLoader = require('google-maps');
var map;


GoogleMapsLoader.KEY = 'AIzaSyCt6tCRKgtUG7sCLGvW2ot8AeGju7JeX_k';
GoogleMapsLoader.SENSOR = false;

GoogleMapsLoader.load(function(google) {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 23.51033,
            lng: 90.24176
        },
        zoom: 8
    });
});
