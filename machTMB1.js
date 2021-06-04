//  fxd_seq has 7 2's, 7 3's and 26 1's
fxd_seqB = "[1, 1, 2, 1, 3, 1, 1, 1, 1, 3, " +
            "2, 1, 2, 1, 1, 3, 2, 1, 1, 3, " + 
            "1, 1, 2, 1, 1, 3, 1, 2, 1, 1, " + 
            "2, 1, 1, 3, 3, 1, 1, 1, 1, 1]";

//  fxd_seq has 13 2's, 14 3's and 13 1's
fxd_seqU = "[3, 1, 2, 3, 2, 1, 2, 3, 3, 1, " +
           "1, 1, 2, 1, 3, 3, 2, 1, 2, 3, " + 
           "3, 1, 2, 1, 2, 1, 3, 2, 2, 3, " + 
           "2, 1, 3, 3, 2, 2, 3, 1, 3, 1]";

//["4", "Human can exploit post-WIN (easier)", "WTL(__moRSP__, [1/3, 1/3, 1/3], [1/3, 1/3, 1/3], [0.6, 0.2, 0.2], false);"],

var machines = [["1", "Human can exploit post-LOSS (harder)", "WTL(__moRSP__, [0.2, 0.4, 0.4], [1/3, 1/3, 1/3], [1/3, 1/3, 1/3], false);"],
		["2", "Human can exploit post-LOSS (easier)", "WTL(__moRSP__, [0.05, 0.6, 0.35], [1/3, 1/3, 1/3], [1/3, 1/3, 1/3], false);"],   // If HUM loses and stays (repeat press of key) and machine upgrades, then it will lose next round.   [0.05, 0., 0.95]  -->  always TIES following loss.  
		["3", "Looks at past moves ver. 1", "WTL(__moRSP__, [0.7, 0.15, 0.15], [0.1, 0.45, 0.45], [0.1, 0.45, 0.45], false);"],
		["4", "Ignores past moves, but biased ver. 1", "FixedSequence(__moRSP__, " + fxd_seqB + ");"],
		["5", "Ignores past moves, unbiased", "FixedSequence(__moRSP__, " + fxd_seqU + ");"],

		["6", "Mimics past moves v. 1", "Mimic(__moRSP__, 0, 0.2);"]];

//  compare WTL and BR
//  compare Mimic and BR
//  compare WTL and Mimic

var rnd = Math.random();
var machines_use_these = [1, 3, 4];

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
