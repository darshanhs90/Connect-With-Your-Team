var app=angular.module('myApp',[]);
app.controller('myCtrl',function($scope,$http,$sce) {


$http({
    url: 'http://localhost:1337/timeline', 
    method: "GET"
 })
                    .success(function(data, status, headers, config) {
                    	console.log(data);
                    	$scope.tweets=data;
                    });

$scope.getNews=function($val){
	console.log($val);
	$http({
    url: 'http://localhost:1337/news', 
    method: "GET",
    params:{val:$val}
 })
                    .success(function(data, status, headers, config) {
                    	//console.log(data);
                    	$scope.news=data;

//get images
	$http({
    url: 'http://localhost:1337/images', 
    method: "GET"
 })
                    .success(function(data, status, headers, config) {

                    	//console.log(data);
                    	$scope.images=data;




                    	$http({
    url: 'http://localhost:1337/videos', 
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