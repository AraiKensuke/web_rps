class Perceptron {
    pred=[];
    prc_weight=[];
    prc_record=[];
    ini_prc_weight="";
    fin_prc_weight="";

    prc_N = 0

    constructor(N) {
	this.AImach = __PRC__;
	this.prc_N = N
	this.AIconfigname = this.AImach + "-" + this.prc_N.toString();
	for(var i=0;i<3;i++){
	    this.prc_weight[i] = new Array();
	
	    for(var j=0;j<3;j++){
		this.prc_record[j] = new Array();
		this.prc_weight[i][j] = new Array();

		//   initially, don't set the prc_weights farther back in time
		for(var k=0;k<this.prc_N;k++){
		    this.prc_record[j][k] = 0;    
		    this.prc_weight[i][j][k] = (k < 2) ? Math.random() * 4 - 2.0 : 0;
		    this.ini_prc_weight += String(this.prc_weight[i][j][k]) + " ";
		}
	    }
	    this.pred[i] = 0;
	}
    }

    predict(player)
    {   //   current player move is predicted by current contents of this.pred
	var prec=[];
	for(var i=0;i<3;i++) prec[i]=-1;
	prec[player-1] = 1;
	
	for(var i=0;i<3;i++){
	    if(prec[i]*this.pred[i] <= 0){
		for(var j=0;j<3;j++){
		    for(var k=0;k<this.prc_N;k++){
			this.prc_weight[i][j][k] += prec[i]*this.prc_record[j][k];
		    }
		}
	    }
	}

	for(var i=0;i<3;i++){
	    this.prc_record[i].unshift(prec[i]);
	    this.prc_record[i].pop();
	}

	//    Build new prediction of what HUMAN will play.
	for(var i=0;i<3;i++) this.pred[i]=0;

	for(var i=0;i<3;i++){
	    for(var j=0;j<3;j++){
		for(var k=0;k<this.prc_N;k++){
		    this.pred[i] += this.prc_weight[i][j][k]*this.prc_record[j][k];
		}
	    }
	}

	var maxval=this.pred[0];  
	var maxnum = 0;

	for(var i=1;i<3;i++){
	    if(this.pred[i]>=maxval){
		maxval = this.pred[i];
		maxnum = i;
	    }
	}
	return(maxnum+1);
    }

    done()
    {
	for(var i=0;i<3;i++){
	    for(var j=0;j<3;j++){
		for(var k=0;k<this.prc_N;k++)
		{
		    this.fin_prc_weight += String(this.prc_weight[i][j][k]) + " ";
		}
	    }
	}
    }
}
