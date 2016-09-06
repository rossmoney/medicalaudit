'use strict';

angular.module('myApp.AddUsers', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/users/add', {
    templateUrl: 'views/users/add.html',
    controller: 'AddUsers'
  });
}])

.controller('AddUsers', ['$scope', 'Users', '$location', function($scope, Users, $location) {

$scope.addUser = function() {
	$scope.user.password = md5($scope.user.password);
    Users.save($scope.user, function() {
		$location.path('/users');
    });
};

$scope.cancelAddUser = function() {
	$location.path('users');
};

}]);