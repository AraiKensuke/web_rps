var __ST__ = 0;
var __UP__ = 1;
var __DN__ = 2;
var __CH__ = 3;
var __AI_WIN__ = 0;
var __AI_TIE__ = 1;
var __AI_LOS__ = 2;

//   R, S, P

function new_rule(old_rule)
{
    var new_RULE = null;
    if (old_rule == __ST__)
    {
	new_RULE = (Math.random() < 0.5) ? __UP__ : __DN__;
    }
    else if (old_rule == __UP__)
    {
	new_RULE = (Math.random() < 0.5) ? __ST__ : __DN__;
    }
    else if (old_rule == __DN__)
    {
	new_RULE = (Math.random() < 0.5) ? __UP__ : __ST__;
    }
    return new_RULE;
}

class OutcomeBasedRule {
    //rules = [[__ST__, __DN__, __UP__], [__ST__, __UP__, __UP__],
    //	     [__DN__, __DN__, __ST__], [__DN__, __ST__, __DN__],
    //	     [__UP__, __UP__, __DN__], [__UP__, __ST__, __DN__]];
    //rules = [[__ST__, __DN__, __DN__], [__DN__, __ST__, __DN__],
    //	     [__DN__, __DN__, __ST__]];

    stays;
    pred=[];
    my_last_play;
    last_result;
    consecutive_ups;
    consecutive_dns;
    consecutive_ties;

    W_rule = null;
    T_rule = null;
    L_rule = null;
    epsilon = null;
    max_stays = null;

    //i_switch_timescale;

    constructStr;

    setConstructStr(s)
    {
	this.constructStr = s;
    }

    constructor(move_order, mxstys, eps, rule_profile) //, switch_timescale) {
    {
	this.AImach = __OBR__;
	this.stays  = 0;     // we won't keep stays longer than max_stays
	this.max_stays = mxstys;
	this.epsilon = eps;
	//var rule_profile = getRandomInt(0, this.rules.length);
	this.W_rule = rule_profile[0];
	this.T_rule = rule_profile[1];
	this.L_rule = rule_profile[2];

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
    }

    downgrade(hnd)
    {   // hnd = [1, 2, 3]
	return this.dngrded[hnd-1];
    }
    upgrade(hnd)
    {   // hnd = [1, 2, 3]
	return this.upgrded[hnd-1];
    }
    change(hnd)
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

    predict(player)  // player move wasnt matched by me yet
    {   //   player is 1, 2, 3    R, S, P
	//   returns 1, 2, 3
	//
	var last_outcome;
	var rule;
	if ( ((this.my_last_play == 1) && (player == 2)) ||
	     ((this.my_last_play == 2) && (player == 3)) ||
	     ((this.my_last_play == 3) && (player == 1)) )
	{  // (AI=R, HUM=S) or (AI=S, HUM=P) or or (AI=P, HUM=R)
	    last_outcome=__AI_WIN__;
	}
	else if ( ((this.my_last_play == 2) && (player == 1)) ||
		  ((this.my_last_play == 3) && (player == 2)) ||
		  ((this.my_last_play == 1) && (player == 3)) )
	{
	    // (AI=S, HUM=R) or (AI=P, HUM=S) or or (AI=R, HUM=P)
	    last_outcome = __AI_LOS__;
	}
	else   // TIE
	{
	    // (AI=S, HUM=R) or (AI=P, HUM=S) or or (AI=R, HUM=P)
	    last_outcome = __AI_TIE__;
	}

	if (last_outcome == __AI_WIN__)
	{
	    this.consecutive_wins += 1;
	    this.consecutive_ties = 0;
	    this.consecutive_loss = 0;
	    rule = this.W_rule;
	}
	else if (last_outcome == __AI_TIE__)
	{
	    this.consecutive_wins = 0;
	    this.consecutive_ties += 1;
	    this.consecutive_loss = 0;

	    rule = this.T_rule;
	}
	else if (last_outcome == __AI_LOS__)
	{
	    this.consecutive_wins = 0;
	    this.consecutive_ties = 0;
	    this.consecutive_loss += 1;
	    rule = this.L_rule;
	}

	if (rule == __UP__)
	{
	    //this.consecutive_ups += 1;

	    //if (this.consecutive_ups > 3)
	    //{
	    this.my_last_play = this.downgrade(this.my_last_play);
	    // this.consecutive_ups = 0;
	    // //}
	    // else
	    // {
	    // 	this.my_last_play = this.upgrade(this.my_last_play);
	    // }
	}
	else if (rule == __DN__)
	{
	    // this.consecutive_dns += 1;
	    // if (this.consecutive_dns > 3)
	    // {
	    this.my_last_play = this.upgrade(this.my_last_play);
	    // }
	    // else
	    // {
	    // 	this.my_last_play = this.downgrade(this.my_last_play);
	    // }
	}
	else if (rule == __CH__)
	{
	    this.my_last_play = this.change(this.my_last_play);
	}
	if (Math.random() < this.epsilon)
	{
	    this.my_last_play = this.change(this.my_last_play);
	}

	var ret = this.downgrade(this.my_last_play);  // return pred of HUMAN hand
	return ret;
    }

    done()
    {
    }
}
