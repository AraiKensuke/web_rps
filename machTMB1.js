//  fxd_seq has 5 2's, 5 3's and 30 1's
fxd_seqB = "[1, 1, 2, 1, 1, 1, 1, 3, 1, 1, " +
           "1, 1, 2, 1, 1, 3, 2, 1, 1, 3, " + 
           "1, 1, 2, 1, 1, 1, 3, 1, 1, 1, " + 
    "2, 1, 1, 3, 1, 1, 1, 1, 1, 1]";

//  fxd_seq has 13 2's, 14 3's and 13 1's
fxd_seqU = "[3, 1, 2, 3, 2, 1, 2, 3, 3, 1, " +
           "1, 1, 2, 1, 3, 3, 2, 1, 2, 3, " + 
           "3, 1, 2, 1, 2, 1, 3, 2, 2, 3, " + 
           "2, 1, 3, 3, 2, 2, 3, 1, 3, 1]";

var machines = [["1", "Looks at past moves ver. 1", "WTL(__moRSP__, [0.8, 0.1, 0.1], [0.1, 0.45, 0.45], [0.1, 0.45, 0.45], false);"],
                ["2", "Looks at past moves ver. 2", "WTL(__moRSP__, [0.1, 0.45, 0.45], [0.1, 0.45, 0.45], [0.1, 0.45, 0.45], false);"],
                ["3", "Looks at past moves ver. 3", "WTL(__moRSP__, [0.1, 0.45, 0.45], [0.1, 0.45, 0.45], [0.7, 0.25, 0.05], false);"],
                //["4", "BiasRnd1", "BiasedRandom(__moRSP__, [0.75, 0.125, 0.125]);"],
		["4", "Ignores past moves, but biased ver. 1", "FixedSequence(__moRSP__, " + fxd_seqB + ");"],
		["5", "Ignores past moves, unbiased", "FixedSequence(__moRSP__, " + fxd_seqU + ");"],

		["6", "Mimics past moves v. 1", "Mimic(__moRSP__, 0, 0.2);"]];


//  compare WTL and BR
//  compare Mimic and BR
//  compare WTL and Mimic

var rnd = Math.random();
var machines_use_these = [0, 3, 4, 5];

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
