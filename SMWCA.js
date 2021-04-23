last_react_action = null;

//  RSP  (goo choki paa)
//  if HUM plays 0 (R), AI winning play is 1 (P)
//WINNING_PLAY = [1, 2, 0]  // (IF RPS)
//  if HUM plays 0 (R), AI winning play is 2 (P)
//  if HUM plays 1 (S), AI winning play is 0 (R)
//  if HUM plays 2 (P), AI winning play is 1 (S)
//WINNING_PLAY = [2, 0, 1]   //  IF (RSP)
WINNING_PLAY = [1, 2, 0]   //  IF (RSP)
//[1, 2, 0]   [2, 0, 1]
//[1, 0, 2]   [2, 1, 0]
CHANGEUP_WT = 0.5;

function append(to_this_list, item)
{
    to_this_list[to_this_list.length] = item;
}

function strategy_changeup(tree, ngramLength, tokenList)
{
    ngram = get_ngram(ngramLength, tokenList);
    treeNode = tree.findPatternEndPoint(ngram);
    if ((treeNode == null) || (treeNode.myNextPlays.length == 0))
    {
        return [randomPlay(), 0];
    }
    myLastPlay = treeNode.myNextPlays[treeNode.myNextPlays.length-1];
    return [WINNING_PLAY[parseInt(myLastPlay)], CHANGEUP_WT];
}

frame = 0;

function strategy_alternate_based_on_my_last(tree, ngramLength, tokenList)
{
    //global frame
    ngram = get_ngram(ngramLength, tokenList)
    treeNode = tree.findPatternEndPoint(ngram)
    if ((treeNode == null) || (treeNode.myNextPlays.length == 0))
    {
        return [randomPlay(), 0];
    }
    myLastPlay = treeNode.myNextPlays[treeNode.myNextPlays.length-1];
    if (n_rps_plyd % 2 == 0)
    {
        return [WINNING_PLAY[parseInt(myLastPlay)], CHANGEUP_WT];
    }
    else
    {
        return [WINNING_PLAY[WINNING_PLAY[parseInt(myLastPlay)]], CHANGEUP_WT];
    }
}

function strategy_alternate_based_on_opp_last(tree, ngramLength, tokenList)
{
    //global frame
    ngram = get_ngram(ngramLength, tokenList)
    treeNode = tree.findPatternEndPoint(ngram)
    if ((treeNode == null) || (treeNode.myNextPlays.length == 0))
    {
        return [randomPlay(), 0];
    }
    oppLastPlay = treeNode.oppNextPlays[treeNode.oppNextPlays.length-1];
    if (n_rps_plyd % 2 == 0)
    {
        return [WINNING_PLAY[parseInt(oppLastPlay)], CHANGEUP_WT];
    }
    else
    {
        return [WINNING_PLAY[WINNING_PLAY[parseInt(oppLastPlay)]], CHANGEUP_WT];
    }
}

function strategy_predict_by_frequency(tree, ngramLength, tokenList)
{
    ngram = get_ngram(ngramLength, tokenList)
    treeNode = tree.findPatternEndPoint(ngram)
    if (treeNode == null)
    {
        return [randomPlay(), 0];
    }
    dist = make_distribution(treeNode.oppNextPlays)
    //for i in [0,1,2]
    console.log(dist)

    for (i = 0; i < 3; i++)
    {
        if ((dist[i] > dist[(i+1)%3]) && (dist[i] > dist[(i+2)%3]))
	{
	    return [WINNING_PLAY[i], dist[i] / (dist[2] + dist[1] + dist[0])]
	}
    }
    //console.log("random play");

    return [randomPlay(), 0]
}

MY_LOWEST_WT = 0.5;

function strategy_my_lowest_freq(tree, ngramLength, tokenList)
{
    ngram = get_ngram(ngramLength, tokenList);
    treeNode = tree.findPatternEndPoint(ngram)
    if (treeNode == null)
    {
        return [randomPlay(), 0];
    }
    dist = make_distribution(treeNode.myNextPlays)
    for (i = 0; i < 3; i++)
    {
        if ((dist[i] < dist[(i+1)%3]) && (dist[i] < dist[(i+2)%3]))
	{
	    return [WINNING_PLAY[i], MY_LOWEST_WT];
	}
    }
    return [randomPlay(), 0];
}

