var app=angular.module('myApp',[]);
app.controller('myCtrl',function($scope,$http,$sce) {


$http({
    url: 'http://fantweet.mybluemix.net/timeline', 
    method: "GET"
 })
                    .success(function(data, status, headers, config) {
                    	console.log(data);
                    	$scope.tweets=data;
                    });

$scope.getNews=function($val){
	console.log($val);
	$http({
    url: 'http://fantweet.mybluemix.net/news', 
    method: "GET",
    params:{val:$val}
 })
                    .success(function(data, status, headers, config) {
                    	//console.log(data);
                    	$scope.news=data;

//get images
	$http({
    url: 'http://fantweet.mybluemix.net/images', 
    method: "GET"
 })
                    .success(function(data, status, headers, config) {

                    	//console.log(data);
                    	$scope.images=data;




                    	$http({
    url: 'http://fantweet.mybluemix.net/videos', 
    method: "GET"
 })
                    .success(function(data, status, headers, config) {

                    	console.log(data);
                    	

                    	$scope.videos=data;




                    });



                    });



                    });
}


});