var machines = [["1", "WTL1", "WTL(__moRSP__, [0.8, 0.1, 0.1], [0.2, 0.4, 0.4], [0.1, 0.45, 0.45], false);"],
		["2", "WTL2", "WTL(__moRSP__, [0.2, 0.4, 0.4], [0.2, 0.4, 0.4], [0.1, 0.45, 0.45], false);"],
		["3", "WTL3", "WTL(__moRSP__, [0.1, 0.45, 0.45], [0.1, 0.45, 0.45], [0.7, 0.2, 0.1], false);"],
		["4", "BiasRnd1", "BiasedRandom(__moRSP__, [0.6, 0.2, 0.2])"]];

//  compare WTL and BR
//  compare Mimic and BR
//  compare WTL and Mimic

var rnd = Math.random();
var machines_use_these = [0, 1, 2, 3];

/*
if ((rnd > 0) && (rnd < 0.333))
{
    var machines_use_these = [0, 1, 2, 3];
}
else if ((rnd >= 0.333) && (rnd < 0.666))
{
    var machines_use_these = [0, 1, 4, 5];
}
else if ((rnd >= 0.666) && (rnd <= 1))
{
    var machines_use_these = [2, 3, 4, 5];
}
*/
var _machine_and_configs = [];
var _machine_and_configs_indices = [];
var _machine_and_configs_nicknames = [];

for( var ii = 0; ii < machines_use_these.length; ii++ )
{
    _machine_and_configs[ii] = machines[machines_use_these[ii]][2];
    _machine_and_configs_indices[ii] = machines[machines_use_these[ii]][0];
    _machine_and_configs_nicknames[ii] = machines[machines_use_these[ii]][1];
}


