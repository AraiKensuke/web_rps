class MarkovChain {
    AImach = null;
    SoftmaxPwr = null;
    internal_state = [];
    
    ini_MC_cndprob="";
    fin_MC_cndprob="";

    constructor(decay, smxpwr) {
	this.AImach = __MC__;
	this.AIconfigname = this.AImach + "-" + smxpwr.toString() + "-" + decay.toString();

	this.SoftmaxPwr = smxpwr;
	this.decay = decay;
	this.matrix = {
	    "11":{"1":{"prob":1/3, "n_obs":0}, "2":{"prob":1/3, "n_obs":0}, "3":{"prob":1/3, "n_obs":0}},
	    "12":{"1":{"prob":1/3, "n_obs":0}, "2":{"prob":1/3, "n_obs":0}, "3":{"prob":1/3, "n_obs":0}},
	    "13":{"1":{"prob":1/3, "n_obs":0}, "2":{"prob":1/3, "n_obs":0}, "3":{"prob":1/3, "n_obs":0}},
	    "21":{"1":{"prob":1/3, "n_obs":0}, "2":{"prob":1/3, "n_obs":0}, "3":{"prob":1/3, "n_obs":0}},
	    "22":{"1":{"prob":1/3, "n_obs":0}, "2":{"prob":1/3, "n_obs":0}, "3":{"prob":1/3, "n_obs":0}},
	    "23":{"1":{"prob":1/3, "n_obs":0}, "2":{"prob":1/3, "n_obs":0}, "3":{"prob":1/3, "n_obs":0}},
	    "31":{"1":{"prob":1/3, "n_obs":0}, "2":{"prob":1/3, "n_obs":0}, "3":{"prob":1/3, "n_obs":0}},
	    "32":{"1":{"prob":1/3, "n_obs":0}, "2":{"prob":1/3, "n_obs":0}, "3":{"prob":1/3, "n_obs":0}},
	    "33":{"1":{"prob":1/3, "n_obs":0}, "2":{"prob":1/3, "n_obs":0}, "3":{"prob":1/3, "n_obs":0}}
	}
	var prno_9x6 = this.to_9x6s(this.internal_state);
	this.internal_state[0] = prno_9x6;

	for(var i=0; i < 3; i++)
	{
	    for(var j=0;j<3;j++){
		this.ini_MC_cndprob += "0.333333 " + "0.333333 " + "0.333333";
	    }
	}
    }

    to_9x6s()
    {
	var prno_9x6 = [[0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0]];
	
	var keys = ["11", "12", "13", "21", "22", "23", "31", "32", "33"];
	var rpss  = ["1", "2", "3"];
	
	var ik, irps, key, rps;
	for( ik = 0; ik < 9; ik++ )
	{
	    key = keys[ik];
	    for( irps  = 0; irps < 3; irps++ )
	    {
		rps = rpss[irps];
    		prno_9x6[ik][irps*2] = this.matrix[key][rps]["prob"];
    		prno_9x6[ik][irps*2+1] = this.matrix[key][rps]["n_obs"];
	    }
	}
	
	return prno_9x6;
    }

    update_matrix(pair, input) {
	console.log("update_matrix");
	for (var i = 1; i < 4; i++) {
	    this.matrix[pair][String(i)]['n_obs'] = this.decay * this.matrix[pair][String(i)]['n_obs'];
	}
	
	this.matrix[pair][input]['n_obs']++;
	
	var n_total = 0;
	for (var i = 1; i < 4; i++) { 
	    n_total += this.matrix[pair][String(i)]['n_obs'];
	}
	
	for (var i = 1; i < 4; i++) { 
	    this.matrix[pair][String(i)]['prob'] = this.matrix[pair][String(i)]['n_obs'] / n_total;
	}

	this.internal_state[this.internal_state.length] = this.to_9x6s(this.internal_state);
    }

    predict(pair) {
	var probs = this.matrix[pair];
	//blk = parseInt(blk, 10);
	//console.log(blk);
	
	switch (this.SoftmaxPwr) { //change to SQ, PC, RD
	case 2:
	    //console.log("MC2");
	    //Method: SQUARED
	    var sample = Math.random();
	    var con = Math.pow((probs['1']['prob']), 2) + Math.pow((probs['2']['prob']), 2) + Math.pow((probs['3']['prob']), 2);
	    
	    var r_prob = Math.pow((probs['1']['prob']), 2)/con;
	    var p_prob = Math.pow((probs['2']['prob']), 2)/con;
	    var s_prob = Math.pow((probs['3']['prob']), 2)/con;
	    
	    var rps_probs = [r_prob, p_prob, s_prob];
	    //console.log(rps_probs);
	    
	    if (sample < r_prob) return "1";
	    else if ((sample >= r_prob) && (sample < r_prob + p_prob)) return "2";
	    else return "3";
	    
	case 1:
	    //console.log("MC");
	    //Method: SOFTMAX
	    var sample = Math.random();
	    var r_prob = probs['1']['prob'];
	    var p_prob = probs['2']['prob'];
	    var s_prob = probs['3']['prob'];
	    
	    var rps_probs = [r_prob, p_prob, s_prob];
	    //console.log(rps_probs);
	    
	    if (sample < r_prob) return "1";
	    if ((sample >= r_prob) && (sample < r_prob + p_prob)) return "2";
	    if (sample >= r_prob + p_prob) return "3";
	    break;
	    
	default:
	    
	}
    }

    done()
    {
	var int_state = this.internal_state[this.internal_state.length-1]
	
	for(var i=0;i<3;i++){
	    for(var j=0;j<3;j++){
		this.fin_MC_cndprob += int_state[3*i+j][0].toFixed(4) + " " + int_state[3*i+j][2].toFixed(4) + int_state[3*i+j][4].toFixed(4) + " ";
	    }
	}
    }
}
