var machines = [["1", "WTL1", "OutcomeBasedRule(__moRSP__, 3, 0., [__ST__, __UP__, __DN__]);"], 
		["2", "WTL3", "OutcomeBasedRule(__moRSP__, 3, 0., [__DN__, __ST__, __DN__]);"],
		["3", "Mimic3", "Mimic(__moRSP__, 2, 0.);"],
		["4", "WTL2", "OutcomeBasedRule(__moRSP__, 3, 0., [__ST__, __DN__, __UP__]);"], 
		["5", "Mimic1", "Mimic(__moRSP__, 0, 0.);"], 
		["6", "WTL4", "OutcomeBasedRule(__moRSP__, 3, 0., [__UP__, __ST__, __UP__]);"],

		["7", "Mimic2", "Mimic(__moRSP__, 1, 0.);"],
		["8", "Rnd", "BiasedRandom(__moRSP__, [0.33, 0.33, 0.34])"],
		["9", "BiasRnd", "BiasedRandom(__moRSP__, [0.25, 0.25, 0.5])"]]

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
