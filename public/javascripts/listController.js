var app = angular.module('listItemSection', ['angularMoment', 'ngFileUpload'])

app.controller('listController', ['$scope', '$http', 'getUserData', '$interval', '$timeout', 'Upload', '$window', function($scope, $http, getUserData, $interval, $timeout, Upload, $window){

    getUserData.get()
		.success(function(data){
			$scope.userID = data._id;
			$scope.imageURL = data.facebook.image;
			$scope.username = data.facebook.name;
			$scope.about = data.local.bio;
			$scope.following = data.local.following;
			$scope.user = data;
            $scope.cartItems = data.local; //an array of itemId
	});
    
    $scope.upload = function (file, userId) {
        if (file){
            Upload.upload({
                url: 'api/profile/uploadImage',
                method: 'POST',
                data: {userId: userId},
                file: file
            }).progress(function(evt) {
               console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
               $scope.progressBar = parseInt(100.0 * evt.loaded / evt.total);
             }).success(function(data){
            	//this is not functinoning.
            }).error(function(error){
                console.log(error);
            })
        }
    };

    $scope.deleteItem = function(id){
    	$http.delete('/api/item/delete/' + id).success(function(res){
    		$scope.list = res;
    	})

    	$window.location.reload();
    }

    $timeout(function() {
        var request = $scope.cartItems;
        $http.post('/api/viewCart', request).success(function(data){
            $scope.itemInCartList = data;
        })
    }, 100);

	$scope.addItem = function(){
		var request = {
			userId: $scope.userID,
			user: $scope.username,
			itemImage: $scope.itemImage,
			itemName : $scope.item.name,
			itemDescription: $scope.item.description,
			itemQuantity: $scope.item.quantity,
			itemPrice: $scope.item.price,
			sentOnce : [{userId: "Initiated"}]
		}

		$http.post('/api/addItem', request).success(function(response){
			$scope.list = response;
   		    $window.location.reload();
		}).error(function(error){
			console.error(error);
		})

	}

	function getList(initial){
		var request = {
			userId: $scope.userID
		}
		$http.post('/api/getAllItem', request).success(function(response){
			if(initial){
				$scope.list = response;
			}
			else{
				if(response.length > $scope.list.length){
					$scope.incomingList = response;
				}
			}
		})
	}

	$interval(function(){
		getList(false);
		if($scope.incomingList){
			$scope.difference = $scope.incomingList.length - $scope.list.length;
		}
	}, 30000)

	$scope.setNewList = function(){
		$scope.list = angular.copy($scope.incomingList);
		$scope.incomingList = undefined;
	}

	$timeout(function() {
		getList(true)
	}, 100);

}])

app.factory('getUserData', ['$http', function($http){
	return{
		get : function(){
			return $http.get('/api/user');
		}
	}
}])