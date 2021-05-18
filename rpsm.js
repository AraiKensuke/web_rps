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
var plhand_prev;
var results=[];	// [0]勝ち、[1]負け、[2]あいこ

//  input method   x 2
//  paced or free  x 2
//  AI or RNG      x 2

var wait_next    = 4000;
var update_evry  = 1
var n_rps_plyd   = 0
var __JAPANESE__ = 0
var __ENGLISH__  = 1

var ini_MC_cndprob="";
var fin_MC_cndprob="";

var time_now, last_time_now;
var theDate = new Date();
var startDate = new Date();
last_time_now = theDate.getTime()
var exptname;
var stop_after_n_consec_wins = 10000;
var consec_wins = 0;

var method = "blk1";

var blk = "1";
var count = "0";
var flag = "0";

var __NGAMES__  = 0;   // running number of games played
var __CWTL__ = 1;      // cumulative win, tie, lose
var __CWTL_NOGRAPH__ = 2;      // cumulative win, tie, lose

//"The AI looks at previous game.  If human played R and AI played S there, it looks back into its record of all previous games where human played R and AI played S, and then looks to see how often human next played R, P or S.  The AI then predicts human move in proportion to how frequently that move followed human-R and AI-S.",
//		     "The AI looks at previous game.  If human played R and AI played S there, it looks back into its record of all previous games where human played R and AI played S, and then looks to see how often human next played R, P or S.  The AI then predicts human move that's dependent on how frequently that move followed human-R and AI-S, but in a more 'greedy' fashion, ie it strongly favors moves that are more likely, even if the frequency is very close to the 2nd most likely.",
//		     "Perceptron looks at several previous games, and ", "random"];

var realtimeResultsInfo = [__NGAMES__, __CWTL__, __CWTL_NO_GRAPH__];

//let mrkvchn = new MarkovChain(0.9);
//let prc     = new Perceptron(prc_N);
//let smwca     = new SMWCA(4);
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

function toRPSstr(hand)
{
    if (move_order == __moRSP__)
    {
	if (hand == 1)
	{
	    return "R";
	}
	else if (hand == 2)
	{
	    return "S";
	}
	else
	{
	    return "P";
	}
    }
    else
    {
	if (hand == 1)
	{
	    return "R";
	}
	else if (hand == 2)
	{
	    return "P";
	}
	else
	{
	    return "S";
	}
    }
}

