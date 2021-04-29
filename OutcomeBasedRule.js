var __ST__ = 0;
var __UP__ = 1;
var __DN__ = 2;
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
    pred=[];
    my_last_play;
    last_result;

    W_rule = null;
    T_rule = null;
    L_rule = null;

    //i_switch_timescale;

    constructor(move_order) //, switch_timescale) {
    {
	this.AImach = __OBR__;

	this.W_rule = __ST__;
	this.T_rule = __DN__;
	this.L_rule = __DN__;

	this.my_last_play = 1;

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
	    rule = this.W_rule;
	}
	else if (last_outcome == __AI_TIE__)
	{
	    rule = this.T_rule;
	}
	else if (last_outcome == __AI_LOS__)
	{
	    rule = this.L_rule;
	}

	if (rule == __UP__)
	{
	    this.my_last_play = this.upgrade(this.my_last_play);
	}
	else if (rule == __DN__)
	{
	    this.my_last_play = this.downgrade(this.my_last_play);
	}

	// if (Math.random() < (0.333*this.i_switch_timescale))
	// {
	//     this.W_rule = new_rule(this.W_rule);
	// }
	// if (Math.random() < (0.333*this.i_switch_timescale))
	// {
	//     this.T_rule = new_rule(this.T_rule);
	// }
	// if (Math.random() < (0.333*this.i_switch_timescale))
	// {
	//     this.L_rule = new_rule(this.L_rule);
	// }

	var ret = this.downgrade(this.my_last_play);  // return pred of HUMAN hand
	return ret;
    }

    done()
    {
    }
}
