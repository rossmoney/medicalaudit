'use strict';

angular.module('myApp.thankyou', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/thankyou', {
    templateUrl: 'views/thankyou.html',
    controller: 'thankyou'
  });
}])

.controller('thankyou', [function() {

}]);