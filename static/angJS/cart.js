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
    $scope.msg = 'Items in cart';
    $scope.cart = JSON.parse(localStorage.getItem('cart'));
    if ($scope.cart == null) {
        $scope.cart = [];
        $scope.total = 0.0;
        $scope.numItems = 0;
    } else {
        $scope.numItems = $scope.cart.reduce((total, item) => total + item.quantity, 0);
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
        let index = $scope.cart.findIndex(x => x.name == item.name);
        if (item.quantity == 0) {
            //-1 means item is not in the cart
            localStorage.removeItem('cart');
            document.getElementById('total').innerHTML = '';
        } else {
            $scope.cart[index].quantity -= 1;
            $scope.cart[index].total -= $scope.cart[index].price;
            $scope.numItems -= 1;
            $scope.total = $scope.total - item.price;
            document.getElementById('total').innerHTML = '$' + $scope.total;
            localStorage.setItem('cart', JSON.stringify($scope.cart));
        }
    };

    $scope.clearCart = function() {
        $scope.cart.splice(0, $scope.numItems);
        $scope.numItems = 0;
        $scope.total = 0;
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

    $scope.placeOrder = function() {
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
    };
});
