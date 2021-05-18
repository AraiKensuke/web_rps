var __ST__ = 0;
var __UP__ = 1;
var __DN__ = 2;
var __CH__ = 3;
var __AI_WIN__ = 0;
var __AI_TIE__ = 1;
var __AI_LOS__ = 2;

//   R, S, P

//    this.constructor = function //, switch_timescale) {
//    {

function WTL(move_order, pW, pT, pL, doCounter) {
    this.pred=[];
    this.my_last_play;
    this.last_result;
    this.consecutive_ups;
    this.consecutive_dns;
    this.consecutive_ties;

    this.consecutive_losses;
    this.counter_mode;

    this.W_rule = null;
    this.T_rule = null;
    this.L_rule = null;
    this.epsilon = null;

    //i_switch_timescale;

    this.doCounter = false;
    this.constructStr;



    this.AImach = __WTL__;
    this.doCounter = doCounter;
    //var rule_profile = getRandomInt(0, this.rules.length);
    this.W_rule = pW;
    this.T_rule = pT;
    this.L_rule = pL;
    this.consecutive_losses = 0;
    this.counter_mode = 0;
    
    var sum_W = this.W_rule[0] + this.W_rule[1] + this.W_rule[2]
    var sum_T = this.T_rule[0] + this.T_rule[1] + this.T_rule[2]
    var sum_L = this.L_rule[0] + this.L_rule[1] + this.L_rule[2]
    for (var i = 0; i < 3; i++ )
    {
	this.W_rule[i] /= sum_W
	this.T_rule[i] /= sum_T
	this.L_rule[i] /= sum_L
    }
    this.cum_W_rule = [0];
    this.cum_T_rule = [0];
    this.cum_L_rule = [0];
    
    for (var i = 0; i < 3; i++ )
    {
	this.cum_W_rule[i+1] = this.W_rule[i] + this.cum_W_rule[i]
	this.cum_T_rule[i+1] = this.T_rule[i] + this.cum_T_rule[i]
	this.cum_L_rule[i+1] = this.L_rule[i] + this.cum_L_rule[i]
    }
    
    this.my_last_play = 1;
    this.consecutive_ups = 0;
    this.consecutive_dns = 0;

    //this.i_switch_timescale =1./switch_timescale;
    
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

    this.setConstructStr = function(s)
    {
	this.constructStr = s;
    }

    this.pickAction = function(cum_ps)    
    {
	var r = Math.random()
	for( var i = 0; i < cum_ps.length-1; i++)
	{
	    if ((r >= cum_ps[i]) && (r < cum_ps[i+1]))
	    {
		return i
	    }
	}
    }


    this.downgrade = function(hnd)
    {   // hnd = [1, 2, 3]
	return this.dngrded[hnd-1];
    }
    this.upgrade = function(hnd)
    {   // hnd = [1, 2, 3]
	return this.upgrded[hnd-1];
    }
    this.change = function(hnd)
    {   // hnd = [1, 2, 3]
	if (Math.random() < 0.5)
	{
	    return this.upgrded[hnd-1];
	}
	else
	{
	    return this.dngrded[hnd-1];
	}
    }

    this.predict = function(player)  // player move wasnt matched by me yet
    {   //   player is 1, 2, 3    R, S, P
	//   returns 1, 2, 3
	//
	var last_outcome;
	var rule;
	console.log("in predict 1");
	if ( ((this.my_last_play == 1) && (player == 2)) ||
	     ((this.my_last_play == 2) && (player == 3)) ||
	     ((this.my_last_play == 3) && (player == 1)) )
	{  // (AI=R, HUM=S) or (AI=S, HUM=P) or or (AI=P, HUM=R)
	    last_outcome=__AI_WIN__;
	    this.consecutive_losses = 0;
	}
	else if ( ((this.my_last_play == 2) && (player == 1)) ||
		  ((this.my_last_play == 3) && (player == 2)) ||
		  ((this.my_last_play == 1) && (player == 3)) )
	{
	    // (AI=S, HUM=R) or (AI=P, HUM=S) or or (AI=R, HUM=P)
	    last_outcome = __AI_LOS__;
	    this.consecutive_losses += 1;
	}
	else   // TIE
	{
	    // (AI=S, HUM=R) or (AI=P, HUM=S) or or (AI=R, HUM=P)
	    last_outcome = __AI_TIE__;
	}
	console.log("in predict 2");
	if (last_outcome == __AI_WIN__)
	{
	    rule = this.pickAction(this.cum_W_rule);
	}
	else if (last_outcome == __AI_TIE__)
	{
	    rule = this.pickAction(this.cum_T_rule);
	}
	else if (last_outcome == __AI_LOS__)
	{
	    rule = this.pickAction(this.cum_L_rule);
	}

	if (rule == __UP__)
	{
	    //this.my_last_play = this.downgrade(this.my_last_play);
	    this.my_last_play = this.upgrade(this.my_last_play);
	}
	else if (rule == __DN__)
	{
	    //this.my_last_play = this.upgrade(this.my_last_play);
	    this.my_last_play = this.downgrade(this.my_last_play);
	}
	console.log("in predict 3");
	if (this.doCounter)
	{
	    if ( (this.consecutive_losses > 2) && (this.counter_mode == 0) )
	    {
		//  counter.  If I was going to 
		this.counter_mode = 3;
		this.consecutive_losses = 0;
	    }
	    if (this.counter_mode > 0)
	    {
		
		// if (this.counter_mode == 1)
		// {
		// 	this.my_last_play = this.upgrade(this.my_last_play);
		// }
		// else
		// {   // counter
		this.my_last_play = this.downgrade(this.my_last_play);
		//}
		this.counter_mode -= 1;
	    }
	}

	var ret = this.downgrade(this.my_last_play);  // return pred of HUMAN hand
	return ret;
    }

    this.done = function()
    {
    }
}
