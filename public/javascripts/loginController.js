var app = angular.module('loginController', [])

app.controller('loginController', ['$scope', '$http', '$interval', '$location', '$window', function($scope, $http, $interval, $location, $window){

$scope.$on('$locationChangeStart', function(event, next, current){            
    // Here you can take the control and call your own functions:
    event.preventDefault();            
});

}])
