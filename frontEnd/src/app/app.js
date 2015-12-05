var example = require('./example.js');
console.log(example);

var map;
var GoogleMapsLoader = require('google-maps');
GoogleMapsLoader.load(function(google) {

  var myLatLng = {
    lat: 23.51033,
    lng: 90.24176
  };

    map = new google.maps.Map(document.getElementById('map'), {
        center: myLatLng,
        zoom: 8
    });

    var marker = new google.maps.Marker({
      position: myLatLng,
      map: map,
      title: 'Hello World'
    });
});
