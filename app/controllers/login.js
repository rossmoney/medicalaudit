
    'use strict';
 
    angular
        .module('myApp.login', ['ngRoute', 'ngCookies'])
		.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'views/login.html',
    controller: 'LoginController'
  });
}])
.controller('LoginController', ['$location', 'Users', '$rootScope', '$cookieStore', '$http', '$scope', 
	function($location, Users, $rootScope, $cookieStore, $http, $scope) {
 
        // reset login status
		$rootScope.globals = {};
        $cookieStore.remove('globals');
        $http.defaults.headers.common.Authorization = 'Basic';
 
        $scope.login = function() {
			    $scope.users = Users.query(function() {
					
					$scope.found = false;
			angular.forEach($scope.users, function(user,key) {
				if(user.username == $scope.vm.username && md5($scope.vm.password) == user.password) {
				var authdata = md5(user.username + ':' + user.password);
				$rootScope.globals = {
					currentUser: {
						username: user.username,
						authdata: authdata
					}
				};
 
				$http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
				$cookieStore.put('globals', $rootScope.globals);
				$location.path('/patients');
				$scope.found = true;
				}
			});
			
			if(!$scope.found) {
				$scope.vm.username = 'Invalid Login!';
			}
				});
			    
        };
    }
 ]);