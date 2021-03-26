/* 
じゃんけんマシン
 篠本 滋「情報処理概論-予測とシミュレーション」（岩波書店）
 6．5節「じゃんけんマシンを作ってみよう」 pp101-107．
C code:  篠本 滋　2003/05/28．
javascript code:  中村和輝 2018/03/01.
 */

/* player : プレイヤーの直前の手
 * prc_record[3][N] : 過去のプレイヤーの手(3行(rsp)x列)
 * prc_weight[3][3][N] : 重み関数3*N行列
 * pred[3] : 予測ユニットの入力
 */
var graph_height = 440;
var graph_width = 240;
var graph_base = 24;
var game;		// 現在のゲーム数
var predhand;	// 次の予測手
var rec_hands="";	// 記録用
var rec_inp_methd="";	// 記録用
var rec_AI_hands="";	// 記録用
var rec_times="";	// 記録用
var results=[];	// [0]勝ち、[1]負け、[2]あいこ

//  input method   x 2
//  paced or free  x 2
//  AI or RNG      x 2

var wait_next    = 5000
var update_evry  = 1
var n_rps_plyd   = 0
var __JAPANESE__ = 0
var __ENGLISH__  = 1
var pred=[];
var prc_weight=[];
var ini_prc_weight="";
var fin_prc_weight="";
var ini_MC_cndprob="";
var fin_MC_cndprob="";

var prc_record=[];
var time_now, last_time_now;
var theDate = new Date();
var startDate = new Date();
last_time_now = theDate.getTime()
var exptname;

var rps_probs = [];
var method = "blk1";
var prc_N = 2;    // perceptron order

var blk = "1";
var count = "0";
var flag = "0";

var __MC__  = 0;
var __MC2__ = 1;
var __PRC__ = 2;
var __RND__ = 3;

var __NGAMES__  = 0;   // running number of games played
var __CWTL__ = 1;      // cumulative win, tie, lose

var machines = [__MC__, __MC2__, __PRC__, __RND__];
//var machines = [__MC__, __PRC__];
var s_machines = ["frequentist", 
		  "overgeneralized frequentist", 
		  "perceptron", "random"];
var info_machines = ["1-step frequentist", "1-step greedy frequentist",
		     "multistep perceptron", "random"];
//"The AI looks at previous game.  If human played R and AI played S there, it looks back into its record of all previous games where human played R and AI played S, and then looks to see how often human next played R, P or S.  The AI then predicts human move in proportion to how frequently that move followed human-R and AI-S.",
//		     "The AI looks at previous game.  If human played R and AI played S there, it looks back into its record of all previous games where human played R and AI played S, and then looks to see how often human next played R, P or S.  The AI then predicts human move that's dependent on how frequently that move followed human-R and AI-S, but in a more 'greedy' fashion, ie it strongly favors moves that are more likely, even if the frequency is very close to the 2nd most likely.",
//		     "Perceptron looks at several previous games, and ", "random"];

var realtimeResultsInfo = [__NGAMES__, __CWTL__];

class MarkovChain {
    constructor(decay) {
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
	this.internal_state = [];
	var prno_9x6 = this.to_9x6s(this.internal_state);
	this.internal_state[0] = prno_9x6;
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
	
	switch (AImach) { //change to SQ, PC, RD
	case __MC2__:
	    //console.log("MC2");
	    //Method: SQUARED
	    var sample = Math.random();
	    var con = Math.pow((probs['1']['prob']), 2) + Math.pow((probs['2']['prob']), 2) + Math.pow((probs['3']['prob']), 2);
	    
	    var r_prob = Math.pow((probs['1']['prob']), 2)/con;
	    var p_prob = Math.pow((probs['2']['prob']), 2)/con;
	    var s_prob = Math.pow((probs['3']['prob']), 2)/con;
	    
	    rps_probs = [r_prob, p_prob, s_prob]
	    //console.log(rps_probs);
	    
	    if (sample < r_prob) return "1";
	    else if ((sample >= r_prob) && (sample < r_prob + p_prob)) return "2";
	    else return "3";
	    
	case __MC__:
	    //console.log("MC");
	    //Method: SOFTMAX
	    var sample = Math.random();
	    var r_prob = probs['1']['prob'];
	    var p_prob = probs['2']['prob'];
	    var s_prob = probs['3']['prob'];
	    
	    rps_probs = [r_prob, p_prob, s_prob]
	    //console.log(rps_probs);
	    
	    if (sample < r_prob) return "1";
	    if ((sample >= r_prob) && (sample < r_prob + p_prob)) return "2";
	    if (sample >= r_prob + p_prob) return "3";
	    break;
	    
	default:
	    
	}
    }
}

