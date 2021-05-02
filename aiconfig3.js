var machines = [["1", "WTL1", "OutcomeBasedRule(__moRSP__, 3, 0., [__ST__, __UP__, __DN__]);"], 
		["2", "WTL3", "OutcomeBasedRule(__moRSP__, 3, 0., [__DN__, __ST__, __DN__]);"],
		["3", "WTL2", "OutcomeBasedRule(__moRSP__, 3, 0., [__ST__, __DN__, __UP__]);"], 
		["4", "WTL4", "OutcomeBasedRule(__moRSP__, 3, 0., [__UP__, __ST__, __UP__]);"],
		["5", "Mimic1", "Mimic(__moRSP__, 0, 0.);"], 
		["6", "Mimic2", "Mimic(__moRSP__, 1, 0.);"]];

var machines_use_these = [0, 1, 2, 3, 4, 5];

var machine_and_configs_all = [];
var machine_and_configs_indices_all = [];
var machine_and_configs_nicknames_all = [];

for( var ii = 0; ii < machines_use_these.length; ii++ )
{
    machine_and_configs_all[ii] = machines[machines_use_these[ii]][2];
    machine_and_configs_indices_all[ii] = machines[machines_use_these[ii]][0];
    machine_and_configs_nicknames_all[ii] = machines[machines_use_these[ii]][1];
}


