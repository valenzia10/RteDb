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
    var port_list = {};
      
    portObjectService.ports = function(){
      return port_list;
    };
    
    portObjectService.populateFromJson = function(s){
      port_list = eval('('+s+')');
    };
    
    portObjectService.add = function(n,p){
      port_list[n] = p;
    };
    
    portObjectService.get = function(n){
      return port_list[n];
    };
    
    portObjectService.delete = function(n){
      delete port_list[n];
    };
    
    portObjectService.exists = function(n){
      if(n in port_list){
        return true;
      }else{
        return false;
      }
    };
    
    portObjectService.generateFiles = function(){
      var db_file = "";
      var h_file = "";
      var c_file = "";
      
      // Open DB file
      db_file += '{\n';
      
      // Open header file
      h_file += '#ifndef _FICORTE_H_\n';
      h_file += '#define _FICORTE_H_\n\n';
       h_file += '#include "Global.h"\n';
      h_file += '#include "Rte_DeclareMacro.h"\n\n';
      
      // Open source file
      c_file += '#include "FicoRte.h"\n';
      c_file += '#include "Rte_DefineMacro.h"\n\n';
      
      for(var p in port_list){
        // Generate db entry
        db_file += '"'+ p + '":\n';
        db_file += "    {\n";
        for(var d in port_list[p]){
          db_file += '    "'+ d + '": "' + port_list[p][d] +'",\n';
        }
        db_file += '    },\n';
        
        // Generate header file entry
        h_file += 'DECLARE_PORT(' + port_list[p].data_type + ', ' + port_list[p].name  + ')\n';
        
        // Generate source file entry
        switch(port_list[p].signal_type){
          case 'Internal':
            c_file += 'DEFINE_PORT(' +  port_list[p].data_type + ', ' + port_list[p].name  
                      + ', ' + port_list[p].initial + ', INTERNAL_SIGNAL, 0)\n';
            break;
            
          case 'Rx':
          case 'Tx':
            var macro_to_use = '';
            var conversion_to_use = '';
            
            // Chceck whether converion is needed
            if(port_list[p].resolution != port_list[p].can_resolution
               || port_list[p].offset != port_list[p].can_offset){
              macro_to_use = 'DEFINE_CONVERTED_PORT(';
              
              var total_res = port_list[p].can_resolution / port_list[p].resolution;
              var total_offs = (port_list[p].can_offset - port_list[p].offset)
                               / port_list[p].resolution;
              
              conversion_to_use = ', ' + total_res + ', ' + total_offs + ', FL_32, '
                                  + 't_sig_' + port_list[p].can_signal.toLowerCase();
              
            }else{
              macro_to_use = 'DEFINE_PORT(';
              conversion_to_use = '';
            }
            
            c_file += macro_to_use +  port_list[p].data_type + ', ' + port_list[p].name  
                    + ', ' + port_list[p].initial;
                    
            if(port_list[p].signal_type === 'Tx'){
              c_file += ', TX_SIGNAL, ';
            }else{
              c_file += ', RX_SIGNAL, ';
            }
            
            c_file += 'SIG_' +  port_list[p].can_signal.toUpperCase()
                      + conversion_to_use + ')\n';
            break;
            
          case 'Stub':
            c_file += 'DEFINE_STUBBED_PORT(' +  port_list[p].data_type + ', ' + port_list[p].name  
                      + ', ' + port_list[p].initial + ')\n';
            break;
            
          default:
            break;
        }
      }
        // Close db file
        db_file += '}';
        
        // Close h file
        h_file += '\n#endif';
        
        return [db_file, h_file, c_file];
    }

    return portObjectService;
});


// Directives
rteDbApp.directive('customOnChange', function() {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var onChangeHandler = scope.$eval(attrs.customOnChange);
      element.bind('change', onChangeHandler);
    }
  };
});

// Controllers
rteDbApp.controller('portsController', function($scope, portObject){
  $scope.ports = portObject.ports();
  
  $scope.importJson = function(event){
        var files = event.target.files;
        var reader = new FileReader();

				reader.onload = function(e) {
					portObject.populateFromJson(reader.result);
          $scope.$apply(function(){
            $scope.ports = portObject.ports();
          });
				}
        reader.readAsText(files[0]);
    };
  
  $scope.clicked = function(n){
    if(n){
      window.location.href = window.location.href + 'port-info/' + n;
    }else{
      window.location.href = window.location.href + 'port-info';
    }
  };
  
  $scope.remove = function(n){
    alert('You are going to delete port ' + n);
    portObject.delete(n);
  };
  
  $scope.generate = function(){
    // Open new windows with files content
    window.open('data:text/plain;charset=utf-8,' + encodeURIComponent(portObject.generateFiles()[0]));
    window.open('data:text/plain;charset=utf-8,' + encodeURIComponent(portObject.generateFiles()[1]));
    window.open('data:text/plain;charset=utf-8,' + encodeURIComponent(portObject.generateFiles()[2]));
  };
});

rteDbApp.controller('portInfoController', function($scope, $routeParams, portObject){
  var port_old_name = null;
  
  // Populate <select> options
  $scope.types = basic_types; 
  $scope.providers = arch_modules;
  $scope.sig_types = signal_types;
  
  // Check if editing an existing port to populate fields with port current info
  if($routeParams.portName){
    var port_to_edit = portObject.get($routeParams.portName);
    
    // Store current port name to detect and process a name change when saving info
    port_old_name = port_to_edit.name;
    
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
    // If port already exists, alert and do nothing
    if( (!port_old_name  || port_old_name !== $scope.portName)
        && portObject.exists($scope.portName) ){
      alert('This port name already exists, please choose a different one.')
      return;
    }
    
    // If new port or edit of existing one, construct port object
    var port_to_add = {
          "name": $scope.portName,
          "provider": $scope.portProvider,
          "data_type": $scope.portType,
          "initial": $scope.portInit,
          "unit": $scope.portUnit,
          "resolution": $scope.portRes,
          "offset": $scope.portOffs,
          "signal_type": $scope.portSigType
        };
    
    if(port_to_add.signal_type === 'Rx' || port_to_add.signal_type === 'Tx'){
      port_to_add.can_signal = $scope.portCanSignal,
      port_to_add.can_resolution = $scope.portCanRes,
      port_to_add.can_offset = $scope.portCanOffs
    }
        
    portObject.add($scope.portName, port_to_add);
    
    // If name changed, removed legacy port object info
    if(port_old_name && port_old_name !== port_to_add.name){
      portObject.delete(port_old_name);  
    }
         
    window.history.back();
  };
  
  $scope.cancel = function(){
    window.history.back();
  };
});