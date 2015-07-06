var app=angular.module('myApp',[]);
app.controller('myCtrl',function($scope,$http) {



$http({
    url: 'http://localhost:1337/getFollowersList', 
    method: "GET"
 })
                    .success(function(data, status, headers, config) {
                    	console.log(data);
                    	if(data=='')
                    	{
                    		$http({
    url: 'http://localhost:1337/getFollowersList1', 
    method: "GET"
 })
                    .success(function(data, status, headers, config) {
                    	console.log(data);
                    	
                    	$scope.tweets=data;
                    });
                    	}
                    	else{
                    	$scope.tweets=data;
                    	}
                    });


});