let model = new MarkovChain(0.9);
var predict = 0;
var pair1 = "";
var pair2 = "";

function getSessionStorage(key, default_value)
{   //  return a default value if key not found
    if (sessionStorage.getItem(key) != null)
    {
	return sessionStorage.getItem(key);
    }
    console.log("sessionkey " + key + " not found ");
    return default_value;
}

function set_lang(jore)
{
    console.log("set_lang")
    JorE = jore;

    var elemTITLE = document.getElementById("titleFONT")
    var elemINSTR = document.getElementById("instrFONT")
    var elemPERHF = document.getElementById("perHandFONT")
    var elemDescF = document.getElementById("descFONT")
    var elemResuF = document.getElementById("results")
    var elemAnnoF = document.getElementById("announce")
    var resultTimeline = anime.timeline();    
    
    if( JorE == __JAPANESE__ )
    {
    }
    else
    {
	document.title = "AI rock-scissors-paper";
	if (!practiceMode)
	{
	    tit = "AI rock-scissor-paper";
	    if (to_block > 1)
	    {
		tit += " round " + block + "/" + to_block;
	    }
	}
	else
	{
	    tit = "AI rock-scissors-paper [PRACTICE MODE]"
	}
	    elemTITLE.innerHTML = tit;

	elemINSTR.innerHTML = "Your move<BR>click buttons or use keys 123"
	elemPERHF.innerHTML = "AI move"
	elemDescF.innerHTML = "Play <B><U>" + MatchTo + "</U></B> games!"

	if (realtimeResults == __CWTL__)
	{
	    //console.log("CWTL");
	    elemResuF.innerHTML = "<font color='#6970e9'>Win:"+results[0][game]+"</font>, <font color='#e9473f'>Losses:"+results[1][game]+"</font>, <font color='#319e34'>Tie:"+results[2][game]+"</font>";
	}
	else if (realtimeResults == __NGAMES__)
	{
	    elemResuF.innerHTML = "<font color='#6970e9'>Games played: "+n_rps_plyd+"/" + MatchTo + "</font>";
	}

	

	//elemResuF.innerHTML = "<font color='#6970e9'>Games played: "+n_rps_plyd+"</font>"; //to change, uncomment text in ShowResults


	//elemAnnoF.innerHTML = "<B>[!HELP US!]</B> collect data to study how players decide their next move in a game of rock-scissors-paper!  Only your moves are collected - nothing else about your online identity.<b><br/><br/><B>[References]</B> <a href=\"https://www.iwanami.co.jp/book/b264786.html\">Building AI <a href=\"http://www.ton.scphys.kyoto-u.ac.jp/~shino/janken_iphone/\">iPhone version</a>。<a href=\"c.html\">C source code</a>.  Please send any questions or comments about the game to <a href=\"mailto:shinomoto@scphys.kyoto-u.ac.jp?Subject=janken\">Shigeru Shinomoto</a>."
    }

    
    var Ymax = 0;
    for(var i=0;i<3;i++){
	if(Ymax<results[i][game]){
	    Ymax=results[i][game];
	}
    }

    if (realtimeResults == __CWTL__)
    {
	redraw_graph(Ymax);
    }
}
function prettyArray2D(arr){
    var sOut = "[";

    for( var i = 0; i < arr.length; i++ )
    {
	if( i > 0 ) { sOut += " [";}
	else	 { sOut += "[";}
	for( var j = 0; j < arr[i].length; j++ )
	{
	    sOut += String(arr[i][j]);
	    if( j < arr[i].length - 1 )
	    {
		sOut += " ";
	    }
	}
	sOut += "]";	    
    }
    return sOut+"]";
}

