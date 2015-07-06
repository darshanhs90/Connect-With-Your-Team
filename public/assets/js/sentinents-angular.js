var app=angular.module('myApp',[]);
app.controller('myCtrl',function($scope,$http) {
	$scope.location='No Location chosen';
    $scope.locationid='No Location chosen';
    
jQuery(document).ready(function() {
                $('h2').each(function(){
                    console.log(this.id);
                    $(this).click(function(){
                        console.log(this.id);
                        $('.tab-selected').removeClass('tab-selected');
                        $(this).addClass('tab-selected');
                        $('.map').css('z-index', '0');
                        $('#vmap-'+this.id).parent().css('z-index', '1');
                    });
                });
                $('h2:first').addClass('tab-selected');
                $('.map:first').css('z-index', '1');
                $('#vmap-asia').click(function(event){
                    console.log(event.toElement.id);
                    updateLocation(event.toElement.id);
                });
                jQuery('#vmap-asia').vectorMap({
                    map: 'asia_en',
                    backgroundColor: '#333333',
                    color: '#ffffff',
                    hoverOpacity: 0.7,
                    selectedColor: '#666666',
                    enableZoom: true,
                    showTooltip: true,
                    values: sample_data,
                    scaleColors: ['#C8EEFF', '#006491'],
                    normalizeFunction: 'polynomial'
                });
                $('#vmap-europe').click(function(event){
                    console.log(event.toElement.id);
                    updateLocation(event.toElement.id);
                });
                jQuery('#vmap-europe').vectorMap({
                    map: 'europe_en',
                    backgroundColor: '#333333',
                    color: '#ffffff',
                    hoverOpacity: 0.7,
                    selectedColor: '#666666',
                    enableZoom: true,
                    showTooltip: true,
                    values: sample_data,
                    scaleColors: ['#C8EEFF', '#006491'],
                    normalizeFunction: 'polynomial'
                });
                $('#vmap-australia').click(function(event){
                    console.log(event.toElement.id);
                    updateLocation(event.toElement.id);
                });
                jQuery('#vmap-australia').vectorMap({
                    map: 'australia_en',
                    backgroundColor: '#333333',
                    color: '#ffffff',
                    hoverOpacity: 0.7,
                    selectedColor: '#666666',
                    enableZoom: true,
                    showTooltip: true,
                    values: sample_data,
                    scaleColors: ['#C8EEFF', '#006491'],
                    normalizeFunction: 'polynomial'
                });
                $('#vmap-africa').click(function(event){
                    console.log(event.toElement.id);
                    updateLocation(event.toElement.id);
                });
                jQuery('#vmap-africa').vectorMap({
                    map: 'africa_en',
                    backgroundColor: '#333333',
                    color: '#ffffff',
                    hoverOpacity: 0.7,
                    selectedColor: '#666666',
                    enableZoom: true,
                    showTooltip: true,
                    values: sample_data,
                    scaleColors: ['#C8EEFF', '#006491'],
                    normalizeFunction: 'polynomial'
                });
                $('#vmap-northamerica').click(function(event){
                    console.log(event.toElement.id);
                    updateLocation(event.toElement.id);
                });
                jQuery('#vmap-northamerica').vectorMap({
                    map: 'north-america_en',
                    backgroundColor: '#333333',
                    color: '#ffffff',
                    hoverOpacity: 0.7,
                    selectedColor: '#666666',
                    enableZoom: true,
                    showTooltip: true,
                    values: sample_data,
                    scaleColors: ['#C8EEFF', '#006491'],
                    normalizeFunction: 'polynomial'
                });
                $('#vmap-southamerica').click(function(event){
                    console.log(event.toElement.id);
                    updateLocation(event.toElement.id);
                });
                jQuery('#vmap-southamerica').vectorMap({
                    map: 'south-america_en',
                    backgroundColor: '#333333',
                    color: '#ffffff',
                    hoverOpacity: 0.7,
                    selectedColor: '#666666',
                    enableZoom: true,
                    showTooltip: true,
                    values: sample_data,
                    scaleColors: ['#C8EEFF', '#006491'],
                    normalizeFunction: 'polynomial'
                });

            });
var current_code='in';
 function updateLocation(location) {
        $scope.$apply(function() {

            $scope.location = location.toString().split("_")[1];
            current_code=$scope.location;
            if($scope.location=='in')
                $scope.location='india';
            if($scope.location=='cn')
                $scope.location='china';
            if($scope.location=='ca')
                $scope.location='canada';
            $http({
                    url: 'https://maps.googleapis.com/maps/api/geocode/json?address='+$scope.location+'&key=AIzaSyDC0W6efefYTLBzGP1jGPJSOwGdmE9Z9x4',
                    method: "GET"
                }).success(function(data, status, headers, config) {
                    console.log(data);
                    $scope.location=data.results[0].address_components[0].long_name;
                    });
            $scope.locationid=location;
            current_code
        });

    };

    $scope.getScore=function(){
        $http({
                    url: 'http://localhost:1337/getScore',
                    method: "GET",
                    params:{address:$scope.location},
                }).success(function(data, status, headers, config) {
                    $scope.score=data.score;
                    console.log(data.score);
                    console.log(current_code);
                    if($scope.score>5){
                        $("#jqvmap1_"+current_code).attr("fill", "green");
                        $("#jqvmap2_"+current_code).attr("fill", "green");
                        $("#jqvmap3_"+current_code).attr("fill", "green");
                        $("#jqvmap4_"+current_code).attr("fill", "green");
                        $("#jqvmap5_"+current_code).attr("fill", "green");
                        $("#jqvmap6_"+current_code).attr("fill", "green");
                        
                        }
                    else{
                        $("#jqvmap1_"+current_code).attr("fill", "red");
                        $("#jqvmap2_"+current_code).attr("fill", "red");
                        $("#jqvmap3_"+current_code).attr("fill", "red");
                        $("#jqvmap4_"+current_code).attr("fill", "red");
                        $("#jqvmap5_"+current_code).attr("fill", "red");
                        $("#jqvmap6_"+current_code).attr("fill", "red");
                        }
                });

    };


});