/* 
じゃんけんマシン
 篠本 滋「情報処理概論-予測とシミュレーション」（岩波書店）
 6．5節「じゃんけんマシンを作ってみよう」 pp101-107．
C code:  篠本 滋　2003/05/28．
javascript code:  中村和輝 2018/03/01.
 */

/* player : プレイヤーの直前の手
 * record[3][N] : 過去のプレイヤーの手(3行(rsp)x列)
 * weight[3][3][N] : 重み関数3*N行列
 * pred[3] : 予測ユニットの入力
 */
var graph_height = 440;
var graph_width = 240;
var graph_base = 24;
var game;		// 現在のゲーム数
var predhand;	// 次の予測手
var rec_hands="";	// 記録用
var rec_inp_methd="";	// 記録用
var rec_per_hands="";	// 記録用
var rec_times="";	// 記録用
var results=[];	// [0]勝ち、[1]負け、[2]あいこ

//  input method   x 2
//  paced or free  x 2
//  AI or RNG      x 2

var wait_next    = 7000
var update_evry  = 1
var n_rps_plyd   = 0
var __JAPANESE__ = 0
var __ENGLISH__  = 1
var more=[];
var pred=[];
var weight=[];
var ini_weight="";
var fin_weight="";
var record=[];
var time_now, last_time_now;
var theDate = new Date();
var startDate = new Date();
last_time_now = theDate.getTime()
var save_continue = false