function prettyArray3D(arr){
    var sOut = "[";

    for( var i = 0; i < arr.length; i++ )
    {
	if( i > 0 ) { sOut += " [";}
	else	 { sOut += "[";}
	
	for( var j = 0; j < arr[i].length; j++ )
	{
	    if( j > 0 ) { sOut += "  [";}
	    else	 { sOut += "[";}
	    for( var k = 0; k < arr[i][j].length; k++ )
	    {
		sOut += String(arr[i][j][k]);
		if( k < arr[i][j].length - 1 )
		{
		    sOut += " ";
		}
	    }
	    sOut += "]";	    	    
	}
	if( i < arr[i].length - 1 )
	{
	    sOut += "]\n";
	}
	else
	{
	    sOut += "]";	    
	}
    }
    return sOut+"]";
}


//初期化
function Reset(){    
    stopped = false;
    //console.log("In Reset()")    
    ini_prc_weight="";
    fin_prc_weight="";
    ini_MC_cndprob="";
    fin_MC_cndprob="";

    rps_probs=[];
    //method_num = Math.floor(Math.random() * 3);
    //console.log("Method chosen: " + String(method_num));

    for(var i=0;i<3;i++){
	results[i]=new Array();
	results[i][0]=0;
	prc_weight[i] = new Array();
	
	for(var j=0;j<3;j++){
	    prc_record[j] = new Array();
	    prc_weight[i][j] = new Array();
	    	    ini_MC_cndprob
	    ini_MC_cndprob += "0.333333" + "0.333333" + "0.333333 ";

	    //   initially, don't set the prc_weights farther back in time
	    for(var k=0;k<prc_N;k++){
		prc_record[j][k] = 0;    
		prc_weight[i][j][k] = (k < 2) ? Math.random() * 4 - 2.0 : 0;
		ini_prc_weight += String(prc_weight[i][j][k]) + " ";
	    }
	}
	pred[i] = 0;
	results[i][0]=0;
    }

    //Match = Number(document.form.match.value);
    game=0;
    rec_hands="";   
    rec_AI_hands="";
    document.getElementById("final_result").innerHTML = '';
    //document.getElementById("final_result3").innerHTML = '';
    // 適当な値を相手の手の初期値として指定
    //var plhand = Math.floor( Math.random() * 3 + 1 );
    plhand_prev = 1;  //start with goo

    /* 勝敗表示を消す */
    var win_elem = document.getElementById("win");
    win_elem.style.opacity = 0;
    

    do1st = anime.timeline()
    do1st.add({	
    	targets: ['.m_rock_copy', '.m_scissors_copy', '.m_paper_copy', '.rock_copy', '.scissors_copy', '.paper_copy'],
    	translateY: 0, translateX:0, 
    	scale: 1, duration: 1, easing: 'linear'
    });
    
    var retry = document.getElementById("final_result2")
    retry.style.display = "none";
    //var iq = document.getElementById("final_result3")
	//iq.style.display = "none";

	model = new MarkovChain(0.9);
	predict = 0;
	pair1 = "";
	pair2 = "";
    if (practiceMode)
    {
	var bottomDIV = parent.document.getElementById("bottom");
	bottomDIV.style.visibility = "visible";
	bottomDIV.style.opacity=0.2;
	bottomDIV.style.height=200;
	bottomDIV.style.top=270;
	bottomDIV.innerHTML='<CENTER><BR><P style="color=#000000;font-size:50px">PRACTICE<BR>MODE</P></CENTER>';
    }
}



