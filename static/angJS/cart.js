var total = 0;
var app = angular.module('cartApp', []);
app.controller('cartCtrl', function($scope, $http, $window) {
    $http({
        method: 'GET',
        url: '/store',
    }).then(
        function successCallback(response) {
            $scope.vinyls = response.data;
        },
        function errorCallback(response) {
            $scope.vinyls = [];
        },
    );

    $scope.email = '';

    $scope.cart = JSON.parse(localStorage.getItem('cart'));
    if ($scope.cart == null) {
        $scope.cart = [];
        $scope.total = 0.0;
        $scope.numItems = 0;
        $scope.msg = 'Cart is empty.';
    } else {
        $scope.numItems = $scope.cart.reduce((total, item) => total + item.quantity, 0);
        $scope.msg = 'Items in cart ' + $scope.numItems;
    }

    $scope.addToCart = function(item) {
        let index = $scope.cart.findIndex(x => x.vinylName == item.vinylName);
        if (index == -1) {
            item.quantity = 1;
            $scope.cart.push(item);
        } else $scope.cart[index].quantity += 1;

        $scope.numItems += 1;
        localStorage.setItem('cart', JSON.stringify($scope.cart));
    };

    $scope.removeFromCart = function(item) {
        let index = $scope.cart.findIndex(x => x.vinylName == item.vinylName);
        if ($scope.numItems == 0) {
            document.getElementById('total').innerHTML = '$0.00';
        }
        if ($scope.cart[index].quantity == 0) {
            //-1 means item is not in the cart
            localStorage.removeItem('cart');
        } else {
            $scope.cart[index].quantity -= 1;
            $scope.cart[index].total -= $scope.cart[index].price.toFixed(2);
            $scope.numItems -= 1;
            $scope.total = $scope.total.toFixed(2) - $scope.cart[index].price.toFixed(2);
            document.getElementById('total').innerHTML = '$' + $scope.total.toFixed(2);
            $scope.msg = 'Items in cart ' + $scope.numItems;
            localStorage.setItem('cart', JSON.stringify($scope.cart));
        }
    };

    $scope.clearCart = function() {
        $scope.cart.splice(0, $scope.numItems);
        $scope.numItems = 0;
        $scope.total = 0;
        document.getElementById('total').innerHTML = '$' + $scope.total.toFixed(2);
        localStorage.clear();
    };

    $scope.calcTotalPrice = function() {
        for (var i in $scope.cart) {
            if ($scope.cart[i].quantity > 1) {
                total += $scope.cart[i].price * $scope.cart[i].quantity;
            } else total += $scope.cart[i].price;
        }

        $scope.total = total;
        document.getElementById('total').innerHTML = '$' + total;
    };

    $scope.checkout = function() {
        $window.location.href = 'checkout.html';
    };

    $scope.getEmail = function() {
        $http({
            method: 'GET',
            url: '/getEmail',
        }).then(
            function successCallback(response) {
                //$scope.msg = 'Your order has been recieved!';
                console.log('respones: ', response);
                $scope.email = response.email;
            },
            function errorCallback(response) {
                $scope.msg = 'Server is not available, try again later.';
            },
        );
    };

    $scope.placeOrder = function() {
        if ($scope.numItems == 0) {
            $scope.msg = 'Add items to your cart in order to place an order!';
        } else {
            var checkoutData = [];

            checkoutData.push($scope.cart);
            checkoutData.push([{ customerID: $scope.email }]);

            $http({
                method: 'POST',
                url: '/placeOrder',
                data: checkoutData,
            }).then(
                function successCallback(response) {
                    $scope.msg = 'Your order has been recieved!';
                    $scope.clearCart();
                },
                function errorCallback(response) {
                    $scope.msg = 'Server is not available, try again later.';
                },
            );
        }
    };
});
