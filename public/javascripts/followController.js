var app = angular.module('followFriends', []);

app.controller('followController', ['$scope', '$http', 'getUserData', '$window', function($scope, $http, getUserData, $window){

	getUserData.get()
		.success(function(data){
			$scope.user = data;
		})

	$http.get('/api/follows').success(function(response){
		$scope.follows = response;
	})

	$scope.following = function (userId, followId){
		var request = {
			userId: userId,
			followId: followId
		}

		$http.post('/api/follows/get', request).then(function(){
			console.log("following ", followId);
		})
    		$window.location.reload();


	}

	$scope.unfollow = function(userId, followId){
		var request = {
			userId: userId,
			followId: followId
		}

		$http.post('/api/unfollows/get', request).then(function(){
			console.log("unfollowed ", followId);
		})
    		$window.location.reload();
	}

	$scope.checkIsFollowing = function(followId){
		for( var i =0, len = $scope.user.local.following.length; i<len; i++){
			if($scope.user.local.following[i].userId === followId){
				return true;
			}
		}
	}

}])



app.factory('getUserData', ['$http', function($http){
	return{
		get : function(){
			return $http.get('/api/user');
		}
	}
}])