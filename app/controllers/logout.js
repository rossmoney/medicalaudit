angular.module('myApp.logout', ['ngRoute', 'ngResource'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/logout', {
    templateUrl: 'views/logout.html',
    controller: 'Logout'
  });
}])
.factory('Sessions', ['$resource', function($resource) {
  return $resource( '/sessions/:_id', null,
    {
        'update': { method:'PUT' }
    });
}])
.controller('Logout', ['Sessions', '$resource', '$location', '$rootScope', '$cookieStore', '$http', 
	function(Sessions, $resource, $location, $rootScope, $cookieStore, $http) {
	
		// reset login status
		if($rootScope.globals.currentUser) Sessions.update({ _id: $rootScope.globals.currentUser.tokenid }, { expired: 'Y'});
		$rootScope.globals = {};
        $cookieStore.remove('globals');
        $http.defaults.headers.common.Authorization = 'Basic';
		$location.path('/login');
	
}]);