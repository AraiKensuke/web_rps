// copies or upgrades/downgrades the opponent’s last move depending on initializtion

class Mimic {
    epsilon;

    constructor(move_order, mode, epsilon) {
        // mode is 0 for copy, 1 for upgrade/downgrade
        this.mode_val = mode;
	this.AImach   = __MIMIC__;
	this.epsilon  = epsilon;

        if (move_order == __moRPS__) {
            this.dngrded = [3, 1, 2];  // 1 down to 3, 2 down to 1, 3 down to 2
            this.upgrded = [2, 3, 1];
        }
        else { 
            this.dngrded = [2, 3, 1];  // 1 down to 2, 2 down to 3, 3 down to 1
            this.upgrded = [3, 1, 2];
        }
    }

    // hnd = [1, 2, 3]
    downgrade(hnd) {return this.dngrded[hnd-1]}
    upgrade(hnd) {return this.upgrded[hnd-1]}

    // returns 1,2,3 for order RSP
    predict(player) {   //   predicts player hand
	console.log("player    " + player);
        var rnd = Math.random();
	var returnThis;
	var val;
        // if mode 0: copy
        if (this.mode_val == 0) {
	    val = this.downgrade(player)   //  pred of player hand, if we predict 
	}

        // else mode 1: downgrade/upgrade with prob 0.5
        else {
            //if (rnd < 0.5) {return this.downgrade(player)}
	    val  = this.downgrade(player);
	    val  = this.downgrade(val);
            //else {return this.upgrade(player)}
        }

	if (Math.random() < this.epsilon)
	{   // add a bit of noise
	    if (Math.random() < 0.5)
	    {
		val = this.downgrade(val);
	    }
	    else
	    {
		val = this.upgrade(val);
	    }
	}
	return val;


    }

    done(){};

}
