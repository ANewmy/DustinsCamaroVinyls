//for admin to update the menu web page
var app=angular.module("menuApp", []);
app.controller('menuCtrl', function($scope,$http){
	
	$http({
	method: 'GET',
	url: '/store',

	//menu is to get the data from DB collection menu

	}).then(function successCallback(response) {
	$scope.menu=response.data
	$scope.msg = "Store"

	}, function errorCallback(response) {
	$scope.menu= []
	});


//whenever the web page is loaded, it will pull the data from menu in DB server

//second: update menu
$scope.updateStore=function(item){
		$http({
	method: 'POST',
	url: '/updateStore',
	data: item

	}).then(function successCallback(response) {
	$scope.msg="Updated!"

	}, function errorCallback(response) {
	$scope.msg="Server problem, try again later"
	});
}

$scope.addItem=function(){
		$http({
	method: 'POST',
	url: '/addItem',


	}).then(function successCallback(response) {
	$scope.msg="Updated!"

	}, function errorCallback(response) {
	$scope.msg="Server problem, try again later"
	});
}
}) //end of controller