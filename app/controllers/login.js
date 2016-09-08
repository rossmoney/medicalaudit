
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
.controller('LoginController', ['$location', 'Users', 'Sessions', '$rootScope', '$cookieStore', '$http', '$scope', '$resource',
	function($location, Users, Sessions, $rootScope, $cookieStore, $http, $scope, $resource) {
 
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
				
				var d1 = moment(user.passwordlastreset);
				var d2 = moment(d);
				var daydiff = Math.floor(moment.duration(d2.diff(d1)).asDays());
				console.log(daydiff);
				if(daydiff > 30 && user.username != 'admin') {
					var editData = {
						password: 'Expired'
					};
					$resource( '/users/' + user._id , {}, {
						'update': { method:'PUT',
						isArray: false
					}
					}).update(editData).$promise.then(function() {
						$scope.vm.username = 'Invalid Login!';
						alert('Your password has been in use for 30 days and has now expired. Please contact the system admin for a new one.');
						$location.path('/login');
					});
				} else {
				
				$scope.session = {
					username : $scope.vm.username,
					logindate: d,
					expired: 'N'
				}
				
				Sessions.save($scope.session, function(session) {
					$scope.sessionid = session._id;
					$rootScope.globals = {
						currentUser: {
							username: user.username,
							tokenid: session._id
						}
					};
 
					$http.defaults.headers.common['Authorization'] = $scope.sessionid; // jshint ignore:line
					$cookieStore.put('globals', $rootScope.globals);
					$scope.vm.username = 'Please wait, you will be redirected shortly...';
					$location.path('/patients');
					$scope.found = true;
				});
				
				}
				}
			});
			
			if(!$scope.found) {
				$scope.vm.username = 'Invalid Login!';
			}
				});
			    
        };
    }
 ]);