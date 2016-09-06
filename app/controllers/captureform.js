'use strict';

angular.module('myApp.captureform', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/captureform', {
    templateUrl: 'views/captureform.html',
    controller: 'CaptureForm'
  });
}])

.controller('CaptureForm', ['$scope', 'Patients', '$location', '$rootScope', '$cookieStore', '$http', 
	function($scope, Patients, $location, $rootScope, $cookieStore, $http) {
	
// reset login status
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
	$scope.patient.anonid = $scope.patient.whereseen[0] + $scope.patient.refrecieved.getFullYear() + 
		$scope.patient.refrecieved.getDate() + $scope.patient.refrecieved.getMonth() + 
		$scope.patient.whereseen[$scope.patient.whereseen.length - 1];
    Patients.save($scope.patient, function() {
		$location.path('/thankyou');
    });
};

}]);