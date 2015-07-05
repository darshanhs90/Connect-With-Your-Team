var app=angular.module('myApp',[]);
app.controller('myCtrl',function($scope,$http) {



$scope.login=function(){
	alert('login');
$http({
    url: 'http://localhost:1337/auth/twitter', 
    method: "GET"
 }).success(function(data, status, headers, config) {
 	var res=(data);
 	console.log(res);
 	window.location.replace(res);
	});

};


$scope.authorize=function(){
	alert('login');
	if($scope.code!=''){
$http({
    url: 'http://localhost:1337/auth/twitter/callback', 
    method: "GET",
    params:{code:$scope.code}
 }).success(function(data, status, headers, config) {
 	var res=(data);
 	console.log(res);
 	if(res=='Authentication Successful'){
	 	window.location.replace('./afterLogin.html');
	 	}
	else{
		alert('Authentication failure');
	}
	});
 }

};







});