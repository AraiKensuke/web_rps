var machines = [["1", "WTL1", "OutcomeBasedRule(__moRSP__, 3, 0.15, [__ST__, __UP__, __DN__]);"], 
		["2", "WTL3", "OutcomeBasedRule(__moRSP__, 3, 0.15, [__DN__, __ST__, __DN__]);"],
		["3", "Mimic3", "Mimic(__moRSP__, 2, 0.15);"],
		["4", "WTL2", "OutcomeBasedRule(__moRSP__, 3, 0.15, [__ST__, __DN__, __UP__]);"], 
		["5", "Mimic1", "Mimic(__moRSP__, 0, 0.15);"], 
		["6", "WTL4", "OutcomeBasedRule(__moRSP__, 3, 0.15, [__UP__, __ST__, __UP__]);"],

		["7", "Mimic2", "Mimic(__moRSP__, 1, 0.15);"],
		["8", "WTL5", "OutcomeBasedRule(__moRSP__, 3, 0.15, [__DN__, __DN__, __ST__]);"],
		["9", "WTL6", "OutcomeBasedRule(__moRSP__, 3, 0.15, [__UP__, __UP__, __ST__]);"]];

var machines_use_these = [0, 1, 2, 3, 4, 5, 6, 7, 8];


var _machine_and_configs = [];
var _machine_and_configs_indices = [];
var _machine_and_configs_nicknames = [];

for( var ii = 0; ii < machines_use_these.length; ii++ )
{
    _machine_and_configs[ii] = machines[machines_use_these[ii]][2];
    _machine_and_configs_indices[ii] = machines[machines_use_these[ii]][0];
    _machine_and_configs_nicknames[ii] = machines[machines_use_these[ii]][1];
}


