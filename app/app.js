'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.logout',
  'myApp.login',
  'myApp.patients',
  'myApp.EditPatients',
  'myApp.captureform',
  'myApp.thankyou',
  'myApp.users',
  'myApp.AddUsers',
  'myApp.version',
  'ui.bootstrap.datetimepicker'
])
.factory('httpRequestInterceptor', '$rootScope', '$location', function ($rootScope, $location) {
  return {
    request: function (config) {

      config.headers['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.tokenid;
	  config.headers['Page'] = $location.path();
      config.headers['Accept'] = 'application/json;odata=verbose';

      return config;
    }
  };
})
.config(['$locationProvider', '$routeProvider', '$httpProvider', '$resourceProvider', function($locationProvider, $routeProvider, $httpProvider, $resourceProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/captureform'});

  $httpProvider.defaults.useXDomain = true;
  $httpProvider.defaults.withCredentials = false;
  delete $httpProvider.defaults.headers.common["X-Requested-With"];
  $httpProvider.defaults.headers.common["Accept"] = "application/json";
  $httpProvider.defaults.headers.common["Content-Type"] = "application/json";
  
  // Don't strip trailing slashes from calculated URLs
  $resourceProvider.defaults.stripTrailingSlashes = false;
}])
.factory('Sessions', ['$resource', function($resource) {
  return $resource( '/sessions/:_id', null,
    {
        'update': { method:'PUT' }
    });
}])
.run(['$rootScope', '$location', '$cookieStore', '$http', 'Sessions', '$resource', function ($rootScope, $location, $cookieStore, $http, Sessions, $resource) {
        $rootScope.globals = $cookieStore.get('globals') || {};
		
		$http.defaults.headers.common['Page'] = $location.path();
		if($location.path() == '') {
			$location.path('/captureform');
		}
		
		// keep user logged in after page refresh
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = $rootScope.globals.currentUser.tokenid; // jshint ignore:line
        }
 
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
			
			var nomenuPage = $.inArray($location.path(), [ '/login', '/logout']) > -1;
			if(nomenuPage) {
				$('.menu').hide();
			} else {
				$('.menu').show();
			}
			
			var restrictedPage = $.inArray($location.path(), ['/captureform', '/thankyou']) === -1;
			
			if(restrictedPage && $rootScope.globals.currentUser) {
				$resource('/sessions/:_id', { _id: $rootScope.globals.currentUser.tokenid}).get(function(result) {
				var givenTime = moment(result.logindate);
				var d = new Date() ;
				d.setTime( d.getTime() - new Date().getTimezoneOffset()*60*1000 );
				var minutesPassed = moment(d).diff(givenTime, "minutes");
				
				if(result._id == $rootScope.globals.currentUser.tokenid && minutesPassed > 15) {
					Sessions.update({ _id: $rootScope.globals.currentUser.tokenid }, { expired: 'Y'});
					$rootScope.globals = {};
					$cookieStore.remove('globals');
					$http.defaults.headers.common.Authorization = 'Basic';
					$location.path('/login');
				}
				});
			}
			
            // redirect to login page if not logged in and trying to access a restricted page
            
            var loggedIn = $rootScope.globals.currentUser;
            if (restrictedPage && !loggedIn) {
                $location.path('/login');
            }
        });
    }
]);