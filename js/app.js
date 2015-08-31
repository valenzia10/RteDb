// Angular app
var rteDbApp = angular.module('rteDbApp', ['ngRoute']);

// Configuration
rteDbApp.config(['$routeProvider', function($routeProvider){
  $routeProvider
    .when('/', {
        controller: 'portsController',
        templateUrl: 'port-list-view.html'
      })
    .when('/port-info/:portName', {
        controller: 'portInfoController',
        templateUrl: 'port-info-view.html'
      })
    .when('/port-info', {
      controller: 'portInfoController',
      templateUrl: 'port-info-view.html'
    })
    .otherwise({redirectTo: '/'});
}]);


// Services
rteDbApp.factory('portObject', function() {
    var portObjectService = {};
    
    portObjectService.ports = {
      "signalA":{
                    "name": "signalA",
                    "provider": "InjectorStrategy"
                },
      "signalB":{
                    "name": "signalB",
                    "provider": "PumpingStrategy"
                  }
      };

    return portObjectService;
});


// Controllers
rteDbApp.controller('portsController', function($scope, portObject){
  $scope.ports = portObject.ports;
  $scope.clicked = function(n){
    if(n){
      window.location.href = window.location.href + 'port-info/' + n;
    }else{
      window.location.href = window.location.href + 'port-info';
    }
  };
});

rteDbApp.controller('portInfoController', function($scope, $routeParams, portObject){
  alert($routeParams.portName);
  
  $scope.save = function(){
    portObject.ports[$scope.portName] = 
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