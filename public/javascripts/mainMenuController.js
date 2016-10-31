var app = angular.module('mainMenuController', ['angularMoment'])

app.controller('mainMenuControl', ['$scope', '$rootScope', '$http', 'getUserData', '$interval', '$timeout', '$window', '$location', function($scope, $rootScope, $http, getUserData, $interval, $timeout, $window, $location){

    getUserData.get()
		.success(function(data){
			$scope.userID = data._id;
			$scope.imageURL = data.facebook.image;
			$scope.username = data.facebook.name;
			$scope.about = data.local.bio;
			$scope.following = data.local.following;
			$scope.cart = data.local.cart;
			$scope.user = data;
			$scope.cartItems = data.local; //an array of itemId
	});

	$scope.addToCart = function(itemId){
		var request = {
			userId: $scope.userID,
			itemId: itemId
		}

		$http.post('/api/addToCart', request);
		alert('Added to your cart.');
    	$window.location.reload();
	}

	$scope.checkIsAdded = function(itemId){
		for(var i = 0, len = $scope.cart.length; i < len; i++){
			if($scope.cart[i].itemId === itemId){
				return true;
			}
		}
	}

	function getList(initial){
		$http.post('/api/listAll').success(function(response){
			if(initial){
				$scope.list = response;
				$scope.items = angular.copy($scope.list);
			}
			else{
				if(response.length > $scope.list.length){
					$scope.incomingListAll = response;
				}
			}
		})
	}

	$interval(function(){
		getList(false);
		if($scope.incomingListAll){
			$scope.difference = $scope.incomingListAll.length - $scope.list.length;
		}
	}, 30000)

	$scope.setNewListAll = function(){
		$scope.list = angular.copy($scope.incomingListAll);
		$scope.incomingListAll = undefined;
	}

	$scope.getItemFromSearch = function(itemId){
		$scope.searchString = undefined;
		$scope.showSearchRecommends = false;

		var request = {
			itemId: itemId
		}
		$http.post('/api/listAll', request).success(function(data){
			$scope.list = data;
		})
	}
	$timeout(function() {
		getList(true)
		var request = $scope.cartItems;
		$http.post('/api/viewCart', request).success(function(data){
			$scope.itemInCartList = data;
		})
	}, 100);

	$scope.onFocusDropdown = function(){
		if($scope.searchString.length > 0){
			$scope.showSearchRecommends = true;
		}
		else if ($scope.searchString.length === 0){
			$scope.showSearchRecommends = false;
		}
	}

	$scope.reloadToViewAll = function(){
    	$window.location.reload();
	}

	$scope.showNumberOfItems = 16;

	$scope.showMore = function(){
		$scope.showNumberOfItems += 16;
	}
}])

app.factory('getUserData', ['$http', function($http){
	return{
		get : function(){
			return $http.get('/api/user');
		}
	}
}])

app.filter('searchFor', function(){
    return function(arr, searchString){
        if(!searchString){
            return arr;
        }
        var result = [];
        searchString = searchString.toLowerCase();
        angular.forEach(arr, function(item){
            if(item.itemName.toLowerCase().indexOf(searchString) !== -1){
            result.push(item);
        }
        });
        return result;
    };
});