<?php
	//  ONE WAY TO DEBUG:  run this directly and see if it saves
	//    file_put_contents("test_php_out", "#  testing");
	//
include "utils.php";

function getVal($key, $default)
{
    if (isset($_POST[$key])) {
	    return $_POST[$key];
    } 
    else {
        echo "no value for:  " . $key;
        return $default;
    }
}

//  if from $TMB, make directory if not there
//  test
//  DATA/RPSrules/050521/
//  DATA/RPSrules/050522/UniqueID/1
//  DATA/RPSrules/050522/UniqueID/2

$ParticipantID         = getVal("ParticipantID", "");
$exptname         = getVal("exptname", "");
$visit           = getVal("visit", "");
$constructStr         = getVal("constructStr", "");
//$savedirname      = getVal("savedirname", "");
$rec_hands        = getVal("rec_hands", "");
$rec_AI_hands     = getVal("rec_AI_hands", "");
$rec_times        = getVal("rec_times", "");
$rec_input_method = getVal("rec_input_method", "");
$AImach           = getVal("AImach", "");
$AIconfigname           = getVal("AIconfigname", "");
$block            = getVal("block", "");

$out_dirname = mkoutdir($exptname, $ParticipantID, $visit);

// else
// {
//     $out_dirname = "../DATA/" . $exptname . "/" . $savedirname;
//     if (!is_dir($out_dirname))
//     {
//         mkdir($out_dirname);
//     }
// }

$file = $out_dirname . "/block" . $block . "_AI" . ".dat";
file_put_contents($file, "#  player hands, AI hands, mv times, inp method, ini_weight, fin_weights, paced_or_free, AI_or_RNG, rps_probs, method\n" );
file_put_contents($file, $constructStr . "\n", FILE_APPEND);
file_put_contents($file, $rec_hands . "\n", FILE_APPEND);
file_put_contents($file, $rec_AI_hands . "\n", FILE_APPEND);
file_put_contents($file, $rec_times . "\n", FILE_APPEND);
file_put_contents($file, $rec_input_method . "\n", FILE_APPEND);
file_put_contents($file, $AImach . "\n", FILE_APPEND);

// $AImach    0 (MC)   1 (PRC)   2 (SMWCA) 3 (RND)
if ($AImach == "1")
{
    $ini_weight       = getVal("ini_weight", "");
    $fin_weight       = getVal("fin_weight", "");
    $N                = getVal("N", "");
    
	file_put_contents($file, $ini_weight . "\n", FILE_APPEND);
    file_put_contents($file, $fin_weight . "\n", FILE_APPEND);
    file_put_contents($file, $N, FILE_APPEND);
}
if ($AImach == "0")
{
    $ini_cprob       = getVal("ini_cprob", "");
    $fin_cprob       = getVal("fin_cprob", "");
    $decay                = getVal("decay", "");
    
	file_put_contents($file, $ini_cprob . "\n", FILE_APPEND);
    file_put_contents($file, $fin_cprob . "\n", FILE_APPEND);
    file_put_contents($file, $decay, FILE_APPEND);
}
if ($AImach == "2")
{
    $move_bgrd       = getVal("move_bgrd", "");
    
    file_put_contents($file, $move_bgrd . "\n", FILE_APPEND);
    file_put_contents($file, $N, FILE_APPEND);
}
?>
