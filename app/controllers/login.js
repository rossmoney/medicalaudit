
    'use strict';
 
    angular
        .module('myApp.login', ['ngRoute', 'ngCookies'])
		.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'views/login.html',
    controller: 'LoginController'
  });
}])
.factory('Sessions', ['$resource', function($resource) {
  return $resource( '/sessions/:_id', null,
    {
        'update': { method:'PUT' }
    });
}])
.controller('LoginController', ['$location', 'Users', 'Sessions', '$rootScope', '$cookieStore', '$http', '$scope', 
	function($location, Users, Sessions, $rootScope, $cookieStore, $http, $scope) {
 
        // reset login status
		if($rootScope.globals.currentUser) Sessions.update({ _id: $rootScope.globals.currentUser.tokenid }, { expired: 'Y'});
		$rootScope.globals = {};
        $cookieStore.remove('globals');
        $http.defaults.headers.common.Authorization = 'Basic';
 
        $scope.login = function() {
			    $scope.users = Users.query(function() {
					
					$scope.found = false;
			angular.forEach($scope.users, function(user,key) {
				if(user.username == $scope.vm.username && md5($scope.vm.password) == user.password) {

				var d = new Date() ;
				d.setTime( d.getTime() - new Date().getTimezoneOffset()*60*1000 );

				$scope.session = {
					username : $scope.vm.username,
					logindate: d,
					expired: 'N'
				}
				
				Sessions.save($scope.session, function(session) {
					var authdata = md5(user.username + ':' + user.password);
					$rootScope.globals = {
						currentUser: {
							username: user.username,
							authdata: authdata,
							tokenid: session._id,
						}
					};
 
					$http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
					$cookieStore.put('globals', $rootScope.globals);
					$location.path('/patients');
					$scope.found = true;
				});
				
				}
			});
			
			if(!$scope.found) {
				$scope.vm.username = 'Invalid Login!';
			}
				});
			    
        };
    }
 ]);