function RPS(plhand, key_or_mouse) {
    var win_elem = document.getElementById("win");
    win_elem.style.opacity = 0;

    do1st = anime.timeline()
    do1st.add({	
    	targets: ['.m_rock_copy', '.m_scissors_copy', '.m_paper_copy', '.rock_copy', '.scissors_copy', '.paper_copy'],
    	translateY: 0, translateX:0, 
    	scale: 1, duration: 1, easing: 'linear'
    });
    
    //console.log("RPS  " + String(stopped))
    var theDate = new Date()
        time_now = theDate.getTime();        
    
	//rec_hands += " " + String(plhand);

    /* 次の手のパーセプトロン予測を前もって行う */
	var pre;
    pre = AI(plhand_prev);
    plhand_prev = plhand
    //console.log("************\n" + prettyArray2D(record) + "\n\n" + prettyArray3D(weight))
	       
	/* (pre+1)%3+1はパーセプトロンの予測手predに対して勝つ「手」
	pre=1(グー)   :(pre+1)%3+1=3(パー)
	pre=2(チョキ) :(pre+1)%3+1=1(グー)
	pre=3(パー)   :(pre+1)%3+1=2(チョキ)*/
    predhand=(pre+1)%3+1; //gives stronger hand if RSP? -s

    rec_inp_methd += String(key_or_mouse) + " ";
    rec_hands += String(plhand) + " ";
    rec_AI_hands += String(predhand) + " ";
    rec_times += String(time_now - last_time_now) + " ";
    last_time_now = time_now;
	ShowResults(plhand,predhand);    
}


/*1(グー),2(チョキ),3(パー)を入力すると，前もって決めていた
マシンの手を示します．そして「勝ち，負け，引き分け」を表示．
累積度数も示します．*/
function ShowResults(plhand,predhand,resultTimeline){
    /* 勝敗表示を消す */
    var resultTimeline = anime.timeline();

    /* プレイヤーの選択した手を表示する */
    var trY=108;
    var trX=140;
    switch(plhand){
    case 1:
	resultTimeline.add({
	    targets: '.rock_copy',
	    translateX:trX,
	    translateY: -trY,
	    scale: 2,
	    duration: 300,
	    easing: 'easeInOutQuart'
	});
	break;
    case 2:
	resultTimeline.add({
	    targets: '.scissors_copy',
	    translateY: -trY,
	    scale: 2,
	    duration: 300,
	    easing: 'easeInOutQuart'
	});
	break;
    case 3:
	resultTimeline.add({
	    targets: '.paper_copy',
	    translateX:-trX,
	    translateY: -trY,
	    scale: 2,
	    duration: 300,
	    easing: 'easeInOutQuart'
	});
	break;
    }
    // マシンの手を表示
    switch(predhand){
    case 1:
	resultTimeline.add({
	    targets: '.m_rock_copy',
	    translateY: trY,
	    translateX:-trX,
	    scale: 2,
	    duration: 300,
	    offset: '-=100',
	    easing: 'easeInOutQuart'
	});
	break;
    case 2:
	resultTimeline.add({
	    targets: '.m_scissors_copy',
	    translateY: trY,
	    scale: 2,
	    duration: 300,
	    offset: '-=100',
	    easing: 'easeInOutQuart'
	});
	break;
    case 3:
	resultTimeline.add({
	    targets: '.m_paper_copy',
	    translateY: trY,
	    translateX:trX,
	    scale: 2,
	    duration: 300,
	    offset: '-=100',
	    easing: 'easeInOutQuart'
	});
	break;
    }
    
    /* 勝敗の表示 */
    /* (3+predhand-plhand)%3
     * 0 : あいこ
     * 1 : プレイヤーの勝ち
     * 2 : マシンの勝ち */
    switch((3+predhand-plhand)%3){
    case 0:
	resultTimeline.add({
	    targets: '#win',
	    duration: 100,
	    opacity: 0,
	    easing: 'easeInOutQuart'
	});
	results[0][game+1]=results[0][game];
	results[1][game+1]=results[1][game];
	results[2][game+1]=results[2][game]+1;
	break;
    case 1:
	resultTimeline.add({
	    targets: '#win',
	    offset: '-=100',
	    duration: 1,
	    translateY:128
	});
	resultTimeline.add({
	    targets: '#win',
	    offset: '-=100',
	    duration: 100,
	    opacity: 1,
	    easing: 'easeInOutQuart'
	});
	results[0][game+1]=results[0][game]+1;
	results[1][game+1]=results[1][game];
	results[2][game+1]=results[2][game];
	break;
    case 2:
	resultTimeline.add({
	    targets: '#win',
	    offset: '-=100',
	    duration: 1,
	    translateY:-16
	});
	resultTimeline.add({
	    targets: '#win',
	    offset: '-=100',
	    duration: 100,
	    opacity: 1,
	    easing: 'easeInOutQuart'
	});
	results[0][game+1]=results[0][game];
	results[1][game+1]=results[1][game]+1;
	results[2][game+1]=results[2][game];
	break;
    }
    
    if (realtimeResults == __CWTL__)
    {
	var text="";
	if (JorE == __JAPANESE__)
	{
	    text += "<font color='#6970e9'>勝ち:"+results[0][game+1]+"回</font>、<font color='#e9473f'>負け:"+results[1][game+1]+"回</font>、<font color='#319e34'>あいこ:"+results[2][game+1]+"回</font>";
	}
	else
	{
	    text += "<font color='#6970e9'>Wins:"+results[0][game+1] + "</font>, <font color='#e9473f'>Losses:"+results[1][game+1]+"</font>, <font color='#319e34'>Ties:"+results[2][game+1]+"</font>";
	}
	document.getElementById("results").innerHTML = text;
    }
    else if (realtimeResults == __NGAMES__)
    {
	document.getElementById("results").innerHTML = "<font color='#6970e9'>Games played: "+n_rps_plyd+"/" + MatchTo + "</font>";
    }
    
    var Ymax = 0;
    for(var i=0;i<3;i++){
	if(Ymax<results[i][game+1]){
	    Ymax=results[i][game+1];
	}
    }
    

    if (realtimeResults == __CWTL__)
    {
	redraw_graph(Ymax);
    }

    game++;
    if (n_rps_plyd >= MatchTo){
	stopped = true;
	// fin_prc_weightを更新
	var prec=[];
	for(var i=0;i<3;i++) prec[i]=-1;
	prec[plhand-1] = 1;
	
	/* 各予測ユニットの入力と相手の新しい手のコードの符号が
	   一致していない場合に誤り訂正学習を行う */

	if (AImach == __PRC__)
	{		    
	    for(var i=0;i<3;i++){
		for(var j=0;j<3;j++){
		    for(var k=0;k<prc_N;k++)
		    {
			fin_prc_weight += String(prc_weight[i][j][k]) + " ";
		    }
		}
	    }
	}
	else if ((AImach == __MC__) || (AImach == __MC2__))
	{
	    int_state = model.internal_state[model.internal_state.length-1]

	    for(var i=0;i<3;i++){
		for(var j=0;j<3;j++){
		    fin_MC_cndprob += int_state[3*i+j][0].toFixed(4) + " " + int_state[3*i+j][2].toFixed(4) + int_state[3*i+j][4].toFixed(4) + " ";
		}
	    }
	}

	You_win_or_lose(results[0][game],results[1][game]);
    }
}

