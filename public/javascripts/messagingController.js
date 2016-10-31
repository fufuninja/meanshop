var app = angular.module('messagingController', ['angularMoment'])

app.controller('messagesController', ['$scope', '$http', 'getUserData', '$interval', '$timeout', '$window', '$location', function($scope, $http, getUserData, $interval, $timeout, $window, $location){
	getUserData.get()
		.success(function(data){
			$scope.cartItems = data.local; //an array of itemId
			$scope.userId = data._id;
			$scope.sell = data.local.sell;
		})
	$timeout(function() {
		var request = $scope.cartItems;
		$http.post('/api/viewCart', request).success(function(data){
			$scope.itemInCartList = data;
		})
	}, 100);

	$timeout(function() {
		var request = {
			userId: $scope.userId
		};
		$http.post('/api/getMessages', request).success(function(data){
				$scope.allMessagesToMe = data;
		})
	}, 100);

	$scope.openChat = function(messageId){
		$scope.hideMessagePopOut = false;
		$scope.messageId = messageId;

		var request = {
			messageId: messageId
		}

		$interval(function() {
			$http.post('/api/getMicroMessages', request).success(function(data){
				$scope.microMessages = data.content;
			})
		}, 250);
	}

	$scope.sendMicroMessage = function(test){
		$scope.test = "";
		var request = {
			messageId : $scope.messageId,
			messageOwnerId : $scope.userId,
			messages: test
		}

		$http.post('/api/addMicroMessages', request).success(function(data){
			$scope.microMessages = data.content;
		});

	}

	$scope.hideMessagePopOut = true;

	$scope.dismissMessagePopOut = function(){
		$scope.hideMessagePopOut = true;
		$window.location.reload()
	}

	$scope.confirmSell = function(itemId, myId, buyerId, messageId){
		var request = {
			itemId: itemId,
			myId: myId,
			buyerId: buyerId,
			messageId: messageId,
		};

		$http.post('/api/confirm', request);

		$window.location.reload();
	}

	$scope.decline = function(itemId, messageId, sellerId, myId){
		var request = {
			itemId: itemId,
			messageId: messageId,
			sellerId: sellerId,
			myId: myId
		}

		$http.post('/api/decline', request);

		$window.location.reload();

	}

	$scope.accept = function(itemId, messageId, sellerId, myId){
		var request = {
			itemId: itemId,
			messageId: messageId,
			sellerId: sellerId,
			myId: myId
		}

		$http.post('/api/accept', request);

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


	