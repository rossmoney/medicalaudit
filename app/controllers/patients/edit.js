'use strict';

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
	var d1 = moment($scope.patient.refrecieved);
	var d2 = moment($scope.patient.scanundertaken);
	$scope.patient.numdaystaken = Math.floor(moment.duration(d2.diff(d1)).asDays());
	if($scope.patient.numdaystaken <= 3) {
		$scope.patient.withinnationaltarget = 'Y';
	} else {
		$scope.patient.withinnationaltarget = 'N';
	}
	
	if(typeof($scope.patient.dob) != Date) {
		$scope.patient.dob = new Date($scope.patient.dob);
	}
	
	$scope.patient.anonid = $scope.patient.initials[0] + $scope.patient.dob.getFullYear() + 
		("0" + $scope.patient.dob.getDate()).slice(-2) + ("0" + ($scope.patient.dob.getMonth() + 1)).slice(-2) + 
		$scope.patient.initials[1];
		
	var editData = {
            anonid : $scope.patient.anonid, 
            refrecieved: $scope.patient.refrecieved,
			scanundertaken: $scope.patient.scanundertaken,
			numdaystaken: $scope.patient.numdaystaken,
			withinnationaltarget: $scope.patient.withinnationaltarget,
			reasonfordelay: $scope.patient.reasonfordelay,
			abnormaloutcome: $scope.patient.abnormaloutcome,
			chdtype: $scope.patient.chdtype,
			whereseen: $scope.patient.whereseen,
			dateseen: $scope.patient.dateseen    
        };
		
	$resource( '/patients/:_id', {}, {
        'update': { method:'POST',
					params: { _id: $scope.patient._id },
					isArray: false
		}
	}).update($scope.patient).$promise.then(function() {
		$location.path('/patients');
	});
};

$scope.cancelEditPatient = function() {
    $location.path('/patients');
};

}]);