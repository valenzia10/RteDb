// Angular app

var rteDbApp = angular.module('rteDbApp', ['ngRoute']);

rteDbApp.config(['$routeProvider', function($routeProvider, $locationProvider){
  $routeProvider
    .when('/', {
        controller: 'portsController',
        templateUrl: 'port-list-view.html'
      })
    .otherwise({redirectTo: '/'});
    
    // use the HTML5 History API
    $locationProvider.html5Mode(true);
}]);

rteDbApp.controller('portsController', function ($scope) {
  $scope.ports = [{"name": "signalA"},{"name": "signalB"}];
  $scope.clicked = function(){
    //window.location.href = window.location.href + 'p';
  };
});