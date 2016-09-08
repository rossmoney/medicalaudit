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

angular.module('myApp.patients', ['ngResource', 'ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/patients', {
    templateUrl: 'views/patients.html',
    controller: 'Patients'
  });
}])
.factory('PatientService', ['$rootScope', '$location', '$resource', function($rootScope, $location, $resource){
    return {
        removePatient: function(patientIndex, scope){
			var Patients = $resource( '/patients/:id', {},
			{
			'delete' : {
				method: 'DELETE',
				isArray: false
			}
			}).delete({id:scope.patient._id}, function() {
				scope.patientsList.splice(patientIndex, 1);
			});
            scope.$apply();
        },
		editPatient: function(patientIndex, scope, $location){
			$location.path('/patients/edit/' + scope.patient._id);
			$rootScope.$apply();
        },
		revealDoB: function(patientIndex, scope, $location){
			var firstin = scope.patient.anonid[0],
			    lastin = scope.patient.anonid[scope.patient.anonid.length - 1],
				dob = scope.patient.anonid.slice(0, -1).slice(1, scope.patient.anonid.length - 1);
			
			dob = dob.slice(4, 6) + '/' + dob.slice(6, 8) + '/' + dob.slice(0, 4);
			alert('First Initial: ' + firstin + '\n' + 'Last Initial: ' + lastin + '\n' + 'DoB: ' + dob);
		}
    };
}])
.directive('ngRemovePatient', ['PatientService', function(patientService){
    return function(scope, element, attrs){
        angular.element(element.bind('click', function(){
            patientService.removePatient(scope.$eval(attrs.ngRemovePatient), scope);  
        }));       
    };
}])
.directive('ngEditPatient', ['PatientService', '$location', function(patientService, $location){
    return function(scope, element, attrs){
        angular.element(element.bind('click', function(){
            patientService.editPatient(scope.$eval(attrs.ngEditPatient), scope, $location);  
        }));       
    };
}])
.directive('ngRevealDob', ['PatientService', '$location', function(patientService, $location){
    return function(scope, element, attrs){
        angular.element(element.bind('click', function(){
            patientService.revealDoB(scope.$eval(attrs.ngRevealDob), scope, $location);  
        }));       
    };
}])
.filter('dataFilter', function(){
  return function(input){
    angular.forEach(input, function(patient){
	  var d1 = patient.refrecieved;
	  var d2 = patient.scanundertaken;
	  patient.numdaystaken = dateDifference(new Date(d1), new Date(d2));
	  if(patient.numdaystaken <= 3) {
		patient.withinnationaltarget = 'Y';
	  } else {
		patient.withinnationaltarget = 'N';
	  }
	  if(!patient.addedby) {
		  patient.addedby = 'Form User';
	  }
    })
    return input;
  }
})
.controller('Patients', ['$scope', '$resource', '$location', function($scope, $resource, $location) {
	var Patients = $resource( '/patients', {},
		{
			'findAll' : {
				method: 'GET',
				isArray: true
			}
		});
	Patients.findAll().$promise.then(function(patientsList) {
		if(patientsList[0].err) {
			$location.path('/login');
		}
		$scope.patientsList = patientsList;
	});
}]);