function set_lang(jore)
{
    JorE = jore;

    var elemTITLE = document.getElementById("titleFONT")
    var elemINSTR = document.getElementById("instrFONT")
    var elemPERHF = document.getElementById("perHandFONT")
    var elemDescF = document.getElementById("descFONT")
    var elemResuF = document.getElementById("results")
    var elemAnnoF = document.getElementById("announce")
    var resultTimeline = anime.timeline();

    document.title = "RPS Tournament";
    if (!practiceMode)
    {
	tit = "RPS Tournament: ";
	if (to_block > 1)
	{
	    tit += " Round " + block + "/" + to_block;
	}
    }
    else
    {
	tit = "RPS [PRACTICE MODE]"
    }
    elemTITLE.innerHTML = tit;
    
    elemINSTR.innerHTML = "Your move<BR>click buttons or use keys 123"
    elemPERHF.innerHTML = "Machine move"
    elemDescF.innerHTML = "Play <B><U>" + MatchTo + "</U></B> games!"
    
    if ((realtimeResults == __CWTL__) || (realtimeResults == __CWTL_NOGRAPH__))
    {
	var netWin = (results[0][game]-results[1][game]);
	if (netWin > 0) { var sNetWin = "WINNING +" + netWin;}
	else if (netWin < 0) { var sNetWin = "LOSING " + netWin;}
	else { var sNetWin = "Currently tied";}
	    
	//console.log("CWTL");
	elemResuF.innerHTML = "<font color='#000000'>" + sNetWin+"</font>&nbsp;&nbsp;&nbsp;&nbsp;<font color='#6970e9'>Win:"+results[0][game]+"</font>, <font color='#e9473f'>Los:"+results[1][game]+"</font>, <font color='#319e34'>Tie:"+results[2][game]+"</font>";
    }
    else if (realtimeResults == __NGAMES__)
    {
	if (mid_block == null)
	{
	    elemResuF.innerHTML = "<font color='#6970e9'>Games played: "+n_rps_plyd+"/" + MatchTo + "</font>";
	}
	else
	{
	    elemResuF.innerHTML = "<font color='#6970e9'>Games played: "+n_rps_plyd+"/" + MatchTo + "</font>";
	}
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


//初期化
function Reset(){
    var pgo = document.getElementById("top");
    
    pgo.innerHTML = '<BR><BR><BR><BR><BR><BR><BR><BR><CENTER><SPAN style="color:#FFFF00;font-size:45;">' + MatchTo + ' games against<BR>machine #' + block + '</SPAN><BR><BR><BR><SPAN style="color:#FFFF00;font-size:70;">GO!!!</SPAN></CENTER><BR>';
    pgo.style.backgroundColor="grey";
    pgo.style.height=window.innerHeight;
    pgo.style.width=window.innerWidth;
    pgo.style.opacity=0.95;

    stopped = false;
    //console.log("In Reset()")

    //method_num = Math.floor(Math.random() * 3);
    //console.log("Method chosen: " + String(method_num));

    for(var i=0;i<3;i++){
	results[i]=new Array();
	results[i][0]=0;
    }

    //Match = Number(document.form.match.value);
    game=0;
    rec_hands="";
    rec_AI_hands="";
    document.getElementById("final_result").innerHTML = '';
    //document.getElementById("final_result3").innerHTML = '';
    // 適当な値を相手の手の初期値として指定
    plhand_prev = Math.floor( Math.random() * 3 + 1 );

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
    setTimeout(() => {  pgo.innerHTML = '';
    pgo.style.backgroundColor="grey";
    pgo.style.height=0;
    pgo.style.width=0;
			pgo.style.opacity=0.0;}, 1600);
}


//  1 is ROCK, 2 is SCISSOR, 3 is PAPER
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
    predWhatHumanWillPlay = AI(plhand_prev);  // plhand_prev = 1, 2, 3   //  prediction of HUMAN
    plhand_prev = plhand
    //console.log("************\n" + prettyArray2D(record) + "\n\n" + prettyArray3D(weight))

	/* (pre+1)%3+1はパーセプトロンの予測手predに対して勝つ「手」
	pre=1(グー)   :(pre+1)%3+1=3(パー)
	pre=2(チョキ) :(pre+1)%3+1=1(グー)
	pre=3(パー)   :(pre+1)%3+1=2(チョキ)*/
    //////////////////////  FORMULA correct if 1>2  __moRSP__  /////////////
    //     R=1, S=2, P=3
    //  (AI to play P if AI predicts HUM will play R)
    //  AIhand = 3 if predWhatHumanWillPlay = 1
    //  (AI to play R if AI predicts HUM will play S)
    //  AIhand = 1 if predWhatHumanWillPlay = 2
    //  (AI to play S if AI predicts HUM will play P)
    //  AIhand = 2 if predWhatHumanWillPlay = 3
    if (move_order == __moRSP__)
    {
	AIhand=(predWhatHumanWillPlay+1)%3+1; //gives stronger hand if RSP?
    }

    //////////////////////  FORMULA correct if 2>1  __moRPS__  /////////////
    //     R=1, P=2, S=3
    //  (AI to play P if predict HUM will play R)
    //  AIhand = 2 if predWhatHumanWillPlay = 1
    //  (AI to play S if predict HUM will play P)
    //  AIhand = 3 if predWhatHumanWillPlay = 2
    //  (AI to play R if predict HUM will play S)
    //  AIhand = 1 if predWhatHumanWillPlay = 3
    if (move_order == __moRPS__ )
    {
	AIhand=(predWhatHumanWillPlay+3)%3+1; //gives stronger hand if RSP? -s
    }

    rec_inp_methd += String(key_or_mouse) + " ";
    rec_hands += toRPSstr(plhand) + " ";
    rec_AI_hands += toRPSstr(AIhand) + " ";
    rec_times += String(time_now - last_time_now) + " ";
    last_time_now = time_now;
    ShowResults(plhand,AIhand);
}

function RPS_nodisp(plhand, game) {
    var pre;
    predWhatHumanWillPlay = AI(plhand_prev);  // plhand_prev = 1, 2, 3   //  prediction of HUMAN
    plhand_prev = plhand

    if (move_order == __moRSP__)
    {
	AIhand=(predWhatHumanWillPlay+1)%3+1; //gives stronger hand if RSP?
    }
    if (move_order == __moRPS__ )
    {
	AIhand=(predWhatHumanWillPlay+3)%3+1; //gives stronger hand if RSP? -s
    }    
    s = (3+AIhand-plhand)%3;
    switch((3+AIhand-plhand)%3){
    case 0:
	results[0][game+1]=results[0][game];
	results[1][game+1]=results[1][game];
	results[2][game+1]=results[2][game]+1;
	break;
    case 1:
	results[0][game+1]=results[0][game]+1;
	results[1][game+1]=results[1][game];
	results[2][game+1]=results[2][game];
	break;
    case 2:
	results[0][game+1]=results[0][game];
	results[1][game+1]=results[1][game]+1;
	results[2][game+1]=results[2][game];
	break;
    }
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
	consec_wins = 0;
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
	consec_wins += 1;
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
	consec_wins = 0;
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

    if ((realtimeResults == __CWTL__) || (realtimeResults == __CWTL_NOGRAPH__))
    {
	var text="";
	if (JorE == __JAPANESE__)
	{
	    text += "<font color='#6970e9'>勝ち:"+results[0][game+1]+"回</font>、<font color='#e9473f'>負け:"+results[1][game+1]+"回</font>、<font color='#319e34'>あいこ:"+results[2][game+1]+"回</font>";
	}
	else
	{
	    var netWin = (results[0][game+1]-results[1][game+1]);
	    if (netWin > 0) { var sNetWin = "WINNING +" + netWin;}
	    else if (netWin < 0) { var sNetWin = "LOSING " + netWin;}
	    else { var sNetWin = "Currently tied";}
	    
	    //var netWin = (results[0][game]-results[1][game]);
	    //if (netWin > 0) { var sNetWin = "+" + netWin;}
	    //else if (netWin < 0) { var sNetWin = netWin;}
	    //else { var sNetWin = "0";}
	    
	    text += "<font color='#000000'>"+sNetWin+"</font>&nbsp;&nbsp;&nbsp;&nbsp;<font color='#6970e9'>Win:"+results[0][game+1]+"</font>, <font color='#e9473f'>Los:"+results[1][game+1]+"</font>, <font color='#319e34'>Tie:"+results[2][game+1]+"</font>";
	    //text += "<font color='#6970e9'>Win:"+results[0][game+1] + "</font>, <font color='#e9473f'>Los:"+results[1][game+1]+"</font>, <font color='#319e34'>Tie:"+results[2][game+1]+"</font>";
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
    if ( (n_rps_plyd >= MatchTo) || (consec_wins > stop_after_n_consec_wins) )
    {
	stopped = true;
	// fin_prc_weightを更新
	var prec=[];
	for(var i=0;i<3;i++) prec[i]=-1;
	prec[plhand-1] = 1;

	/* 各予測ユニットの入力と相手の新しい手のコードの符号が
	   一致していない場合に誤り訂正学習を行う */

	rpsAI.done()

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
	txtWIN  = "   Your win    "
	txtLOSE = "Machine win"
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

function AI(player){  // player is 1, 2, 3
    //  'player' hand
    //perceptron
    n_rps_plyd += 1

    if (rpsAI.AImach==__MC__)
    {
	pair2 = pair1;
	if (n_rps_plyd % update_evry == 0) {
	    if (pair2 != '') {
		predict = rpsAI.predict(pair2);
		rpsAI.update_matrix(pair2, player);
	    }
	}

	var predictNum = parseInt(predict, 10);
	var mChoice = (predictNum+1) % 3 + 1;
	pair1 = String(mChoice) + String(player);

	return(predictNum);
    }

    else {
	return (rpsAI.predict(player));
    }
    //Markov Chain
    //else     // else
    // {
    // 	var rnd = Math.random();
    // 	if (rnd < 0.333333) predict=1;
    // 	else if (rnd < 0.6666666) predict=2;
    // 	else predict=3;

    // 	return predict;
    // }
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
	pgo.style.opacity=0.95;
    }
    else{
	if (realtimeResults)
	{
	    if (block == to_block)
	    {
		if (win > lose)        {imgsrc = "youwin_done.png";} 
		else if (win == lose)  {imgsrc = "youtied_done.png";}
		else                   {imgsrc = "youlost_done.png";}
	    }
	    else
	    {
		if (win > lose)        {imgsrc = "youwin.png";} 
		else if (win == lose)  {imgsrc = "youtied.png";}
		else                   {imgsrc = "youlost.png";}
	    }
	    youwin.innerHTML = '<img style="opacity:0.75;" src="' + imgsrc + '">';
	}
	else
	{
	    if (block == to_block)
	    {
		youwin.innerHTML = '<img style="opacity:0.5;" src="toquestionnaire.jpg"/>';
	    }
	    else
	    {
		youwin.innerHTML = '<img style="opacity:0.5;" src="nextround.jpg"/>';
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
	//console.log("going to nextpageURL   " + nextpageURL);
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

    savedirname = getSessionStorage("savedirname", d);  // multiple times rounds, first time we set it by next line
    if (savedirname == d)
    {   //  savedirname is the default name
	sessionStorage.setItem("savedirname", d);
    }

    net_wins = "";

    for (var ii = 0; ii < results[0].length-1; ii++ )
    {
	net_wins += (results[0][ii+1] - results[1][ii+1]).toString();
	if (ii < results[0].length - 2)
	{
	    net_wins += " ";
	}
    }

    sessionStorage.setItem("net_wins" + block, net_wins);
    
    var visitnum = sessionStorage.getItem("visitnum", "");
    var partID   = sessionStorage.getItem("ParticipantID", "");

    sessionStorage.setItem("results" + block, to_str_from_2darray(results));
    if (rpsAI.AImach == __SMWCA__)
    {
	sessionStorage.setItem("move_bgrd" + block, rpsAI.fin_move_bgrd);

	$.ajax({
	    type: 'POST',
	    url: php_backend,
	    dataType:'text',
	    data: {
		exptname : exptname,
		visit : visitnum,
		ParticipantID : partID,
    		rec_AI_hands : rec_AI_hands,
    		rec_times : rec_times,
		rec_input_method : rec_inp_methd,
		move_bgrd : rpsAI.fin_move_bgrd,
		AImach :  rpsAI.AImach,
		constructStr :  rpsAI.constructStr,
		AIconfigname :  rpsAI.AIconfigname,
		block  : block,
	    },
	    success: function(data) {
		//location.href = "./test.php";
	    }
	});
    }

    if (rpsAI.AImach == __OBR__)
    {
	$.ajax({
	    type: 'POST',
	    url: php_backend,
	    dataType:'text',
	    data: {
		exptname : exptname,
		visit : visitnum,
		ParticipantID : partID,
		rec_hands : rec_hands,
    		rec_AI_hands : rec_AI_hands,
    		rec_times : rec_times,
		rec_input_method : rec_inp_methd,
		AImach :  rpsAI.AImach,
		constructStr :  rpsAI.constructStr,
		block  : block,
	    },
	    success: function(data) {
		//location.href = "./test.php";
	    }
	});
    }

    else if (rpsAI.AImach == __PRC__)
    {
	$.ajax({
	    type: 'POST',
	    url: php_backend,
	    dataType:'text',
	    data: {
		exptname : exptname,
		visit : visitnum,
		ParticipantID : partID,
		rec_hands : rec_hands,
    		rec_AI_hands : rec_AI_hands,
    		rec_times : rec_times,
		rec_input_method : rec_inp_methd,
      		ini_weight : rpsAI.ini_prc_weight,
		fin_weight : rpsAI.fin_prc_weight,
		AImach :  rpsAI.AImach,
		AIconfigname :  rpsAI.AIconfigname,
		constructStr :  rpsAI.constructStr,
		block  : block,
		N : rpsAI.prc_N
	    },
	    success: function(data) {
		//location.href = "./test.php";
	    }
	});
    }
    else if (rpsAI.AImach == __MC__)
    {
	$.ajax({
	    type: 'POST',
	    url: php_backend,
	    dataType:'text',
	    data: {
		exptname : exptname,
		visit : visitnum,
		ParticipantID : partID,
		rec_hands : rec_hands,
    		rec_AI_hands : rec_AI_hands,
    		rec_times : rec_times,
		rec_input_method : rec_inp_methd,
      		ini_cprob : rpsAI.ini_MC_cndprob,
		fin_cprob : rpsAI.fin_MC_cndprob,
		AImach :  rpsAI.AImach,
		AIconfigname :  rpsAI.AIconfigname,
		constructStr :  rpsAI.constructStr,
		block : block,
                decay : rpsAI.decay
	    },
	    success: function(data) {
		//location.href = "./test.php";
	    }
	});
    }
    else
    {  // random
	$.ajax({
	    type: 'POST',
	    url: php_backend,
	    dataType:'text',
	    data: {
		exptname : exptname,
		visit : visitnum,
		ParticipantID : partID,
		rec_hands : rec_hands,
    		rec_AI_hands : rec_AI_hands,
    		rec_times : rec_times,
		rec_input_method : rec_inp_methd,
		AImach :  __RND__,
		constructStr :  rpsAI.constructStr,
		AIconfigname :  __RND__,
		block : block,
	    },
	    success: function(data) {
		//location.href = "./test.php";
	    }
	});
    }
}
