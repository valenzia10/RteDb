// Angular app
var rteDbApp = angular.module('rteDbApp', ['ngRoute']);

// Configuration
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


// Services
rteDbApp.factory('portObject', function() {
    var ports = {
      "signalA":{
                    "name": "signalA",
                    "provider": "InjectorStrategy"
                },
      "signalB":{
                    "name": "signalB",
                    "provider": "PumpingStrategy"
                  }
      };

    return ports;
});


// Controllers
rteDbApp.controller('portsController', function($scope, portObject){
  $scope.ports = portObject;
  $scope.clicked = function(){
    window.location.href = window.location.href + 'port-info';
  };
});

rteDbApp.controller('portInfoController', function($scope, portObject){
  $scope.save = function(){
    portObject[$scope.portName] = 
        {
          "name": $scope.portName,
          "provider": $scope.portProvider
        };
        
    window.history.back();
  };
  
  $scope.cancel = function(){
    window.history.back();
  };
});