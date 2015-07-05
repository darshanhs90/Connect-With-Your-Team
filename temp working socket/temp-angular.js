var app=angular.module('myApp',[]);
app.controller('myCtrl',function($scope) {
	$scope.list=[];

var socket = io.connect('http://localhost:1337');
  socket.on('news', function(data) {
  	console.log(data);
  updateArray(data)
  socket.emit('disconnect',{hello:'lol'});
  
  });
function updateArray(newUser){
  $scope.$apply(function() { $scope.list.push(newUser); });
  // if($scope.list.length>10)
  // {
  // 	socket.disconnect();
  // }
};





});
