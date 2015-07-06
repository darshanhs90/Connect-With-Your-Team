var app=angular.module('myApp',[]);
app.controller('myCtrl',function($scope,$http) {

$scope.txt1='Ask for Help Here';
$scope.txt2='Ask a Qn Here';
$scope.gethelp=function(){
var text=$scope.txt1;
text="#twitter"+' '+"help"+' '+text;
$http({
                    url: 'http://fantweet.mybluemix.net/postUpdate',
                    method: "GET",
                    params:{
                        status:text
                    }
                }).success(function(data, status, headers, config) {
                    console.log(data);
                });
};

$scope.getquestion=function(){
var text=$scope.txt2;
text="#twitter"+' '+"question"+' '+text;
$http({
                    url: 'http://fantweet.mybluemix.net/postUpdate',
                    method: "GET",
                    params:{
                        status:text
                    }
                }).success(function(data, status, headers, config) {
                    console.log(data);
                });

};

});