function redraw_graph(Ymax)
{
    var wrap = d3.select('#graph');
    wrap.select("svg").remove(); // initialization
    var svg = wrap.append("svg").attr("width",graph_base+graph_width).attr("height",graph_height);
    var points=new Array();
    points[0]=new Array();	//勝ち
    points[1]=new Array();	//負け
    points[2]=new Array();	//あいこ
    for(var i=0;i<3;i++){
	for(var j=0;j<game+2;j++){
	    points[i][j]=new Array();
	    points[i][j][0]=graph_base+graph_width*0.9/(game+1)*j;
	    points[i][j][1]=graph_height-graph_height*0.9/(Ymax)*(results[i][j]);
	}
    }
    svg.append("polyline").attr("points",points[0]).attr("stroke","#00A0E9").attr("stroke-width",8).attr("fill","none");
    svg.append("polyline").attr("points",points[1]).attr("stroke","#E60012").attr("stroke-width",8).attr("fill","none");
    svg.append("polyline").attr("points",points[2]).attr("stroke","#ffD700").attr("stroke-width",8).attr("fill","none");
    if(graph_height-10>graph_height*0.9/Ymax*MatchTo){
        svg.append("line").attr("x1", graph_base).attr("x2", graph_base+graph_width).attr("y1", graph_height-graph_height*0.9/Ymax*MatchTo).attr("y2",graph_height-graph_height*0.9/Ymax*MatchTo).attr("stroke","#ff0055").attr("stroke-width",2);
    }
    svg.append("rect").attr("x", graph_base).attr("y", 0).attr("width", graph_width).attr("height", graph_height).attr("fill","none").attr("stroke","#000000").attr("stroke-width",5);
    // ラベル
    svg.append("line").attr("x1", graph_base+graph_width*0.1).attr("x2", graph_base+graph_width*0.3).attr("y1", graph_height*0.2).attr("y2",graph_height*0.2).attr("stroke","#00A0E9").attr("stroke-width",8);

    if( JorE == __JAPANESE__ )
    {
	txtWIN  = "あなたの勝ち";
	txtLOSE = "マシンの勝ち"
	txtTIE  = "　あいこ　"
    }
    else
    {
	txtWIN  = "   You win    "
	txtLOSE = "Perceptron win"
	txtTIE  = "     Tie      "
    }
    
    svg.append("text").text(txtWIN).attr("x",graph_base+graph_width*0.3+10).attr("y",graph_height*0.2).attr({'dy': ".35em", 'fill': "black" });
    svg.append("line").attr("x1", graph_base+graph_width*0.1).attr("x2", graph_base+graph_width*0.3).attr("y1", graph_height*0.2+20).attr("y2",graph_height*0.2+20).attr("stroke","#E60012").attr("stroke-width",8);
    svg.append("text").text(txtLOSE).attr("x",graph_base+graph_width*0.3+10).attr("y",graph_height*0.2+20).attr({'dy': ".35em", 'fill': "black" });
    svg.append("line").attr("x1", graph_base+graph_width*0.1).attr("x2", graph_base+graph_width*0.3).attr("y1", graph_height*0.2+40).attr("y2",graph_height*0.2+40).attr("stroke","#ffD700").attr("stroke-width",8);
    svg.append("text").text(txtTIE).attr("x",graph_base+graph_width*0.3+10).attr("y",graph_height*0.2+40).attr({'dy': ".35em", 'fill': "black" });
    for(var i=0;i<=Math.ceil(Ymax/10);i++){
        svg.append("text").text(String(i*10)).attr("x",graph_base-20).attr("y",graph_height-10-graph_height*0.9/Ymax*10*i).attr({'dy': ".35em", 'fill': "black" });
    }
}

