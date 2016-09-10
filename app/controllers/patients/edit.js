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

angular.module('myApp.EditPatients', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/patients/edit/:id', {
    templateUrl: 'views/patients/edit.html',
    controller: 'EditPatients'
  });
}])
.controller('EditPatients', ['$rootScope', '$scope', '$resource', '$location', '$routeParams', '$http', 
	function($rootScope, $scope, $resource, $location, $routeParams, $http) {
	
    $scope.activePath = null;    
	
	$resource( '/patients/:_id', {}, {
        'findById': { method:'GET',
					params: { _id: $routeParams.id },
					isArray: false
		}
	}).findById().$promise.then(function(data) {
        $scope.patient = data;  
		$scope.oriPatient = angular.copy($scope.patient);
		
		$scope.patient.initials = $scope.patient.anonid[0] +  $scope.patient.anonid[$scope.patient.anonid.length - 1];
		var dob = $scope.patient.anonid.slice(0, -1).slice(1, $scope.patient.anonid.length - 1);
			
		$scope.patient.dob = dob.slice(0, 4) + '/' + dob.slice(6, 8) + '/' + dob.slice(4, 6);
		$scope.patient.dob = new Date($scope.patient.dob);
		
		if($scope.patient.abnormaloutcome == 'Y') {
			$scope.patient.abnormaloutcome = true;
			$('#chdtype_container').show();
		} else {
			$scope.patient.abnormaloutcome = false;
		}
		
	  var d1 = $scope.patient.refrecieved;
	  var d2 = $scope.patient.scanundertaken;
	  $scope.patient.numdaystaken = dateDifference(new Date(d1), new Date(d2));
	  if($scope.patient.numdaystaken <= 3) {
		$('#reasonfordelay_container').hide();
	  } else {
		$('#reasonfordelay_container').show();
	  }
    }); 
	

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

$scope.resetForm = function () {
    $scope.patient = angular.copy($scope.oriPatient);
};

$scope.editPatient = function() {
	if($scope.patient.abnormaloutcome) {
		$scope.patient.abnormaloutcome = 'Y';
	} else {
		$scope.patient.abnormaloutcome = 'N';
	}
	
	if(typeof($scope.patient.dob) != Date) {
		$scope.patient.dob = new Date($scope.patient.dob);
	}
	
	$scope.patient.anonid = $scope.patient.initials[0] + $scope.patient.dob.getFullYear() + 
		("0" + $scope.patient.dob.getDate()).slice(-2) + ("0" + ($scope.patient.dob.getMonth() + 1)).slice(-2) + 
		$scope.patient.initials[1];
		
	if($scope.patient.gestationalagedays == '') {
		$scope.patient.gestationalagedays = '0';
	}
		
	var editData = {
            anonid : $scope.patient.anonid, 
            refrecieved: $scope.patient.refrecieved,
			scanundertaken: $scope.patient.scanundertaken,
			reasonfordelay: $scope.patient.reasonfordelay,
			abnormaloutcome: $scope.patient.abnormaloutcome,
			chdtype: $scope.patient.chdtype,
			whereseen: $scope.patient.whereseen,
			gestationalageweeks: $scope.patient.gestationalageweeks,
			gestationalagedays: $scope.patient.gestationalagedays
        };
		
	$resource( '/patients/' + $scope.patient._id , { _id: $scope.patient._id }, {
        'update': { method:'PUT',
					isArray: false
		}
	}).update(editData).$promise.then(function() {
		$location.path('/patients');
	});
};

$scope.cancelEditPatient = function() {
    $location.path('/patients');
};

}]);