var map;
var GoogleMapsLoader = require('google-maps');
GoogleMapsLoader.KEY = 'AIzaSyCt6tCRKgtUG7sCLGvW2ot8AeGju7JeX_k';
GoogleMapsLoader.SENSOR = false;

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
