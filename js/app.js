// Angular app

var rteDbApp = angular.module('rteDbApp', ['ngRoute']);

rteDbApp.config(['$routeProvider', function($routeProvider){
  $routeProvider
    .when('/', {
        controller: 'portsController',
        templateUrl: 'port-list-view.html'
      })
    .otherwise({redirectTo: '/'});
}]);

rteDbApp.controller('portsController', function ($scope) {
  $scope.ports = [{"name": "signalA"},{"name": "signalB"}];
  $scope.clicked = function(){
    alert('here man!');
  };
});