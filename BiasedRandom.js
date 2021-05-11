var __ST__ = 0;
var __UP__ = 1;
var __DN__ = 2;
var __AI_WIN__ = 0;
var __AI_TIE__ = 1;
var __AI_LOS__ = 2;

//   R, S, P

class BiasedRandom {
    rps_prob  = null;
    rps_cumprob = null;
    AImach = __BIRND__;

    constructStr;

    setConstructStr(s)
    {
	this.constructStr = s;
    }

    constructor(move_order, probs) //, switch_timescale) {
    {
	this.moves = [0, 0, 0];
	this.rps_prob = [];
	this.rps_prob[0] = probs[0];
	this.rps_prob[1] = probs[1];
	this.rps_prob[2] = probs[2];

	var totprob = this.rps_prob[0] + this.rps_prob[1] + this.rps_prob[2];
	for (var i = 0; i < 3; i++ )
	{
	    this.rps_prob[i] = this.rps_prob[i] / totprob;
	}

	this.cum_prob = [];
	this.cum_prob[0] = 0;
	this.cum_prob[1] = this.rps_prob[0];
	this.cum_prob[2] = this.rps_prob[0] + this.rps_prob[1];
	this.cum_prob[3] = this.rps_prob[0] + this.rps_prob[1] +  + this.rps_prob[2];

	if (move_order == __moRPS__)
	{
	    this.dngrded = [3, 1, 2]  //1 down to 3, 2 down to 1
	    this.upgrded = [2, 3, 1]
	}
	else
	{   // RSP
	    this.dngrded = [2, 3, 1]   //1 down to 2, 2 down to 3, 3 down to 1
	    this.upgrded = [3, 1, 2]
	}
    }

    downgrade(hnd)
    {   // hnd = [1, 2, 3]
	return this.dngrded[hnd-1];
    }
    upgrade(hnd)
    {   // hnd = [1, 2, 3]
	return this.upgrded[hnd-1];
    }

    predict(player)  // player move wasnt matched by me yet
    {   //   player is 1, 2, 3    R, S, P
	//   returns 1, 2, 3

	var rnd = Math.random();

	var i = 0;
	var iFnd = 0;

	while (i < 3)
	{
	    if ((rnd >= this.cum_prob[i]) && (rnd <= this.cum_prob[i+1]))
	    {
		iFnd = i;
	    }
	    i += 1;
	}

	var ret = this.downgrade(iFnd + 1);  // return pred of HUMAN hand
	this.moves[ret-1] += 1;
	console.log(this.moves)
	return ret;
    }

    done()
    {
    }
}
