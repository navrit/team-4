require('js-marker-clusterer');

var _                   = require('lodash');
var GoogleMapsLoader    = require('google-maps');
var grapher             = require('./grapher');
var io                  = require('socket.io-client');
var socket              = io.connect('http://localhost:8080');

GoogleMapsLoader.KEY = 'AIzaSyCt6tCRKgtUG7sCLGvW2ot8AeGju7JeX_k';
GoogleMapsLoader.SENSOR = false;

var issues;
var map;
var markers = [];

Date.prototype.niceDate = function() {
   var yyyy = this.getFullYear().toString();
   var mm = (this.getMonth() + 1).toString();
   var dd  = this.getDate().toString();
   return (dd[1]?dd:"0"+dd[0]) + '/' + (mm[1]?mm:"0"+mm[0])  + '/' + yyyy;
  };

socket.on('data', function (data) {
    issues = data;
    GoogleMapsLoader.load(function(google) {
        var geocoder = new google.maps.Geocoder;

        map = new google.maps.Map(document.getElementById('map'), {
            center: {
                lat: 23.51033,
                lng: 90.24176
            },
            zoom: 2
        });

        var marker, position;
        var infoWindow = new google.maps.InfoWindow();
        JSON.parse(data).forEach(function(issue) {
            issue.time = new Date(issue.time).niceDate();
            issue.conditions = issue.condtype.split(',').join(', ');

            geocoder.geocode({
                'address': issue.location
            }, function(results, status) {
                var lat = parseInt(results[0].geometry.location.lat());
                var lng = parseInt(results[0].geometry.location.lng());

                marker = new google.maps.Marker({
                    position: {
                        lat: lat,
                        lng: lng
                    },
                    map: map,
                    title: issue.name,
                    issue: issue
                });

                console.log(issue);

                google.maps.event.addListener(marker, 'click', (function(marker) {
                    var tempString  = '<h3><%= name %> <i>(<%= age %>)</i>: <%= time %></h3>';
                        tempString += '<p><strong>Issues:</strong> <%= issues %></p>';
                        tempString += '<p><strong>Condition:</strong> <%= conditions %></p>';
                        tempString += '<p><strong>Contact:</strong> <%= phone %></p>';
                    var template = _.template(tempString);

                    return function() {
                        infoWindow.setContent(template(issue));
                        infoWindow.open(map, marker);
                    }
                })(marker));

                markers.push(marker);
            });
        });

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
                console.log("Filter")

                for (var i = 0; i < markers.length; i += 1) {
                    var marker = markers[i];

                    marker.setVisible(false);

                    function filterMap(marker) {
                        return
                    }

                    if (_.intersection(filterMap(marker)).length > 0) {
                        marker.setVisible(true);
                    }
                }
            }, true);
        }
    ]).filter('capitalize', function() {
        return function(value) {
            return value.split(' ').map(function(word) {
                return word[0].toUpperCase() + word.slice(1);
            }).join(' ' );
        }
    });
