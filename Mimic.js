// copies or upgrades/downgrades the opponent’s last move depending on initializtion

class Mimic {

    constructor(move_order, mode) {

        // mode is 0 for copy, 1 for upgrade/downgrade
        this.mode_val = mode;

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
    predict(player) {

        var rnd = Math.random();

        // if mode 0: copy
        if (this.mode_val == 0) {return player}

        // else mode 1: downgrade/upgrade with prob 0.5
        else {
            if (rnd < 0.5) {return this.downgrade(player)}
            else {return this.upgrade(player)}
        }

    }

    done(){};

}
