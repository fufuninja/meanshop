var app = angular.module('microMessagingController', ['angularMoment'])

app.controller('microMessagesController', ['$scope', '$http', 'getUserData', '$interval', '$timeout', '$window', '$location', function($scope, $http, getUserData, $interval, $timeout, $window, $location){
	getUserData.get()
		.success(function(data){
			$scope.cartItems = data.local; //an array of itemId
			$scope.userId = data._id;
		})
	
	$timeout(function() {
		var request = {
			userId: $scope.userId
		};
		$http.post('/api/getMessages', request).success(function(data){
				$scope.allMessagesToMe = data;
		})
	}, 500);

}])


app.factory('getUserData', ['$http', function($http){
	return{
		get : function(){
			return $http.get('/api/user');
		}
	}
}])


	