var app = angular.module('cartController', ['angularMoment'])

app.controller('myCartControl', ['$scope', '$rootScope', '$http', 'getUserData', '$interval', '$timeout', '$window', '$location', function($scope, $rootScope, $http, getUserData, $interval, $timeout, $window, $location){

	getUserData.get()
		.success(function(data){
			$scope.cartItems = data.local; //an array of itemId
			$scope.userId = data._id;
		})

	$timeout(function() {
		var request = $scope.cartItems;
		$http.post('/api/viewCart', request).success(function(data){
			$scope.itemInCartList = data;
		})
	}, 100);

	$scope.findIndexByKeyValue = function(obj, value){
	    for (var i = 0; i < obj.length; i++) {
	        if (obj[i].userId == value) {
	            return true;
	        }
	    }
	    return false;
	}

	$scope.removeFromCart = function(itemId, userId){
		var request = {
			userId: $scope.userId,
			itemId: itemId,
			sellerId: userId
		}
		$http.post('/api/removeFromCart', request);
		$window.location.reload();
	}

	$scope.hideMessagePopOut = true;

	$scope.dismissMessagePopOut = function(){
		$scope.hideMessagePopOut = true;
	}

	$scope.messageSeller = function(sellerId, itemId, itemName, itemImage){
		$scope.itemId = itemId;
		$scope.sellerId = sellerId;
		$scope.itemName = itemName;
		$scope.itemImage = itemImage;
		$scope.hideMessagePopOut = false;
	}

	$scope.content = "Hi there!, I'm interested with this item. Checking if it is still available.";

	$scope.range = function(min, max, step) {
	    step = step || 1;
	    var input = [];
	    for (var i = min; i < max; i += step) {
	        input.push(i);
	    }
	    return input;
	};

	$scope.confirmSend = function(){
		var request = {
			sellerId: $scope.sellerId,
			userId: $scope.userId,
			itemId: $scope.itemId,
			itemName: $scope.itemName, 
			itemImage: $scope.itemImage,
			content: [{messageOwnerId: $scope.userId, messages: $scope.content}]	
		}

		$http.post('/api/messages', request).success(function(data){
			console.log("success send");
		});

		var request2 = {
			itemId: $scope.itemId,
			userId: $scope.userId
		}

		$http.post('/api/avoidDuplicateMessages', request2);

		$scope.hideMessagePopOut = true;
		alert("Your message has been sent to the seller.");
		$window.location.reload();
	}
}])

app.factory('getUserData', ['$http', function($http){
	return{
		get : function(){
			return $http.get('/api/user');
		}
	}
}])

app.filter('contains', function() {
  return function (array, needle) {
    return array.indexOf(needle) >= 0;
  };
});