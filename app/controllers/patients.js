'use strict';

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
.controller('Patients', ['$scope', '$resource', '$location', function($scope, $resource, $location) {
	var Patients = $resource( '/patients', {},
		{
			'findAll' : {
				method: 'GET',
				isArray: true
			}
		});
	Patients.findAll().$promise.then(function(patientsList) {
		if(patientsList.err) {
			$location.path('/login');
		}
		$scope.patientsList = patientsList;
	});
}]);