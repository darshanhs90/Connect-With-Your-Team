var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $http) {
    $scope.lat = 'No Latitude chosen';
    $scope.lng = 'No Longitude chosen';
            $http({
                    url: 'http://fantweet.mybluemix.net/getFollowersList1',
                    method: "GET"
                }).success(function(data, status, headers, config) {
                    console.log(data);
                    $scope.followersList=data;

                });



        var bounds = [
            [35.98245136, -112.26379395],
            [36.13343831, -112.10998535]
        ];
        var earth = new WE.map('earth_div');
        earth.setView([36.057944835, 112.18688965], 1);
        var osm = WE.tileLayer('http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpg', {
            attribution: 'Tiles Courtesy of MapQuest'
        }).addTo(earth);

        var grandcanyon = WE.tileLayer('http://tileserver.maptiler.com/grandcanyon/{z}/{x}/{y}.png', {
            bounds: bounds,
            minZoom: 10,
            maxZoom: 16
        });
        grandcanyon.addTo(earth);
        earth.panInsideBounds(bounds);
        var showInfo = function(e) {
            console.log(e.latitude + ', ' + e.longitude);
            updateLatLng(e.latitude,e.longitude);
        }
        earth.on('click', showInfo);
  
    function updateLatLng(lat, lng) {
        $scope.$apply(function() {
            $scope.lat = lat;
        });
        $scope.$apply(function() {
            $scope.lng = lng;
        });
    };
    $scope.location='No Location Chosen';
    $scope.getFollowers=function(){

                $http({                                                                                         
                    url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+$scope.lat+','+$scope.lng.F+'&key=AIzaSyDWUnMGxYQzaDMTJSkH8btb4oJnLVGo178',
                    method: "GET"
                }).success(function(data, status, headers, config) {
                        console.log(data);
                        if(data.status=="OK"){
                        $scope.location=data;
                        var length=$scope.location.results.length;
                        locn=($scope.location.results[length-1].formatted_address);
                        console.log('after');
                        }
                    $http({
                    url: 'http://fantweet.mybluemix.net/twitter/followers',
                    method: "GET",
                    params:{
                        address:$scope.location
                    }
                }).success(function(data, status, headers, config) {
                    console.log(data);
                    setTimeout(function(){
                    $http({
                    url: 'http://fantweet.mybluemix.net/getFollowersList',
                    method: "GET"
                }).success(function(data, status, headers, config) {
                    console.log(data);
                    $scope.followersList=data;
                });

                    },1000);


                });
                });


    }
});