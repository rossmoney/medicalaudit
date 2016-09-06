'use strict';

angular.module('myApp.users', ['ngResource', 'ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/users', {
    templateUrl: 'views/users.html',
    controller: 'Users'
  });
}])
.factory('Users', ['$resource', function($resource) {
  return $resource( '/users/:_id', null,
    {
        'update': { method:'PUT' }
    });
}])
.factory('UserService', ['$rootScope', '$location', function($rootScope, $location){
    return {
        removeUser: function(userIndex, scope){
			scope.user.$delete({action:"delete", _id:scope.user._id}, function() {
				scope.usersList.splice(userIndex, 1);
			});
            scope.$apply();
        }
    };
}])
.directive('ngRemoveUser', ['UserService', function(userService){
    return function(scope, element, attrs){
        angular.element(element.bind('click', function(){
            userService.removeUser(scope.$eval(attrs.ngRemoveUser), scope);  
        }));       
    };
}])
.controller('Users', ['$scope', 'Users', '$location', function($scope, users, $location) {
	$scope.usersList = users.query();
	
	$scope.addUser = function() {
		$location.path('/users/add');
	}
}]);