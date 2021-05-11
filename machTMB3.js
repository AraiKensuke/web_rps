//  fxd_seq has 19 1's, 19 2's and 2 3's
fxd_seq = "[1, 1, 1, 3, 2, 1, 2, 2, 1, 1, " +
           "1, 2, 2, 1, 2, 1, 2, 1, 2, 1, " + 
           "1, 1, 3, 1, 2, 1, 1, 2, 2, 2, " + 
           "2, 1, 2, 2, 2, 2, 1, 2, 2, 1]";
var machines = [["1", "WTL1", "WTL(__moRSP__, [0.8, 0.1, 0.1], [0.1, 0.45, 0.45], [0.1, 0.45, 0.45], false);"],
                ["2", "WTL2", "WTL(__moRSP__, [0.1, 0.45, 0.45], [0.1, 0.45, 0.45], [0.1, 0.45, 0.45], false);"],
                ["3", "WTL3", "WTL(__moRSP__, [0.1, 0.45, 0.45], [0.1, 0.45, 0.45], [0.7, 0.25, 0.05], false);"],
                //["4", "BiasRnd1", "BiasedRandom(__moRSP__, [0.75, 0.125, 0.125]);"],
		["4", "BiasedRandom", "FixedSequence(__moRSP__, " + fxd_seq + ");"],
		["5", "Mimic", "Mimic(__moRSP__, 2, 0.2);"]];


//  compare WTL and BR
//  compare Mimic and BR
//  compare WTL and Mimic

var rnd = Math.random();
var machines_use_these = [2, 3, 4];

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
