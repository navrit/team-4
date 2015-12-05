require('js-marker-clusterer');

var GoogleMapsLoader    = require('google-maps');
var grapher             = require('./grapher');
var io                  = require('socket.io-client');
var socket              = io.connect('http://localhost:8080');

GoogleMapsLoader.KEY = 'AIzaSyCt6tCRKgtUG7sCLGvW2ot8AeGju7JeX_k';
GoogleMapsLoader.SENSOR = false;

var issues;
var map;
var markers = [];

socket.on('data', function (data) {
    console.log("Hello")

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

var angular = require('angular');

var app = angular.module('add', [])
    .controller('controller', [
        '$scope',
        function($scope) {
            $scope.filters = {
                'education': true,
                'economics': true,
                'social': true,
                'rescources': true,
                'monitoring': true
            };

            $scope.goals = Object.keys($scope.filters);

            $scope.$watch(function() {
                return $scope.filters;
            }, function() {
                console.log("Typo moe");
            }, true);
        }
    ]).filter('capitalize', function() {
        return function(value) {
            return value.split(' ').map(function(word) {
                return word[0].toUpperCase() + word.slice(1);
            }).join(' ' );
        }
    });
