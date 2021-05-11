var __ST__ = 0;
var __UP__ = 1;
var __DN__ = 2;
var __AI_WIN__ = 0;
var __AI_TIE__ = 1;
var __AI_LOS__ = 2;

//   R, S, P

class FixedSequence {
    AImach = __BIRND__;

    constructStr;
    seq_ptr = 0;

    setConstructStr(s)
    {
	this.constructStr = s;
    }

    constructor(move_order, fixed_hand_seq) //, switch_timescale) {
    {
	this.moves = [0, 0, 0];
	this.seq_ptr = 0;
	this.fixed_seq = fixed_hand_seq;

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

    predict(player)  // player move wasnt matched by me yet
    {   //   player is 1, 2, 3    R, S, P
	//   returns 1, 2, 3

	var ret = this.downgrade(this.fixed_seq[this.seq_ptr % this.fixed_seq.length]);  // return pred of HUMAN hand
	this.seq_ptr += 1;
	return ret;
    }

    done()
    {
    }
}
