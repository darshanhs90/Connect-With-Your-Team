var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $http) {
            $scope.latLng1 = 'aasd';
            $scope.latLng2 = 'aasd';


  var socket = io.connect('http://localhost:1337');
                socket.on('connection1', function(data) {
                console.log('connection');
                socket.emit('dashboard', {
                                my: 'asd'
                            });
                console.log('connection done');
                });
                socket.on('news', function(data) {
                console.log(data);
                updateArray(data)
                });

            function initialize() {
                var mapOptions = {
                    zoom: 4,
                    center: new google.maps.LatLng(-25.363882, 131.044922)
                };

                var map = new google.maps.Map(document.getElementById('mapper'),
                    mapOptions);

                var marker = new google.maps.Marker({
                    position: map.getCenter(),
                    map: map,
                    title: 'Click to zoom'
                });

                google.maps.event.addListener(map, 'center_changed', function() {
                    // 3 seconds after the center of the map has changed, pan back to the
                    // marker.
                    window.setTimeout(function() {
                        map.panTo(marker.getPosition());
                    }, 3000);
                });
                google.maps.event.addListener(map, 'click', function(e) {
                    console.log('clicked');
                    console.log(e);
                    placeMarker(e.latLng, map);
                    var bounds = map.getBounds();
                    var ne = bounds.getNorthEast(); // LatLng of the north-east corner
                    var sw = bounds.getSouthWest(); // LatLng of the south-west corder
                    // console.log(ne);
                    // console.log(sw);
                    updateLatLng(e.latLng);
                });

                google.maps.event.addListener(map, 'mousemove', function(e, x) {
                    //console.log('mouse moved  ');
                    //console.log(e);

                });
                google.maps.event.addListener(map, 'dblclick', function(e, x) {
                    console.log('double clicked  ');
                    console.log(e);

                });



                function placeMarker(position, map) {
                    marker.setMap(null);
                    marker = new google.maps.Marker({
                        position: position,
                        map: map
                    });
                    map.panTo(position);
                }


            }

            google.maps.event.addDomListener(window, 'load', initialize);

            function updateLatLng(latLng) {
                $scope.$apply(function() {
                    $scope.latLng = latLng;
                });
                
            };
            $scope.list = [];
            $scope.location='';

            function updateArray(newUser) {
                $scope.$apply(function() {
                    $scope.list.unshift(newUser);
                    if ($scope.list.length > 15)
                        $scope.list.pop();

                });
            };
            $scope.updatelatlng = function() {
                

                $http({
                    url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+$scope.latLng.A+','+$scope.latLng.F+'&key=AIzaSyDC0W6efefYTLBzGP1jGPJSOwGdmE9Z9x4',
                    method: "GET"
                }).success(function(data, status, headers, config) {
                        console.log(data);
                        $scope.location=data;
                        var length=$scope.location.results.length;
                        locn=($scope.location.results[length-1].formatted_address);
                    $http({
                    url: 'http://localhost:1337/updatelatlng',
                    method: "GET",
                    params:{
                        address:locn
                    }
                }).success(function(data, status, headers, config) {
                    console.log(data);
                });
                });
            }

            });