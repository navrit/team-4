require('js-marker-clusterer');

var _                   = require('lodash');
var angular             = require('angular');
var GoogleMapsLoader    = require('google-maps');
var io                  = require('socket.io-client');
var socket              = io.connect('http://localhost:8080');

GoogleMapsLoader.KEY = 'AIzaSyCt6tCRKgtUG7sCLGvW2ot8AeGju7JeX_k';
GoogleMapsLoader.SENSOR = false;

var issues;
var map;
var filters;
var markers = [];
var marker, position;

Date.prototype.niceDate = function() {
   var yyyy = this.getFullYear().toString();
   var mm = (this.getMonth() + 1).toString();
   var dd  = this.getDate().toString();
   return (dd[1]?dd:"0"+dd[0]) + '/' + (mm[1]?mm:"0"+mm[0])  + '/' + yyyy;
};

function displayPoints(data) {
    markers.forEach(function(marker) {
        marker.setVisible(false);
    });

    JSON.parse(data).forEach(function(issue) {
        issue.time = new Date(issue.time).niceDate();
        issue.conditions = issue.condtype.split(',').join(', ');

        GoogleMapsLoader.load(function(google) {
            var geocoder    = new google.maps.Geocoder;
            var infoWindow  = new google.maps.InfoWindow();

            if (issue.location.split(',').length > 1 && !isNaN(parseFloat(issue.location.split(',')[0]))) {
                marker = new google.maps.Marker({
                    position: {
                        lat: parseFloat(issue.location.split(',')[0]),
                        lng: parseFloat(issue.location.split(',')[1])
                    },
                    map: map,
                    title: issue.name,
                    issue: issue
                });

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
            } else {
                geocoder.geocode({
                    'address': issue.location
                }, function(results, status) {
                    if (results) {

                        var lat = parseFloat(results[0].geometry.location.lat());
                        var lng = parseFloat(results[0].geometry.location.lng());

                        marker = new google.maps.Marker({
                            position: {
                                lat: lat,
                                lng: lng
                            },
                            map: map,
                            title: issue.name,
                            issue: issue
                        });

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
                        var issues = marker.issue.issues;

                        values = [];

                        if (filters.education) {
                            values.push(/school/g);
                            values.push(/assistence/g);
                            values.push(/learn/g);
                        }

                        if (filters.economics) {
                            values.push(/growth/g);
                            values.push(/money/g);
                            values.push(/work/g);
                        }

                        if (filters.education && filters.economics) {
                            marker.setVisible(true);
                        } else {
                            var tests = values.map(function(value) {
                                return issues.match(value)
                            }).map(function(result) {
                                return result !== null;
                            }).filter(function(truth) {
                                return truth;
                            });

                            if (tests.length > 0) {
                                marker.setVisible(true);
                            } else {
                                marker.setVisible(false);
                            }
                        }
                    }
                });
            }
        });
    });
}

socket.on('data', function (data) {
    issues = data;
    GoogleMapsLoader.load(function(google) {
        var geocoder = new google.maps.Geocoder;

        map = new google.maps.Map(document.getElementById('map'), {
            center: {
                lat: 23.51033,
                lng: 90.24176
            },
            zoom: 3
        });

        displayPoints(data);

        var mc = new MarkerClusterer(map, markers, {
            gridSize: 50,
            maxZoom: 10
        });
    });
});

var app = angular.module('add', [])
    .controller('controller', [
        '$scope',
        function($scope) {
            $scope.filters = {
                'education': true,
                'economics': true,
                'social': true,
                'green cities': true,
                'monitoring': true
            };

            $scope.goals = Object.keys($scope.filters);

            $scope.$watch(function() {
                return $scope.filters;
            }, function(newVal) {
                filters = $scope.filters;

                for (var i = 0; i < markers.length; i += 1) {
                    var marker = markers[i];
                    var issues = marker.issue.issues;

                    values = [];

                    if (filters.education) {
                        values.push(/school/g);
                        values.push(/assistence/g);
                        values.push(/learn/g);
                    }

                    if (filters.economics) {
                        values.push(/growth/g);
                        values.push(/money/g);
                        values.push(/work/g);
                    }

                    if (filters.education && filters.economics) {
                        marker.setVisible(true);
                    } else {
                        var tests = values.map(function(value) {
                            return issues.match(value)
                        }).map(function(result) {
                            return result !== null;
                        }).filter(function(truth) {
                            return truth;
                        });

                        if (tests.length > 0) {
                            marker.setVisible(true);
                        } else {
                            marker.setVisible(false);
                        }
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
