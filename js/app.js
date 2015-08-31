// Angular app

var rteDbApp = angular.module('rteDbApp', ['ngRoute']);

rteDbApp.config(['$routeProvider', function($routeProvider){
  $routeProvider
    .when('/', {
        controller: 'portsController',
        templateUrl: 'port-list-view.html'
      })
    .when('/port-info', {
        controller: 'portInfoController',
        templateUrl: 'port-info-view.html'
      })
    .otherwise({redirectTo: '/'});
}]);

rteDbApp.controller('portsController', function($scope,$rootScope){
  $rootScope.ports = [
    {
      "name": "signalA",
      "provider": "InjectorStrategy"
     },
     {
       "name": "signalB",
       "provider": "PumpingStrategy"
     }];
  $scope.clicked = function(){
    window.location.href = window.location.href + 'port-info';
  };
});

rteDbApp.controller('portInfoController', function($scope){
  $scope.save = function(){
    alert(JSON.stringify($scope.ports));
    window.history.back();
  };
  
  $scope.cancel = function(){
    window.history.back();
  };
});