
var machines = [["1", "Perceptron", "Perceptron(2);"]]


//  compare WTL and BR
//  compare Mimic and BR
//  compare WTL and Mimic

var machines_use_these = [0];

var _machine_and_configs = [];
var _machine_and_configs_indices = [];
var _machine_and_configs_nicknames = [];

for( var ii = 0; ii < machines_use_these.length; ii++ )
{
    _machine_and_configs[ii] = machines[machines_use_these[ii]][2];
    _machine_and_configs_indices[ii] = machines[machines_use_these[ii]][0];
    _machine_and_configs_nicknames[ii] = machines[machines_use_these[ii]][1];
}
