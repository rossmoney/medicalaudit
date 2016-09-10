'use strict';

function dateDifference(start, end) {

  // Copy date objects so don't modify originals
  var s = new Date(+start);
  var e = new Date(+end);

  // Set time to midday to avoid dalight saving and browser quirks
  s.setHours(12,0,0,0);
  e.setHours(12,0,0,0);

  // Get the difference in whole days
  var totalDays = Math.round((e - s) / 8.64e7);

  // Get the difference in whole weeks
  var wholeWeeks = totalDays / 7 | 0;

  // Estimate business days as number of whole weeks * 5
  var days = wholeWeeks * 5;

  // If not even number of weeks, calc remaining weekend days
  if (totalDays % 7) {
    s.setDate(s.getDate() + wholeWeeks * 7);

    while (s < e) {
      s.setDate(s.getDate() + 1);

      // If day isn't a Sunday or Saturday, add to business days
      if (s.getDay() != 0 && s.getDay() != 6) {
        ++days;
      }
    }
  }
  return days;
};

angular.module('myApp.captureform', ['ngRoute', 'ngResource'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/captureform', {
    templateUrl: 'views/captureform.html',
    controller: 'CaptureForm'
  });
}])
.controller('CaptureForm', ['$scope', '$resource', '$location', '$rootScope', 
	function($scope, $resource, $location, $rootScope) {

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
		return;
	}
	var d1 = $scope.patient.refrecieved;
	  var d2 = $scope.patient.scanundertaken;
	  $scope.patient.numdaystaken = dateDifference(new Date(d1), new Date(d2));
	  if($scope.patient.numdaystaken <= 3) {
		$('#reasonfordelay_container').hide();
	  } else {
		$('#reasonfordelay_container').show();
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
	
	if($scope.patient.gestationalagedays == undefined) $scope.patient.gestationalagedays = '0';

	$scope.patient.anonid = $scope.patient.initials[0] + $scope.patient.dob.getFullYear() + 
		("0" + $scope.patient.dob.getDate()).slice(-2) + ("0" + ($scope.patient.dob.getMonth() + 1)).slice(-2) + 
		$scope.patient.initials[1];
		
	if($rootScope.globals.currentUser) {
		$scope.patient.addedby = $rootScope.globals.currentUser.username;
	} else {
		$scope.patient.addedby = 'Form User';
	} 
    Patients.add($scope.patient, function() {
		$location.path('/thankyou');
    });
};

}]);