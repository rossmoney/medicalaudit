'use strict';

angular.module('myApp.captureform', ['ngRoute', 'ngResource'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/captureform', {
    templateUrl: 'views/captureform.html',
    controller: 'CaptureForm'
  });
}])
.factory('Sessions', ['$resource', function($resource) {
  return $resource( '/sessions/:_id', null,
    {
        'update': { method:'PUT' }
    });
}])
.controller('CaptureForm', ['$scope', 'Sessions', '$resource', '$location', '$rootScope', '$cookieStore', '$http', 
	function($scope, Sessions, $resource, $location, $rootScope, $cookieStore, $http) {
	
// reset login status
		if($rootScope.globals.currentUser) Sessions.update({ _id: $rootScope.globals.currentUser.tokenid }, { expired: 'Y'});
		$rootScope.globals = {};
        $cookieStore.remove('globals');
        $http.defaults.headers.common.Authorization = 'Basic';

$scope.checkDates = function() {
	var d1 = moment($scope.patient.refrecieved);
	var d2 = moment($scope.patient.scanundertaken);
	$scope.patient.numdaystaken = Math.floor(moment.duration(d2.diff(d1)).asDays());
	if($scope.patient.numdaystaken < 0 && !isNaN($scope.patient.scanundertaken)) {
		delete $scope.patient.scanundertaken;
		alert('Scan undertaken date must be after the referral recieved date.');
		return;
	}
	var d2 = moment($scope.patient.refrecieved);
	var d1 = moment($scope.patient.scanundertaken);
	$scope.patient.numdaystaken = Math.floor(moment.duration(d2.diff(d1)).asDays());
	if($scope.patient.numdaystaken > 0 && !isNaN($scope.patient.scanundertaken)) {
		delete $scope.patient.refrecieved;
		alert('Referral recieved date must be before the scan undertaken date.');
	}
};

$scope.addPatient = function() {
	var Patients = $resource( '/patients', {},
		{
			'add' : {
				method: 'POST',
				isArray: false
			}
		});
	if($scope.patient.abnormaloutcome) {
		$scope.patient.abnormaloutcome = 'Y';
	} else {
		$scope.patient.abnormaloutcome = 'N';
	}
	var d1 = moment($scope.patient.refrecieved);
	var d2 = moment($scope.patient.scanundertaken);
	$scope.patient.numdaystaken = Math.floor(moment.duration(d2.diff(d1)).asDays());
	if($scope.patient.numdaystaken <= 3) {
		$scope.patient.withinnationaltarget = 'Y';
	} else {
		$scope.patient.withinnationaltarget = 'N';
	}
	$scope.patient.anonid = $scope.patient.initials[0] + $scope.patient.dob.getFullYear() + 
		("0" + $scope.patient.dob.getDate()).slice(-2) + ("0" + ($scope.patient.dob.getMonth() + 1)).slice(-2) + 
		$scope.patient.initials[1];
    Patients.add($scope.patient, function() {
		$location.path('/thankyou');
    });
};

}]);