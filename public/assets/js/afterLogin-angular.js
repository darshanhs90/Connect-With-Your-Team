var app=angular.module('myApp',[]);
app.controller('myCtrl',function($scope,$http) {
$scope.list=[];
$scope.suggestions='';
$http.get('http://fantweet.mybluemix.net/getSuggestions',{})
                    .success(function(data, status, headers, config) {

                    	$scope.suggestions=data;

                    });








var socket = io.connect('http://fantweet.mybluemix.net');
socket.on('connection1',function(data){
console.log('connection');
socket.emit('dashboard',{my:'asd'});
console.log('connection done');
  });

  socket.on('news', function(data) {
  	console.log(data);
  updateArray(data)
  //socket.emit('disconnect',{hello:'lol'});
  

  });
function updateArray(newUser){
  $scope.$apply(function() { $scope.list.unshift(newUser); 
  	 if($scope.list.length>15)
  	$scope.list.pop();

  });
 
};


});