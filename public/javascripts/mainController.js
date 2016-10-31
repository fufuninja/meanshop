var app = angular.module('socialNetwork', ['ngFileUpload']);

app.controller('editProfileController', [ 'getUserData', '$scope', 'Upload', '$http', '$window', '$timeout', function(getUserData, $scope, Upload, $http, $window, $timeout){


    getUserData.get()
		.success(function(data){
			$scope.userID = data._id;
			$scope.imageURL = data.facebook.image;
			$scope.username = data.facebook.name;
			$scope.about = data.local.bio;
            $scope.cartItems = data.local; //an array of itemId
	})

    $scope.$watch(function(){
        return $scope.file
    }, function (){
       $scope.upload($scope.file); 
    });
                    
    
                    
    $scope.upload = function (file) {
        if (file){
            Upload.upload({
                url: 'api/profile/editPhoto',
                method: 'POST',
                data: {userId: $scope.userID},
                file: file
            }).progress(function(evt) {
               console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
               $scope.progressBar = parseInt(100.0 * evt.loaded / evt.total);
             }).success(function(data){
            	//this is not functinoning.
            }).error(function(error){
                console.log("you got it here" , error);
            })
        }
    };

    $timeout(function() {
        var request = $scope.cartItems;
        $http.post('/api/viewCart', request).success(function(data){
            $scope.itemInCartList = data;
        })
    }, 1000);

    $scope.updateBio = function(){

    	var request = {
    		userId: $scope.userID,
    		bio: $scope.user.bio
    	}

    	$http.post('api/profile/updateBio', request).success(function(){
    		$window.location.reload();
    	}).error(function(error){
    		console.log(error);
    	})

    };
		
}])

app.factory('getUserData', ['$http', function($http){
	return{
		get : function(){
			return $http.get('/api/user');
		}
	}
}])


app.directive('parseStyle', function($interpolate) {
    return function(scope, elem) {
        var exp = $interpolate(elem.html()),
            watchFunc = function () { return exp(scope); };
        
        scope.$watch(watchFunc, function (html) {
            elem.html(html);
        });
    };
})