function AI(player){
    //  'player' hand
    //perceptron
    n_rps_plyd += 1

    if (AImach==__PRC__) {
	var prec=[];
	for(var i=0;i<3;i++) prec[i]=-1;
	prec[player-1] = 1;
	
	if (n_rps_plyd % update_evry == 0){
	    for(var i=0;i<3;i++){
		if(prec[i]*pred[i] <= 0){
		    for(var j=0;j<3;j++){
			for(var k=0;k<prc_N;k++){
			    prc_weight[i][j][k] += prec[i]*prc_record[j][k];
			}
		    }
		}
	    }
	}

	for(var i=0;i<3;i++){
	    prc_record[i].unshift(prec[i]);
	    prc_record[i].pop();
	}
	for(var i=0;i<3;i++) pred[i]=0;
	for(var i=0;i<3;i++){
	    for(var j=0;j<3;j++){
		for(var k=0;k<prc_N;k++){
		    pred[i] += prc_weight[i][j][k]*prc_record[j][k];
		}
	    }
	}
	var maxval=pred[0];
	var maxnum = 0;
	for(var i=1;i<3;i++){
	    if(pred[i]>=maxval){
		maxval = pred[i];
		maxnum = i;
	    }
	}
	return(maxnum+1);
    }

    //Markov Chain
    else if ((AImach==__MC__) || (AImach == __MC2__))
    {
	pair2 = pair1;
	if (n_rps_plyd % update_evry == 0) {
	    if (pair2 != '') {
		predict = model.predict(pair2);
		model.update_matrix(pair2, player); 
	    }	
	}
	
	var predictNum = parseInt(predict, 10);
	var mChoice = (predictNum+1) % 3 + 1;
	pair1 = String(mChoice) + String(player);
	
	return(predictNum);
    }
    else
    {

	var rnd = Math.random(); 
	if (rnd < 0.333333) predict=1;
	else if (rnd < 0.6666666) predict=2;
	else predict=3;
	
	return predict;
    }
}