function strategy_predict_by_frequency_last_n(tree, ngramLength, tokenList)
{
    n = 4;
    ngram = get_ngram(ngramLength, tokenList);
    treeNode = tree.findPatternEndPoint(ngram);
    if (treeNode == null)
    {
	return [randomPlay(), 0];
    }
    dist = make_distribution(treeNode.oppNextPlays.slice(treeNode.oppNextPlays.length-n, treeNode.oppNextPlays.length));      // slice
    for (i = 0; i < 3; i++)
    {
        if ((dist[i] > dist[(i+1)%3]) && (dist[i] > dist[(i+2)%3]))
	{
	    return [WINNING_PLAY[i], dist[i] / (dist[2] + dist[1] + dist[0])];
	}
    }
    return [randomPlay(), 0];
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomPlay()
{
    return getRandomInt(0, 2);//random.randint(0, 2)
}

function make_distribution(list)
{
    dist = [0.0, 0.0, 0.0];
    for (ili = 0; ili < list.length; ili++)
    {
	dist[parseInt(list[ili])] += 1;
    }
    //for li in list:
    //    dist[int(li)] += 1
    
    return dist
}
    
class Tree
{
    constructor()
    {
        this.val = null;
        this.root = true;
        this.count = 0;
        this.indexList = [];
        this.myNextPlays = [];
        this.oppNextPlays = [];
        this.children = {};
    }    

    addNextPlays(myNext, oppNext)
    {
        if (myNext != 'X')
	{
	    //this.myNextPlays[this.myNextPlays.length] = myNext;
	    append(this.myNextPlays, myNext);
	}
        if (oppNext != 'X')
	{
	    //this.oppNextPlays[this.oppNextPlays.length] = oppNext;
	    append(this.oppNextPlays, oppNext);
	}
    }

    setVal(val, index)
    {
        this.val = val;
        this.count += 1;
        //this.indexList[this.indexList.length] = index;
	append(this.indexList, index);
    }
        
    addIndex(ind)
    {
        this.count += 1;
	//this.indexList[this.indexList.length] = ind;
	append(this.indexList, ind);
    }

    countPattern(pattern)
    {
        return this.countPattern(pattern, 0);
    }
            
    countPattern(pattern, index)
    {
        if (pattern.length > 0)
	{
            var first = pattern[0];
            var nextToken = 'XX';
            if (pattern.length > 1)
	    {
                nextToken = pattern[1];
	    }
            var oppNext = nextToken[0];
            var myNext = nextToken[1]; 
            //rest = pattern[1:len(pattern)];       // slice
	    var rest = pattern.slice(1, pattern.length);       // slice
	    var child = this.children[first];
            //var child = this.children.get(first, null);

            if (child == null)
	    {
                this.children[first] = new Tree();
                this.children[first].setVal(first, index);
	    }
            else
	    {
                this.children[first].addIndex(index);
	    }
            this.children[first].addNextPlays(myNext, oppNext);
            this.children[first].countPattern(rest, index+1);
	}
    }
    
    findPatternEndPoint(pattern)
    {
        if (pattern.length > 0)
	{
            var first = pattern[0]
            //rest = pattern[1:len(pattern)]        // slice
	    var rest = pattern.slice(1, pattern.length)        // slice
            //var child = this.children.get(first, null)
	    var child = this.children[first];
            if (child != null)
	    {
                return this.children[first].findPatternEndPoint(rest);
	    }
            else
	    {
                return null;
	    }
	}
        else
	{
            return this;
	}
    }
}


function build_ngram_tree(tokenList)
{
    var tree = new Tree();
    
    //for (i in range(len(tokenList)))
    for (var i = 0; i < tokenList.length; i++ )
    {
        //tree.countPattern(tokenList[i:len(tokenList)], i);  // slice
	tree.countPattern(tokenList.slice(i, tokenList.length), i);  // slice
    }
    return tree;
}
    
function get_ngram(ngramLength, tokenList)
{
    //return tokenList[len(tokenList)-ngramLength:len(tokenList)];  // slice
    return tokenList.slice(tokenList.length-ngramLength, tokenList.length);  // slice
}

class SMWCA
{    
    records = [];
    wins = [];
    last_guesses = [];
    ngramSizes = 6;
    opponentMoves = [];
    myMoves = [];
    tokenList = [];

    move_bgrd = [];


    strategyList = [
        strategy_predict_by_frequency_last_n,
        strategy_predict_by_frequency,
	strategy_my_lowest_freq,
	strategy_alternate_based_on_my_last,
	strategy_alternate_based_on_opp_last,
	strategy_changeup];
//
//
//        strategy_my_lowest_freq];
    //strategy_changeup];
    //     strategy_my_lowest_freq,
    //     strategy_predict_by_frequency_last_n,
    //     strategy_alternate_based_on_my_last,
    //     strategy_alternate_based_on_opp_last
    // ];

    constructor(ngs)
    {
	this.ngramSizes = ngs;
    }
    

    // returns suggestion, score, weight
    evaluate_strategy(strategyList, strategyIndex, records, wins, last_guesses, tree, tokenList, ngramLength, counter)
    {
	var strategy = this.strategyList[strategyIndex]
	var ngram = get_ngram(ngramLength, tokenList)
	var sugg_weig    = strategy(tree, ngramLength, tokenList)
	var suggestion   = sugg_weig[0];
	var weight       = sugg_weig[1];
	if (counter >= 1)
	{
	    suggestion = WINNING_PLAY[suggestion];
	}
	if (counter >= 2)
	{
            suggestion = WINNING_PLAY[suggestion];
	}
	var opponentLastPlay = parseInt(tokenList[tokenList.length-1][0]);
	var decline = false;

	if (last_guesses[counter][strategyIndex][ngramLength] == WINNING_PLAY[opponentLastPlay])
	{
            wins[counter][strategyIndex][ngramLength] += 1
            //record[record.length] = 1;
	    append(records[counter][strategyIndex][ngramLength], 1);
	}
	else
	{
            //records[counter][strategyIndex][ngramLength].append(0);
	    //thislist = records[counter][strategyIndex][ngramLength];
	    //thislist[thislist.length] = 0;
	    append(records[counter][strategyIndex][ngramLength], 0)
	}

	var record = records[counter][strategyIndex][ngramLength];
	var score = 0;
	last_guesses[counter][strategyIndex][ngramLength] = suggestion
	if (record.length > 3)
	{
            if (record[record.length-1] == 0) //and record[len(record)-2] == 0 and record[len(record)-3] == 0:
	    {
		score = 0;
	    }
            else
	    {
		score = wins[counter][strategyIndex][ngramLength] / record.length;
	    }
	}
	else
	{
            score = wins[counter][strategyIndex][ngramLength] / record.length
	}
	return [suggestion, score, weight];
    }

    weighted_ngram_tree(ob_last_opp_action)
    {
	//global move_bgrd;
    
	//global records;
	//global wins;
	//global last_guesses;
	//global tokenList;
    
	if ((this.records.length == 0) || (this.records == null))
	{
            this.records = [];
	    this.wins = [];
            this.last_guesses = [];
	    
            //for counter_num in [0,1,2]
	    for (var counter_num = 0; counter_num < 3; counter_num++)// in [0,1,2]
	    {
		//records[records.length] = [];
		append(this.records, []);
		//wins[wins.length] = [];
		append(this.wins, []);
		//last_guesses[last_guesses.length] =[];
		append(this.last_guesses, []);
		//for (strategy_num in range(len(strategyList)))
		for (var strategy_num = 0; strategy_num < this.strategyList.length; strategy_num++)
		{
		    //records[counter_num].append([])
		    append(this.records[counter_num], []);
                    //wins[counter_num].append([])
		    append(this.wins[counter_num], []);
		    //last_guesses[counter_num].append([])
		    append(this.last_guesses[counter_num], []);
                    //for (ngram_size in range(ngramSizes))
		    for (var ngram_size = 0; ngram_size < this.ngramSizes; ngram_size++)
		    {
			//records[counter_num][strategy_num].append([])
			append(this.records[counter_num][strategy_num], [])
			//wins[counter_num][strategy_num].append(0)
			append(this.wins[counter_num][strategy_num], 0)

			//last_guesses[counter_num][strategy_num].append(-1)
			append(this.last_guesses[counter_num][strategy_num], -1)
			//last_guesses[counter_num][strategy_num][last_guesses[counter_num][strategy_num].length] = -1
		    }
		}
	    }
	}

	//opponentMoves[opponentMoves.length] = ob_last_opp_action;
	append(this.opponentMoves, ob_last_opp_action);
	//global last_react_action;
	//myMoves.append(last_react_action);
	//myMoves[myMoves.length] = last_react_action;
	append(this.myMoves, last_react_action);
	
	//tokenList[tokenList.length] = ob_last_opp_action.toString() + last_react_action.toString();

	append(this.tokenList, ob_last_opp_action.toString() + last_react_action.toString());
	
	var maxTokenListLength = 50;
	if (this.tokenList.length > maxTokenListLength)
	{
            this.tokenList = this.tokenList.slice(1, this.tokenList.length)     // slice
	}
	var tree = build_ngram_tree(this.tokenList)
	//scores = [0,0,0]
    
	var highestScore = 0;
	var highestScorePlay = 0;
	var highestScoreWeight = 0;
	var highestScoreCounter = 0;
	var highestScoreStratIndex = 0;
	var highestScorenGramLength = 0;

	var suggestion;
	var score;
	var weight;
	//for ngramLength in range(ngramSizes)
	for (var ngramLength=0; ngramLength <  this.ngramSizes; ngramLength++)
	{
            var ngram = this.tokenList.slice(this.tokenList.length-ngramLength, this.tokenList.length);   // slice
            var node = tree.findPatternEndPoint(ngram)

            //for i in range(len(strategyList))
	    for (var i =0; i < this.strategyList.length; i++ )
	    {
		for (var counter=0; counter < 3; counter++)
		{
                    
		    var x = this.evaluate_strategy(this.strategyList, i, this.records, this.wins, this.last_guesses,tree, this.tokenList, ngramLength, counter)
		    suggestion = x[0];
		    score      = x[1]; 
		    weight     = x[2];
                    if (score > highestScore)
		    {
			highestScore = score
			highestScorePlay = suggestion
			highestScoreWeight = weight
			highestScoreCounter = counter
			highestScoreStratIndex = i
			highestScorenGramLength = ngramLength
		    }
		}
	    }
	}
	console.log(highestScore + "  " + highestScoreStratIndex)
	if (highestScore > 0)
	{
	    last_react_action = highestScorePlay
            //move_bgrd[move_bgrd.length] = [highestScoreStratIndex, highestScoreCounter, highestScorenGramLength]
	    append(this.move_bgrd, [highestScoreStratIndex, highestScoreCounter, highestScorenGramLength]);
            //print('si:',highestScoreStratIndex)
            //print('nl:',ngramLength)
            //print('c:',highestScoreCounter)
	}
	else
	{
            last_react_action = randomPlay()
            //print('q')
	}
	return last_react_action
    }

    tally = 0;

    predict(ob_last_opp_action)  //  ob_last_opp_action is 0, 1, 2
    {
	//global frame, tally, WINNING_PLAY
	//global last_react_action

	if (n_rps_plyd > 5)
	{
            if (last_react_action == WINNING_PLAY[ob_last_opp_action])
	    {
		this.tally += 1
	    }
	    else if (WINNING_PLAY[last_react_action] == ob_last_opp_action)
	    {
		this.tally -= 1
	    }
	}
	//print('AI Score: ', tally);
	//if (observation.step < 2)
	if (n_rps_plyd < 2)
	{
	    last_react_action = getRandomInt(0, 2);

            //last_react_action = random.randint(0,2);
	}
	else
	{
            last_react_action = this.weighted_ngram_tree(ob_last_opp_action)
	}
	//n_rps_plyd += 1
	return last_react_action
    }
}

