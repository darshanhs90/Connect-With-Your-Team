var app=angular.module('myApp',[]);
app.controller('myCtrl',function($scope,$http) {
$scope.trivia='';



$scope.triviapost=function(){

$http({
    url: 'http://fantweet.mybluemix.net/postUpdate', 
    method: "GET",
    params:{status:$scope.trivia}
 })
                    .success(function(data, status, headers, config) {
                    	console.log(data);
                    	
                    });

}

$scope.random=function(){

$http({
    url: 'http://fantweet.mybluemix.net/postUpdate', 
    method: "GET",
    params:{status:'When did I Debut'}
 })
                    .success(function(data, status, headers, config) {
                    	console.log(data);
                    	
                    });

}



$scope.getWinner=function(){
$http.get('http://fantweet.mybluemix.net/getWinner',{})
                    .success(function(data, status, headers, config) {
                    	console.log(data);
                    	$scope.winner=data;

                    });
}

$scope.getFollower=function(){
$http.get('http://fantweet.mybluemix.net/getFollowersList1',{})
                    .success(function(data, status, headers, config) {
                    	$scope.tempData=data;
                    	var x=parseInt(Math.random()*10);
                    	$scope.follower=data[x];

                    });
}

$scope.getRetweeter=function(){
$http.get('http://fantweet.mybluemix.net/getretweetWinner',{})
                    .success(function(data, status, headers, config) {
                    	console.log(data);
                    	$scope.retweeter=data;

                    });
}

$scope.getBest=function(){
$http.get('http://fantweet.mybluemix.net/getsentimentWinner',{})
                    .success(function(data, status, headers, config) {
                    	console.log(data);
                    	$scope.best=data;

                    });
}

$scope.getHelp=function(){
$http.get('http://fantweet.mybluemix.net/getrandomWinner',{})
                    .success(function(data, status, headers, config) {
                    	console.log(data);
                    	$scope.help=data;

                    });
}




});