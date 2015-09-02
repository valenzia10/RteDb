var basic_types = ['BOOL', 'UI_8', 'UI_16', 'UI_32', 'SI_8', 'SI_16', 'SI_32', 'FL_32'];

var arch_modules = [
	'PumpingStrategy',
	'InjectorStrategy',
	'ApplicationControl',
	'HeatingStrategy',
	'GaugingStrategy',
	'B-SW',
	'COM',
	'Stub'	
];

var signal_types = ['Internal', 'Rx', 'Tx', 'Stub'];


// Test port info
var port_data = {
	"signalA":{
				"name": "signalA",
				"provider": "InjectorStrategy",
				"data_type": "BOOL",
				"initial": "0",
				"unit": "-",
				"resolution": "1",
				"offset": "0",
				"signal_type": "Internal"
				},
	"signalB":{
				"name": "signalB",
				"provider": "PumpingStrategy",
				"data_type": "UI_8",
				"initial": "0",
				"unit": "V",
				"resolution": "0.001",
				"offset": "0",
				"signal_type": "Tx",
				"can_signal": "MotorSpeed",
				"can_resolution": "0.25",
				"can_offset": "-100"
				}
};