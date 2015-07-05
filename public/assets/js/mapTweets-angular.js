var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $http) {
    $scope.latLng1 = 'aasd';
    $scope.latLng2 = 'aasd';

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
            console.log(ne);
            console.log(sw);
            updateLatLng(ne, sw);
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

    function updateLatLng(latLng1, latLng2) {
        $scope.$apply(function() {
            $scope.latLng1 = latLng1;
        });
        $scope.$apply(function() {
            $scope.latLng2 = latLng2;
        });
    };
//create io connection
//emit with latlng to get tweets specific to location



});