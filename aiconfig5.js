var machines = [["1", "WTL1", "OutcomeBasedRule(__moRSP__, 3, 0.15, [__ST__, __UP__, __DN__]);"], 
		["2", "MC1", "MarkovChain(0.9, 1);"]]

var machines_use_these = [0, 1];


var _machine_and_configs = [];
var _machine_and_configs_indices = [];
var _machine_and_configs_nicknames = [];

for( var ii = 0; ii < machines_use_these.length; ii++ )
{
    _machine_and_configs[ii] = machines[machines_use_these[ii]][2];
    _machine_and_configs_indices[ii] = machines[machines_use_these[ii]][0];
    _machine_and_configs_nicknames[ii] = machines[machines_use_these[ii]][1];
}


