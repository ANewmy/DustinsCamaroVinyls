var app=angular.module("registerApp",[]);
app.controller('registerCtrl', function($scope,$http){ 
    
    $http({
      method: 'GET',
      url: '/registerCustomer'
  }).then(function successCallback(response) {
  }
}, function errorCallback(response) {
    $scope.customers=[]
});
  $scope.email=""
  $scope.pwd=""

$scope.createUser=function(){
    var checkoutData=[]

    checkoutData.push([{email:$scope.email,pwd:$scope.pwd}])

    $http({
  method: 'POST',
  url: '/registerCustomer',
  data:checkoutData
}).then(function successCallback(response) {
    $scope.msg="You are now a registered user!"
  }, function errorCallback(response) {
    $scope.msg="Server is not available, try again later."
  });
}
}


$scope.save = function(){
    for (var i = 0, length = $scope.customers.length; i < length; i++) {
      if( $scope.editingData[i])
        $scope.quantity=parseInt($scope.customers[i].quantity)
  }
  $http({
      method: 'POST',
      url: '/saveCustomer',
      data:$scope.customers
  }).then(function successCallback(response) {

    $scope.msg="Saved!"

}, function errorCallback(response) {
    $scope.msg="Sorry, server problem, try again!"
});