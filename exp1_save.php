<?php
	//  ONE WAY TO DEBUG:  run this directly and see if it saves 
	//    file_put_contents("test_php_out", "#  testing");
	//

    function getVal($key, $default)
    {
        if (isset($_POST[$key])) {
	    return $_POST[$key];
        } else {
            echo "no value for:  " . $key;	
            return $default;
        }
    }

    $savedirname      = getVal("savedirname", "");
    $rec_hands        = getVal("rec_hands", "");
    $rec_AI_hands     = getVal("rec_AI_hands", "");
    $rec_times        = getVal("rec_times", "");
    $rec_input_method = getVal("rec_input_method", "");
    $AImach           = getVal("AImach", "");
    $block            = getVal("block", "");

    $out_dirname = "../DATA/exp1/" . $savedirname;
    if (!is_dir($out_dirname))
    {   
        mkdir($out_dirname);
    }

    $file = $out_dirname . "/block" . $block . "_AI" . $AImach . ".dat";
    file_put_contents($file, "#  player hands, AI hands, mv times, inp method, ini_weight, fin_weights, paced_or_free, AI_or_RNG, rps_probs, method\n" );
    file_put_contents($file, $rec_hands . "\n", FILE_APPEND);
    file_put_contents($file, $rec_AI_hands . "\n", FILE_APPEND);
    file_put_contents($file, $rec_times . "\n", FILE_APPEND);
    file_put_contents($file, $rec_input_methd . "\n", FILE_APPEND);
    file_put_contents($file, $AImach . "\n", FILE_APPEND);		

    // $AImach    0 (MC)   1 (MC2)    2 (PRC)   3 (RND)
    if ($AImach == "2")
    {      
        $ini_weight       = getVal("ini_weight", "");
    	$fin_weight       = getVal("fin_weight", "");
        $N                = getVal("N", "");

	file_put_contents($file, $ini_weight . "\n", FILE_APPEND);
        file_put_contents($file, $fin_weight . "\n", FILE_APPEND);
        file_put_contents($file, $N, FILE_APPEND);
    }
    if (($AImach == "0") || ($AImach == "1"))
    {      
        $ini_cprob       = getVal("ini_cprob", "");
    	$fin_cprob       = getVal("fin_cprob", "");
        $decay                = getVal("decay", "");

	file_put_contents($file, $ini_cprob . "\n", FILE_APPEND);
        file_put_contents($file, $fin_cprob . "\n", FILE_APPEND);
        file_put_contents($file, $decay, FILE_APPEND);
    }

?>
