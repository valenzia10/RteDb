// Angular app

var rteDbApp = angular.module('rteDbApp', []);

rteDbApp.controller('portsController', function ($scope) {
  $scope.ports = [{"name": "signalA"},{"name": "signalB"}];
  $scope.clicked = function(){
    alert('here man!');
  };
});