var rps_probs = [];
var method = "blk1";
var N = 2;    // perceptron order

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
	console.log(this.internal_state.length);
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
    console.log(key + "not found ");
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
	document.title = "AI じゃんけんマシン";
	elemTITLE.innerHTML = "AI じゃんけんマシン"
	elemINSTR.innerHTML = "あなたの手<BR>(クリックまたは数字キーで<BR>選んでください)"
	elemPERHF.innerHTML = "マシンの手"
	elemDescF.innerHTML = "このじゃんけんマシンはあなたが手を選ぶ前に次の手を決めています。じゃんけんを繰り返すうちにあなたの手の癖を読み取って徐々に強くなっていきます。最初に40回勝ったほうが優勝です。勝負しましょう。"
	if (realtimeResults == __CWTL__)
	{

	    alert("CWTL");
	    elemResuF.innerHTML = "<font color='#6970e9'>勝ち:"+results[0][game]+"回</font>、<font color='#e9473f'>負け:"+results[1][game]+"回</font>、<font color='#319e34'>あいこ:"+results[2][game]+"回</font>";
	}
	else if (realtimeResults == __NGAMES__)
	{
	    //console.log("NGAMES");
	    //alert("NGAMES");
	    elemResuF.innerHTML = "<font color='#6970e9'>Games played: "+n_rps_plyd+"</font>";
	}

	elemAnnoF.innerHTML = "【お願い】　ジャンケンの手を研究するためにデータを集めていますのでご協力お願いします．ゲームの最後に出てくる「OK」をおしていただければ我々はデータを得ることが出来ます．個人データは流出しません．<br /> <br />【参考文献】 <a href=\"https://www.iwanami.co.jp/book/b264786.html\">篠本 滋「情報処理概論 - 予測とシミュレーション」（岩波書店）</a>6．5節「じゃんけんマシンを作ってみよう」 pp101-107。 <a href=\"http://www.ton.scphys.kyoto-u.ac.jp/~shino/janken_iphone/\">スマホ版アプリ</a>。<a href=\"c.html\"> Cプログラム</a>。 ウェブアプリに関するお問い合わせやコメントは<a href=\"mailto:shinomoto@scphys.kyoto-u.ac.jp?Subject=janken\">篠本 滋</a>までご連絡ください。"
    }
    else
    {
	document.title = "AI rock-scissors-paper";
	elemTITLE.innerHTML = "AI rock-scissors-paper"
	if (practiceMode)
	    {
		elemTITLE.innerHTML = "AI rock-scissors-paper [PRACTICE MODE]"
	    }
	elemINSTR.innerHTML = "Your move<BR>click buttons or use keys 123"
	elemPERHF.innerHTML = "Perceptron move"
	elemDescF.innerHTML = "The first to hit <B><U>" + MatchTo + "</U></B> wins is the winner!"

	if (realtimeResults == __CWTL__)
	{
	    //console.log("CWTL");
	    elemResuF.innerHTML = "<font color='#6970e9'>Win:"+results[0][game]+"</font>, <font color='#e9473f'>Losses:"+results[1][game]+"</font>, <font color='#319e34'>Tie:"+results[2][game]+"</font>";
	}
	else if (realtimeResults == __NGAMES__)
	{
	    //console.log("NGAMES");
	    elemResuF.innerHTML = "<font color='#6970e9'>Games played: "+n_rps_plyd+"</font>";
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
    /*
    for(var i=0;i<3;i++){
	results[i]=new Array();
	results[i][0]=0;
    }
    for(var i=0;i<3;i++){
	weight[i] = new Array();
	for(var j=0;j<3;j++){
	    record[j] = new Array();
	    weight[i][j] = new Array();
	    for(var k=0;k<N;k++){
		record[j][k] = 0;
		weight[i][j][k] = Math.random() * 4 - 2.0;
		ini_weight += String(weight[i][j][k]) + " ";
	    }
	}
    }
*/
    
    stopped = false;
    save_continue = false;
    //console.log("In Reset()")    
    ini_weight="";
	fin_weight="";
	rps_probs=[];
	//method_num = Math.floor(Math.random() * 3);
	//console.log("Method chosen: " + String(method_num));


    for(var i=0;i<3;i++){
	results[i]=new Array();
	results[i][0]=0;
	weight[i] = new Array();
	
	for(var j=0;j<3;j++){
	    record[j] = new Array();
	    weight[i][j] = new Array();

	    //   initially, don't set the weights farther back in time
	    for(var k=0;k<N;k++){
		record[j][k] = 0;    
		weight[i][j][k] = (k < 2) ? Math.random() * 4 - 2.0 : 0;
		ini_weight += String(weight[i][j][k]) + " ";
	    }
	}
	pred[i] = 0;
	results[i][0]=0;
    }

    //Match = Number(document.form.match.value);
    game=0;
    rec_hands="";   
    rec_per_hands="";
    document.getElementById("final_result").innerHTML = '';
    //document.getElementById("final_result3").innerHTML = '';
    // 適当な値を相手の手の初期値として指定
    //var plhand = Math.floor( Math.random() * 3 + 1 );
    plhand_prev = 1;  //start with goo
    //var pre = perceptron(plhand);
    /* (pre+1)%3+1はパーセプトロンの予測手predに対して勝つ「手」
       pre=1(グー)   :(pre+1)%3+1=3(パー)
       pre=2(チョキ) :(pre+1)%3+1=1(グー)
       pre=3(パー)   :(pre+1)%3+1=2(チョキ)*/
    //predhand=(pre+1)%3+1;
    
    //rec_hands += String(plhand) + " "
    //rec_per_hands += String(predhand) + " "
    //rec_times += "0 "
    
    //var resultTimeline = anime.timeline();
	// 描画の初期化

	//UNCOMMENT THIS AND REDRAW_GRAPH CALLS TO SHOW GRAPH
    // var wrap = d3.select('#graph');
    // wrap.select("svg").remove(); // initialization
    // var svg = wrap.append("svg").attr("width",graph_base+graph_width).attr("height",graph_height);
    // svg.append("rect").attr("x", graph_base).attr("y", 0).attr("width", graph_width).attr("height", graph_height).attr("fill","#ffffff").attr("stroke","#000000").attr("stroke-width",5);
    // //svg.append("line").attr("x1", graph_base).attr("x2", graph_base+graph_width).attr("y1", graph_height*0.1).attr("y2",graph_height*0.1).attr("stroke","#ff0055").attr("stroke-width",2);
    // // ラベル
    // svg.append("line").attr("x1", graph_base+graph_width*0.1).attr("x2", graph_base+graph_width*0.3).attr("y1", graph_height*0.2).attr("y2",graph_height*0.2).attr("stroke","#00A0E9").attr("stroke-width",8);
    
    // if (JorE == __JAPANESE__)
    // {
	// svg.append("text").text("あなたの勝ち").attr("x",graph_base+graph_width*0.3+10).attr("y",graph_height*0.2).attr({'dy': ".35em", 'fill': "black" });
	// svg.append("line").attr("x1", graph_base+graph_width*0.1).attr("x2", graph_base+graph_width*0.3).attr("y1", graph_height*0.2+20).attr("y2",graph_height*0.2+20).attr("stroke","#E60012").attr("stroke-width",8);
	// svg.append("text").text("マシンの勝ち").attr("x",graph_base+graph_width*0.3+10).attr("y",graph_height*0.2+20).attr({'dy': ".35em", 'fill': "black" });
	// svg.append("line").attr("x1", graph_base+graph_width*0.1).attr("x2", graph_base+graph_width*0.3).attr("y1", graph_height*0.2+40).attr("y2",graph_height*0.2+40).attr("stroke","#ffD700").attr("stroke-width",8);
	// svg.append("text").text("　　あいこ　").attr("x",graph_base+graph_width*0.3+10).attr("y",graph_height*0.2+40).attr({'dy': ".35em", 'fill': "black" });
	
	// svg.append("text").text("0").attr("x",graph_base-20).attr("y",graph_height-10).attr({'dy': ".35em", 'fill': "black" });
	// document.getElementById("results").innerHTML = "<font color='#6970e9'>勝ち:0回</font>、<font color='#e9473f'>負け:0回</font>、<font color='#319e34'>あいこ:0回</font>";
    // }
    // else
    // {
	// svg.append("text").text("Your wins").attr("x",graph_base+graph_width*0.3+10).attr("y",graph_height*0.2).attr({'dy': ".35em", 'fill': "black" });
	// svg.append("line").attr("x1", graph_base+graph_width*0.1).attr("x2", graph_base+graph_width*0.3).attr("y1", graph_height*0.2+20).attr("y2",graph_height*0.2+20).attr("stroke","#E60012").attr("stroke-width",8);
	// svg.append("text").text("AI wins").attr("x",graph_base+graph_width*0.3+10).attr("y",graph_height*0.2+20).attr({'dy': ".35em", 'fill': "black" });
	// svg.append("line").attr("x1", graph_base+graph_width*0.1).attr("x2", graph_base+graph_width*0.3).attr("y1", graph_height*0.2+40).attr("y2",graph_height*0.2+40).attr("stroke","#ffD700").attr("stroke-width",8);
	// svg.append("text").text("　Ties  ").attr("x",graph_base+graph_width*0.3+10).attr("y",graph_height*0.2+40).attr({'dy': ".35em", 'fill': "black" });
	
	// svg.append("text").text("0").attr("x",graph_base-20).attr("y",graph_height-10).attr({'dy': ".35em", 'fill': "black" });
	// document.getElementById("results").innerHTML = "<font color='#6970e9'>Wins: 0</font>、<font color='#e9473f'>Losses: 0</font>、<font color='#319e34'>Ties: 0</font>";
    // }

    /* 勝敗表示を消す */
    var win_elem = document.getElementById("win");
    win_elem.style.opacity = 0;
    
    // resultTimeline.add({
    // 	targets: '#win',
    // 	duration: 1,
    // 	opacity: 0,
    // 	easing: 'easeInOutQuart'
    // });
    /* マシンの手をもどす */

    do1st = anime.timeline()
    do1st.add({	
    	targets: ['.m_rock_copy', '.m_scissors_copy', '.m_paper_copy', '.rock_copy', '.scissors_copy', '.paper_copy'],
    	translateY: 0, translateX:0, 
    	scale: 1, duration: 1, easing: 'linear'
    });
    
    // resultTimeline.add({
    // 	targets: '.m_rock_copy, .m_scissors_copy, .m_paper_copy',
    // 	translateY: 0,
    // 	translateX:0,
    // 	scale: 1,
    // 	duration: 1,
    // 	easing: 'easeInOutQuart'
    // });
    // /* プレイヤーの出した手を戻す */
    // resultTimeline.add({
    // 	targets: '.rock_copy, .scissors_copy, .paper_copy',
    // 	translateY: 0,
    // 	translateX:0,
    // 	scale: 1,
    // 	duration: 1,
    // 	easing: 'easeInOutQuart'
    // });
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
    if (AI_or_RNG == __AI__) {
		// if (AImach == "2") {pre=AI(plhand_prev);}
		// //for perceptron
		// else {pre=AI(plhand);}/* predhand　は次の予測手(1,2,3) */
		// //changed from prev to current plhand for MC
	pre = AI(plhand_prev);
    } else {
		var rnd = Math.random();
		if (rnd < 0.333333) {pre=1;}
		else if (rnd < 0.6666666){pre=2;}
		else{pre=3;}	
    }
    plhand_prev = plhand
    //console.log("************\n" + prettyArray2D(record) + "\n\n" + prettyArray3D(weight))
	       
	/* (pre+1)%3+1はパーセプトロンの予測手predに対して勝つ「手」
	pre=1(グー)   :(pre+1)%3+1=3(パー)
	pre=2(チョキ) :(pre+1)%3+1=1(グー)
	pre=3(パー)   :(pre+1)%3+1=2(チョキ)*/
    predhand=(pre+1)%3+1; //gives stronger hand if RSP? -s

    rec_inp_methd += String(key_or_mouse) + " ";
    rec_hands += String(plhand) + " ";
    rec_per_hands += String(predhand) + " ";
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
	    duration: 200,
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
	    duration: 200,
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
	    duration: 200,
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
	document.getElementById("results").innerHTML = "<font color='#6970e9'>Games played: "+n_rps_plyd+"</font>";
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
		// fin_weightを更新
		var prec=[];
		for(var i=0;i<3;i++) prec[i]=-1;
		prec[plhand-1] = 1;
		fin_weight = ""

		/* 各予測ユニットの入力と相手の新しい手のコードの符号が
		一致していない場合に誤り訂正学習を行う */
		for(var i=0;i<3;i++){
			for(var j=0;j<3;j++){
			for(var k=0;k<N;k++){
				fin_weight += String(weight[i][j][k]) + " ";
			}
			}
		}
	        You_win_or_lose(results[0][game],results[1][game]);
	}

    // if(results[0][game]>=MatchTo){
	// stopped = true;
	// // fin_weightを更新
	// var prec=[];
	// for(var i=0;i<3;i++) prec[i]=-1;
	// prec[plhand-1] = 1;
	// fin_weight = ""

	// /* 各予測ユニットの入力と相手の新しい手のコードの符号が
	//    一致していない場合に誤り訂正学習を行う */
	// for(var i=0;i<3;i++){
	//     for(var j=0;j<3;j++){
	// 	for(var k=0;k<N;k++){
	// 	    fin_weight += String(weight[i][j][k]) + " ";
	// 	}
	//     }
	// }
	// Youwin(results[0][game],results[1][game]);
    // }
    // else if(results[1][game]>=MatchTo){
	// stopped = true;
	// // fin_weightを更新
	// var prec=[];
	// fin_weight = ""	
	// for(var i=0;i<3;i++) prec[i]=-1;
	// prec[plhand-1] = 1;

	// /* 各予測ユニットの入力と相手の新しい手のコードの符号が
	//    一致していない場合に誤り訂正学習を行う */
	// for(var i=0;i<3;i++){
	//     for(var j=0;j<3;j++){
	// 	for(var k=0;k<N;k++){
	// 	    fin_weight += String(weight[i][j][k]) + " ";
	// 	}
	//     }
	// }
	// Youlose(results[0][game],results[1][game]);
    // }
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
	if (AImach==__PRC__) {
	    console.log("perceptron");
		var prec=[];
		for(var i=0;i<3;i++) prec[i]=-1;
		prec[player-1] = 1;

		if (n_rps_plyd % update_evry == 0){
		for(var i=0;i<3;i++){
			if(prec[i]*pred[i] <= 0){
				for(var j=0;j<3;j++){
					for(var k=0;k<N;k++){
						weight[i][j][k] += prec[i]*record[j][k];
					}
				}
			}
		}
		}
		n_rps_plyd += 1
		for(var i=0;i<3;i++){
			record[i].unshift(prec[i]);
			record[i].pop();
		}
		for(var i=0;i<3;i++) pred[i]=0;
		for(var i=0;i<3;i++){
			for(var j=0;j<3;j++){
				for(var k=0;k<N;k++){
					pred[i] += weight[i][j][k]*record[j][k];
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
	else {
	    console.log("predict is   " + predict);
		if (predict==0) {
			var rnd = Math.random(); 
			if (rnd < 0.333333) predict=1;
			else if (rnd < 0.6666666) predict=2;
			else predict=3;
		}
	
		pair2 = pair1;
		if (n_rps_plyd % update_evry == 0) {
			if (pair2 != '') {
				predict = model.predict(pair2);
				model.update_matrix(pair2, player); 
			}	
		}
		n_rps_plyd += 1;
	
		var predictNum = parseInt(predict, 10);
		var mChoice = (predictNum+1) % 3 + 1;
		pair1 = String(mChoice) + String(player);
	
		return(predictNum);

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
    if (realtimeResults)
    {
	if (win > lose) {imgsrc = "youwon.png";} else {imgsrc = "youlost.png";}
	youwin.innerHTML = '<img src="' + imgsrc + '">';
    }
    else
    {
	if (practiceMode)
	    {
		var pgo = document.getElementById("top");

		pgo.innerHTML = '<BR><BR><BR><BR><BR><BR><BR><BR><CENTER><A href="javascript:goon();"><img src="done_practicing.jpg" height=30/></A><BR><BR><BR><A href="javascript:practiceagain();"><img src="more_practice.jpg" height=30/></A></CENTER><BR>';
		pgo.style.backgroundColor="grey";
		pgo.style.height=600;
		pgo.style.width=500;
		pgo.style.opacity=0.98;
	    }
	else
	    {
		youwin.innerHTML = '<img src="nextround.jpg">';
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
    // console.log(rec_per_hands)
    // console.log(rec_inp_methd)
// phpへの値の受け渡し

    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    var yr    = startDate.getFullYear().toString().substring(2, 4)
    var mon   = months[startDate.getMonth()]//.toString().padStart(2, "0");
    var day   = startDate.getDate().toString().padStart(2, "0");
    var hr    = startDate.getHours().toString().padStart(2, "0");
    var min   = startDate.getMinutes().toString().padStart(2, "0");
    var sec   = startDate.getSeconds().toString().padStart(2, "0");  
	
	if ((blk=="1"&&flag=="0") || (count=="1"&&flag=="1")) {
		d = yr + mon + day + "-" + hr + min + "-" + sec;
		sessionStorage.setItem('d', d);
		uniq_fname = d + "-" + method;
	} else {
		var d = sessionStorage.getItem('d');
    	uniq_fname = d + "-" + method;
	}
	
	method1 = sessionStorage.getItem('method1');
	if (method1==null){
		sessionStorage.setItem('method1', method);
		console.log(sessionStorage.getItem('method1'));
	} else {
		sessionStorage.setItem('method2', method);
		console.log(sessionStorage.getItem('method2'));
	}
	console.log(uniq_fname);
	
	

    $.ajax({
	type: 'POST',
	url: '../rpsm_sam.php',
	dataType:'text',
	data: {
	    unique_filename : uniq_fname,
	    name1 : rec_hands,
    	    name2 : rec_per_hands,
    	    name3 : rec_times,
	    name4 : rec_inp_methd,	          
      	    name5 : ini_weight,
	    name6 : fin_weight,
	    name7 : paced_or_free,
	    name8 : AI_or_RNG,
	    name9: rps_probs,
	    name10: method,
	    name11 : N
	},
	success: function(data) {
	    //location.href = "./test.php";
	}
    });
}