function goon()
{
    //  get out of practice mode
    MatchTo = real_MatchTo;
    nextpageURL = callingPage;
    sessionStorage.setItem("PracticeMode", false);
    document.location.href=callingPage;
}

function practiceagain()
{
    //  stayin practice mode
    MatchTo = real_MatchTo;
    nextpageURL = callingPage;
    sessionStorage.setItem("PracticeMode", true);
    document.location.href=callingPage;
}

function You_win_or_lose(win,lose){
    console.log("You_win_or_lose");
    var youwin = document.getElementById("final_result");
    if (practiceMode)
    {
	var pgo = document.getElementById("top");
	
	pgo.innerHTML = '<BR><BR><BR><BR><BR><BR><BR><BR><CENTER><A href="javascript:goon();"><img src="done_practicing.jpg" height=30/></A><BR><BR><BR><A href="javascript:practiceagain();"><img src="more_practice.jpg" height=30/></A></CENTER><BR>';
	pgo.style.backgroundColor="grey";
	pgo.style.height=600;
	pgo.style.width=500;
	pgo.style.opacity=0.98;
    }
    else{
	if (realtimeResults)
	{
	    if (block == to_block)
	    {
		if (win > lose) {imgsrc = "youwin_done.jpg";} else {imgsrc = "youlost_done.jpg";}
	    }
	    else
	    {
		if (win > lose) {imgsrc = "youwin.jpg";} else {imgsrc = "youlost.jpg";}
	    }
	    youwin.innerHTML = '<img style="opacity:0.75;" src="' + imgsrc + '">';
	}
	else
	{
	    if (block == to_block)
	    {
		youwin.innerHTML = '<img style="opacity:0.75;" src="toquestionnaire.jpg"/>';
	    }
	    else
	    {
		youwin.innerHTML = '<img style="opacity:0.75;" src="nextround.jpg"/>';
	    }
	}
    }
    youwin.style.display="inline";
    
    var res = "Wins: "+results[0][game]+", Losses: "+results[1][game]+", Ties: "+results[2][game];
    var temp = sessionStorage.getItem('result1');
    if (temp == null) {sessionStorage.setItem('result1', res);}
    else {sessionStorage.setItem('result2', res);}
	
    //document.getElementById("final_result3").innerHTML = 'あなたのIQは'+ (110 + (win-lose)*2) +'くらいかな？';
    var retry = document.getElementById("final_result2")
    retry.style.display = "inline";
    //var iq = document.getElementById("final_result3")
    //iq.style.display = "inline";

    if (!practiceMode)
	{
    var resultTimeline = anime.timeline();
    resultTimeline.add({
	targets: '#final_result2',
	opacity:0.0,
	duration: 0,
	translateX:0
    });
    /*    
	  resultTimeline.add({
		translateY: -80,
		targets: '#final_result3',
		opacity:0.0,
		duration: 0,
		translateX:0
	});
*/
    resultTimeline.add({
	targets: '#final_result',
	translateY: 0,
	translateX:0,
	scale: 3,
	opacity:0.0,
	duration: 1,
	easing: 'easeInOutQuart'
    });
    resultTimeline.add({
	targets: '#final_result',
	scale: 1,
	opacity:1.0,
	duration: 100,
	easing: 'easeInOutQuart'
    });
    /*
      resultTimeline.add({
      targets: '#final_result2, #final_result3',
      opacity:1.0,
      duration: 50,
      easing: 'easeInOutQuart'
      });
    */
    resultTimeline.add({
	targets: '#final_result2',
	opacity:1.0,
	duration: 50,
	easing: 'easeInOutQuart'
    });
    /*
      resultTimeline.add({
      targets: '#final_result2, #final_result3',
      opacity:1.0,
      duration: 50,
      easing: 'easeInOutQuart'
      });
*/
    var targets = "#final_result2";
    if (win > lose) {targets += ", #final_result";}

    if (win > lose)
    {
	resultTimeline.add({
	    targets: '#final_result2',
	    opacity:1.0,
	    duration: 50,
	    easing: 'easeInOutQuart'
	});
    }
    else
    {
	resultTimeline.add({
	    targets: '#final_result2, #final_result',
	    opacity:1.0,
	    duration: 50,
	    easing: 'easeInOutQuart'
	});
    }
	}
    else{
	}

    if (!practiceMode)
    {   // don't send 
	send_php();
	//win = results[0][results]
	//sessionStorage.setItem("bl" + block + "wins", 
	win = results[0][game]
	lose = results[1][game]
	tie = results[2][game]
	sessionStorage.setItem("bl" + block + "win", win);
	sessionStorage.setItem("bl" + block + "lose", lose);
	sessionStorage.setItem("bl" + block + "tie", tie);
	setTimeout(() => {  location.href=nextpageURL; }, wait_next);
    }
}

