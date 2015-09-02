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
    var port_list = port_data;
      
    portObjectService.ports = port_list;
    
    portObjectService.add = function(n,p){
      port_list[n] = p;
    };
    
    portObjectService.get = function(n){
      return port_list[n];
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
  // Populate <select> options
  $scope.types = basic_types; 
  $scope.providers = arch_modules;
  $scope.sig_types = signal_types;
  
  // Check if editing an existing port to populate fields with port current info
  if($routeParams.portName){
    var port_to_edit = portObject.get($routeParams.portName);
    
    $scope.portName = port_to_edit.name;
    $scope.portProvider = port_to_edit.provider; 
    $scope.portType = port_to_edit.data_type;
    $scope.portInit = port_to_edit.initial;
    $scope.portUnit = port_to_edit.unit;
    $scope.portRes = port_to_edit.resolution;
    $scope.portOffs = port_to_edit.offset;
    $scope.portSigType = port_to_edit.signal_type;
    
    if(port_to_edit.signal_type === 'Rx' || port_to_edit.signal_type === 'Tx'){
      $scope.portCanSignal = port_to_edit.can_signal;
      $scope.portCanRes = port_to_edit.can_resolution;
      $scope.portCanOffs = port_to_edit.can_offset;
    }
  }else{
    // Provide some typical defaults to user
    $scope.portType = 'BOOL';
    $scope.portInit = '0';
    $scope.portRes = '1';
    $scope.portOffs = '0';
    $scope.portSigType = 'Internal';
  }
  
  $scope.save = function(){
    var port_to_add = {
          "name": $scope.portName,
          "provider": $scope.portProvider
        };
        
    portObject.add($scope.portName, port_to_add);        
    window.history.back();
  };
  
  $scope.cancel = function(){
    window.history.back();
  };
});