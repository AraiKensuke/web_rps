<?php
	/*  ONE WAY TO DEBUG:  run this directly and see if it saves 
	    file_put_contents("test_php_out", "#  testing");
	    */

    function getVal($key, $default)
    {
        if (isset($_POST[$key])) {
	    return $_POST[$key];
        } else {
            echo "no value for:  $key";	
            return $default;
        }
    }

    $uniq_filename    = getVal("unique_filename", "");
    $rec_hands        = getVal("rec_hands", "");
    $rec_AI_hands     = getVal("rec_AI_hands", "");
    $rec_times        = getVal("rec_times", "");
    $rec_input_method = getVal("rec_input_method", "");
    $ini_weight       = getVal("ini_weight", "");
    $fin_weight       = getVal("fin_weight", "");
    $AImach           = getVal("AImach", "");
    $N                = getVal("N", "");
    
    $file = "taisen_data_sam/rpsm_" . $uniq_filename . ".dat";
    file_put_contents($file, "#  player hands, AI hands, mv times, inp method, ini_weight, fin_weights, paced_or_free, AI_or_RNG, rps_probs, method," );
    file_put_contents($file, "\n", FILE_APPEND);
    file_put_contents($file, $rec_hands, FILE_APPEND);
    file_put_contents($file, "\n", FILE_APPEND);
    file_put_contents($file, $rec_per_hands, FILE_APPEND);
    file_put_contents($file, "\n", FILE_APPEND);
    file_put_contents($file, $rec_times, FILE_APPEND);
    file_put_contents($file, "\n", FILE_APPEND);
    file_put_contents($file, $rec_inp_methd, FILE_APPEND);
    file_put_contents($file, "\n", FILE_APPEND);


    file_put_contents($file, $ini_weight, FILE_APPEND);
    file_put_contents($file, "\n", FILE_APPEND);
    file_put_contents($file, $fin_weight, FILE_APPEND);
    file_put_contents($file, "\n", FILE_APPEND);
    file_put_contents($file, $paced_or_free, FILE_APPEND);
    file_put_contents($file, "\n", FILE_APPEND);
    file_put_contents($file, $AI_or_RNG, FILE_APPEND);
    file_put_contents($file, "\n", FILE_APPEND);
    file_put_contents($file, $rps_probs, FILE_APPEND);
    file_put_contents($file, "\n", FILE_APPEND);
    file_put_contents($file, $method, FILE_APPEND);
    file_put_contents($file, "\n", FILE_APPEND);
    file_put_contents($file, $N, FILE_APPEND);
*/  

    ?>
