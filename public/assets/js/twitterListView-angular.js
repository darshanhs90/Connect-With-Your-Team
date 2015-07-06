var app=angular.module('myApp',[]);
app.controller('myCtrl',function($scope,$http) {



$http({
    url: 'http://fantweet.mybluemix.net/getFollowersList', 
    method: "GET"
 })
                    .success(function(data, status, headers, config) {
                    	console.log(data);
                    	if(data=='')
                    	{
                    		$http({
    url: 'http://fantweet.mybluemix.net/getFollowersList1', 
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