function send_php(){
    // console.log("**************** send_php")
    // r_ini_weight = ini_weight.replace(/ /g, "\n")
    // console.log(r_ini_weight)
    // console.log(fin_weight)
    // r_rec_hands = rec_hands.replace(/ /g, "\n")
    // console.log(r_rec_hands)

    // console.log(rec_hands)
    // console.log(rec_AI_hands)
    // console.log(rec_inp_methd)
// phpへの値の受け渡し

    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    var yr    = startDate.getFullYear().toString().substring(2, 4)
    var mon   = months[startDate.getMonth()]//.toString().padStart(2, "0");
    var day   = startDate.getDate().toString().padStart(2, "0");
    var hr    = startDate.getHours().toString().padStart(2, "0");
    var min   = startDate.getMinutes().toString().padStart(2, "0");
    var sec   = startDate.getSeconds().toString().padStart(2, "0");  
	
    d = yr + mon + day + "-" + hr + min + "-" + sec;

    savedirname = getSessionStorage("savedirname", d);
    if (savedirname == d)
	{   //  savedirname is the default name
	    sessionStorage.setItem("savedirname", d);
	}

    if (AImach == __PRC__)
    {
	$.ajax({
	    type: 'POST',
	    url: php_backend,
	    dataType:'text',
	    data: {
		exptname : exptname,
		savedirname : savedirname,
		rec_hands : rec_hands,
    		rec_AI_hands : rec_AI_hands,
    		rec_times : rec_times,
		rec_input_method : rec_inp_methd,	          
      		ini_weight : ini_prc_weight,
		fin_weight : fin_prc_weight,
		AImach :  AImach,
		block  : block,
		N : prc_N
	    },
	    success: function(data) {
		//location.href = "./test.php";
	    }
	});
    }
    else if ((AImach == __MC__) || (AImach == __MC2__))
    {
	$.ajax({
	    type: 'POST',
	    url: php_backend,
	    dataType:'text',
	    data: {
		exptname : exptname,
		savedirname : savedirname,
		rec_hands : rec_hands,
    		rec_AI_hands : rec_AI_hands,
    		rec_times : rec_times,
		rec_input_method : rec_inp_methd,	          
      		ini_cprob : ini_MC_cndprob,
		fin_cprob : fin_MC_cndprob,
		AImach :  AImach,
		block : block,
                decay : model.decay
	    },
	    success: function(data) {
		//location.href = "./test.php";
	    }
	});
    }
    else
    {
	$.ajax({
	    type: 'POST',
	    url: php_backend,
	    dataType:'text',
	    data: {
		exptname : exptname,
		savedirname : savedirname,
		rec_hands : rec_hands,
    		rec_AI_hands : rec_AI_hands,
    		rec_times : rec_times,
		rec_input_method : rec_inp_methd,	          
		AImach :  AImach,
		block : block,
	    },
	    success: function(data) {
		//location.href = "./test.php";
	    }
	});
    }
}
