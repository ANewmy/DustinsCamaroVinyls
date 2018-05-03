
var app=angular.module("customerApp",[]);
app.controller('customerCtrl', function($scope,$http){ 
    $scope.editingData = [];
    
    $http({
      method: 'GET',
      url: '/showCustomers'
  }).then(function successCallback(response) {
    $scope.customers=response.data
    for (var i = 0, length = $scope.customers.length; i < length; i++) {
      $scope.editingData[i] = false;
  }
}, function errorCallback(response) {
    $scope.customers=[]
});

  $scope.msg="Customers"
  $scope.edit = function(index){
    $scope.editingData[index] = true;
};


$scope.save = function(){
    for (var i = 0, length = $scope.customers.length; i < length; i++) {
      if( $scope.editingData[i])
        $scope.quantity=parseInt($scope.customers[i].quantity)
  }


  for (var i = 0, length = $scope.customers.length; i < length; i++) {
      $scope.editingData[i] = false;
  }
}   
})